console.log('s');
console.log(Quagga);
var scanner = document.getElementById('barcode-scanner');

function order_by_occurrence(arr){
    var counts = {};
    arr.forEach(function(value){
        if(!counts[value]){
            counts[value] = 0;
        }
        counts[value]++;
    });

    var items = Object.keys(counts).map(function(key) {
        return [key, counts[key]];
      });
      
      // Sort the array based on the second element
    return items.sort(function(first, second) {
        return second[1] - first[1];
      });
    
    
}

function load_quagga() {
    if ( navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        console.log('finish');

        var last_result = [];
        if(Quagga.initialized == undefined){
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

            Quagga.onDetected(function(result){
                console.log('detected');
                var last_code = result.codeResult.code;
                console.log(last_code+'/n');
                console.log(result); //debug

                last_result.push(last_code);
                console.log(last_result.length);

                if(last_result.length > 20){
                    console.log(last_result);
                    code = order_by_occurrence(last_result);
                    code = code[0][0];
                    console.log(order_by_occurrence(last_result));
                    console.log('/n'+last_result);
                    last_result = [];
                    alert(code);
                    //Quagga.stop();
                    // $.ajax({
                    //     type: "POST",
                    //     url: "/products/get_barcode",
                    //     data: {upc: code}
                    // });
                }
                
            })
        }

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                numOfWorkers: navigator.hardwareConcurrency,
                target: document.querySelector('#barcode-scanner')  // Or '#yourElement' (optional)
            },
            decoder: {
                // readers: ["code_39_reader", "code_39_vin_reader"]

                //readers: ["code_128_reader" ]
                readers: ["ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "code_128_reader"]
            }
        }, function (err) {
            if (err) {
                
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.initialized = true;
            Quagga.start();
        });

       
       
    }
}

load_quagga();
$(document).on('turbolinks:load', load_quagga);