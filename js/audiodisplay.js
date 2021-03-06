var canvas = document.getElementById("view1");

function drawWave( width, height, canvasCtx, toneAnalyser ) {
    function draw() {
        drawVisual = requestAnimationFrame(draw);
        var bufferLength = toneAnalyser.size;
        var dataArray = toneAnalyser.getValue();

        var centerX = width / 2;
        var centerY = height / 2;
        var radius = width / 3;

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, width, height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();
      
        var sliceWidth = width * 1.0 / bufferLength;
        var x = 0;
      
        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] * 200.0;
          var y = height/2 + v;
      
          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
    };

    draw();
}

function drawPolarWave( width, height, canvasCtx, toneAnalyser ) {
    const randInt = () => Math.floor(Math.random() * (255 - 10 + 1)) + 10;
    var colorCursor = 360.0;

    [R, G, B] = new Array(3).fill(0).map(randInt);

    function draw() {
        drawVisual = requestAnimationFrame(draw);
        var bufferLength = toneAnalyser.size;
        var dataArray = toneAnalyser.getValue();

        var centerX = width / 2;
        var centerY = height / 2;
        var radius = width / 3;
        
        canvasCtx.clearRect(0, 0, width * 2, height * 2);
        // canvasCtx.moveTo(centerX, centerY);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, width, height);

        canvasCtx.lineWidth = 5;
        canvasCtx.lineJoin = 'round';
        
        canvasCtx.beginPath();
      
        var arcLength = 2.0 * Math.PI / bufferLength;
        const fn = t => 1 - Math.sin(t);
      
        for(var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] * 1
            var r = Math.max(radius * 0.8, radius * fn(v))
            var x = centerX + r * Math.cos(arcLength * i);
            var y = centerY + r * Math.sin(arcLength * i);

            canvasCtx.lineTo(x, y);
            canvasCtx.strokeStyle = `hsl(${colorCursor}, 100%, 50%)`
        }
        // var r = Math.max(radius * fn( dataArray[0]))
        // var x = centerX + r * Math.cos(arcLength * 0);
        // var y = centerY + r * Math.sin(arcLength * 0);
        // canvasCtx.lineTo(x, y);

        colorCursor = (colorCursor < 1) ? 360.0 : colorCursor - 0.1;
        canvasCtx.stroke();
    };

    draw();
}

//attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start()
    console.log('audio is ready');
    window.player = new Tone.Player({
        url: 'https://tonejs.github.io/audio/berklee/gong_1.mp3', //'http://127.0.0.1:5500/sounds/fightclub.ogg',
        loop: true,
    })
    window.analyser = new Tone.Analyser({type: 'waveform', size: 1024, smoothing: 1});
    
    drawPolarWave( canvas.width, canvas.height, canvas.getContext('2d'), analyser ); 
    player.connect(analyser);
    analyser.connect(Tone.Destination);

    Tone.loaded().then(() => player.start());
})