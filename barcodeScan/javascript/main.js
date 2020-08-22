console.log('s');
console.log(Quagga);
var scanner = document.getElementById('barcode-scanner');
flipBtn = document.querySelector('#flip-btn');

let supports = navigator.mediaDevices.getSupportedConstraints();
if (supports['facingMode'] === true) {
    flipBtn.disabled = false;
}

shouldFaceUser = true;

function order_by_occurrence(arr) {
    var counts = {};
    arr.forEach(function (value) {
        if (!counts[value]) {
            counts[value] = 0;
        }
        counts[value]++;
    });

    var items = Object.keys(counts).map(function (key) {
        return [key, counts[key]];
    });

    // Sort the array based on the second element
    return items.sort(function (first, second) {
        return second[1] - first[1];
    });


}

function load_quagga() {
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        console.log('finish');

        var last_result = [];
        if (Quagga.initialized == undefined) {
            console.log('defind');
            Quagga.onProcessed(function (result) {
                var drawingCtx = Quagga.canvas.ctx.overlay,
                    drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#000", lineWidth: 4 });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 5 });
                    }
                }
            });

            Quagga.onDetected(function (result) {
                console.log('detected');
                var last_code = result.codeResult.code;
                console.log(last_code + '/n');
                console.log(result); //debug

                last_result.push(last_code);
                console.log(last_result.length);

                if (last_result.length > 20) {
                    console.log(last_result);
                    code = order_by_occurrence(last_result);
                    code = code[0][0];
                    console.log(order_by_occurrence(last_result));
                    console.log('/n' + last_result);
                    last_result = [];
                    // var audio = new Audio('audio_file.mp3');
                    // audio.play()
                    // alert(code);
                    new Audio('../../sound/beep-sound.mp3').play();
                    Quagga.stop();
    
                    document.querySelector('#show-code').innerHTML = 'โค๊ดของคุณคือ : '+ code;
     
                        $('#correctModal').modal('show');
                
                    setTimeout(load_quagga(), 10000);

                }

            })
        }

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facing: shouldFaceUser ? "user" : "environment"
                },
                target: document.querySelector('#barcode-scanner'),
                area: { // defines rectangle of the detection/localization area
                    top: "0%",    // top offset
                    right: "0%",  // right offset
                    left: "0%",   // left offset
                    bottom: "0%"  // bottom offset
                },
                singleChannel: false // true: only the red color-channel is read
            },
            tracking: false,
            debug: false,
            controls: false,
            locate: true,
            numOfWorkers: 4,
            visual: {
                show: true
            },
            decoder: {
                drawBoundingBox: false,
                showFrequency: false,
                drawScanline: true,
                showPattern: false,
                readers: ["code_39_vin_reader", "code_39_reader"]
            },
            locator: {
                halfSample: true,
                patchSize: "medium", // x-small, small, medium, large, x-large
                showCanvas: false,
                showPatches: false,
                showFoundPatches: false,
                showSkeleton: false,
                showLabels: false,
                showPatchLabels: false,
                showRemainingPatchLabels: false,
                boxFromPatches: {
                    showTransformed: false,
                    showTransformedBox: false,
                    showBB: false
                }
            }
        }, function (err) {
            if (err) {

                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.initialized = true;
            Quagga.start();
            Quagga.isFrontCamera = !Quagga.isFrontCamera;
            var c = document.querySelector('.drawingBuffer')
            var ctx = c.getContext("2d");
            // var x1 = 
            console.log(ctx.canvas.width);
            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "#49f";  // Green path
            ctx.moveTo(ctx.canvas.width / 3.5, ctx.canvas.height / 2);
            ctx.lineTo(ctx.canvas.width / 2 + ctx.canvas.width / 5, ctx.canvas.height / 2);
            ctx.stroke();  // Draw it
        });



    }
}

load_quagga();

// สลับกล้อง
flipBtn.addEventListener('click', function () {
    Quagga.initialized = null;
    shouldFaceUser = !shouldFaceUser;
    console.log(Quagga)
    Quagga.stop();
    load_quagga();
})