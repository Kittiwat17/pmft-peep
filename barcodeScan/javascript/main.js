console.log('s');
console.log(Quagga);
var scanner = document.getElementById('barcode-scanner');
flipBtn = document.querySelector('#flip-btn');


let supports = navigator.mediaDevices.getSupportedConstraints();
if (supports['facingMode'] === true) {
    flipBtn.disabled = false;
}



shouldFaceUser = false;

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

                // if (result) {
                //     if (result.boxes) {
                //         drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

                //     }

                //     if (result.box) {
                //         Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#000", lineWidth: 4 });
                //     }

                //     if (result.codeResult && result.codeResult.code) {
                //         Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 5 });
                //     }
                // }
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
                    
                    firebase.database().ref("outside-user").once('value', function (snapshot) {
                        var list = snapshot.val()
                        if (code in list) {
                          // if has data
                          // console.log('True')
                          checkInOutOutside(code);
                        //   $('#correctModal').modal('show');
                        } else {
                          //if not has data in list
                          // console.log('False')
                          $("#failedModal").modal('show');
                          $('#failedModal').on('shown.bs.modal', function () {
                                $(this).delay(1200).fadeOut(500, function () {
                                    $(this).modal('hide');
                                });
                          })
                        }
                      })    

                    document.querySelector('#show-code').innerHTML = 'โค๊ดของคุณคือ : ' + code;


                    setTimeout(load_quagga(), 3000);

                }

            })
        }

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                constraints: {
                    width: 600,
                    height: 1200,
                    facingMode: shouldFaceUser ? "user" : "environment"
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
                readers: ["code_39_vin_reader", "code_39_reader", "code_128_reader"]
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
            ctx.lineWidth = "7";
            ctx.strokeStyle = "#f00";  // Green path
            ctx.moveTo(ctx.canvas.width / 6 * 2, ctx.canvas.height / 2);
            ctx.lineTo((ctx.canvas.width / 6) * 4, ctx.canvas.height / 2);
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


// function checkInOut(code) {
//     var user = firebase.auth().currentUser;
//     if (user) {
//         var uid = user.uid;
//         //user in system
//         var path = firebase.database().ref('users-store/' + uid)
//         path.once('value').then(function (snapshot) {
//             var a = snapshot.child("customer").exists();
//             if (a) {
//                 firebase.database().ref("users-store/" + uid + '/customer').once('value', function (snapshot) {
//                     var temp = snapshot.val()
//                     console.log(temp)
//                     if (temp.includes(code)) {
//                         console.log(temp)
//                         const index = temp.indexOf(code);
//                         if (index > -1) {
//                             temp.splice(index, 1);
//                         }
//                         database.ref("users-store/" + uid).update({ customer: temp })
//                     } else {
//                         temp.push(code)
//                         console.log(temp)
//                         database.ref("users-store/" + uid).update({ customer: temp })
//                     }
//                 });



//             } else {
//                 var customer = []
//                 customer.push(code)
//                 console.log(customer)
//                 firebase.database().ref("users-store/" + uid).update({
//                     'customer': customer
//                 })
//             }
//         })
//     } else {
//         alert("Please login again")
//         window.location.href = "../../index.html"
//     }
// }