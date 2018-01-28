
//						Aplicaciones - Tonos Puros y Frecuencia 						    //
//				** Aplicacion Web De Entrenamiento Auditivo Técnico ** 						//		
//				**            Para Ingenieros de Sonido. 			**						//
// -----------------------------------------------------------------------------------------//

// 									Audio Context
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var Volume = 100; // Master Volume

var masterLevel = audioCtx.createGain(); // Master Level
	masterLevel.gain.value = 1;
	masterLevel.connect(audioCtx.destination);

var oscillator = audioCtx.createOscillator(); // Oscillator for sineGen
	oscillator.type = "sine";
	oscillator.start();

var oscillatorSweep = audioCtx.createOscillator(); // Oscillator for sineSweep
	oscillatorSweep.type = "sine";
	oscillatorSweep.frequency.value = 20;
	oscillatorSweep.start();

var squareOscillator = audioCtx.createOscillator(); // Oscillator for Square Wave
	squareOscillator.type = "square";
	squareOscillator.start();

function getData(url)
{
	source = audioCtx.createBufferSource();
	request = new XMLHttpRequest();

	request.open ('GET', url, true);

	request.responseType = 'arraybuffer';

	request.onload = function()
	{
		var audioData = request.response;
		
		audioCtx.decodeAudioData (audioData, function (buffer)
		{
			myBuffer = buffer;
			songLength = buffer.duration;
			source.buffer = myBuffer;
			source.connect(masterLevel);
			source.loop = true;
		},

		function(e){"Error with decoding audio data" + e.err});	
	}

	request.send();

	source.start(0);
}

var whiteNoise = audioCtx.createScriptProcessor (4096, 1, 1);
	whiteNoise.onaudioprocess = function (e)
	{
		var whiteOutput = e.outputBuffer.getChannelData(0);
		for (var i = 0; i < whiteOutput.length; i++)
		{
			whiteOutput[i] = Math.random() * 2 - 1;
		}
	}; // White Noise	

var pinkNoise = audioCtx.createScriptProcessor (512, 1, 1);
	var b0, b1, b2, b3, b4, b5, b6;
	b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;
	pinkNoise.onaudioprocess = function (e)
	{
		var pinkOutput = e.outputBuffer.getChannelData(0);
		for (var i = 0; i < pinkOutput.length; i++)
		{
			var white = Math.random() * 2 - 1;
			b0 = 0.99886 * b0 + white * 0.0555179;
			b1 = 0.99332 * b1 + white * 0.0750759;
			b2 = 0.96900 * b2 + white * 0.1538520;
			b3 = 0.86650 * b3 + white * 0.3104856;
			b4 = 0.55000 * b4 + white * 0.5329522;
			b5 = -0.7616 * b5 - white * 0.0168980;
			pinkOutput[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
			pinkOutput[i] *= 0.211
			b6 = white * 0.115926;
		}
	}; // Pink Noise

var filter = audioCtx.createBiquadFilter();
	filter.frequency.value = 1000;
	filter.type = "bandpass";
	whiteNoise.connect (filter); // Filtering Node

var pinkFilter = audioCtx.createBiquadFilter();
	filter.type = "bandpass";
	pinkNoise.connect (pinkFilter);

// Gain Nodes

var level = audioCtx.createGain(); // sineGen Level
	level.gain.value = 0;
	oscillator.connect(level);
	level.connect(masterLevel);

var levelSweep = audioCtx.createGain(); // Sine Sweep level
	levelSweep.gain.value = 0;
	oscillatorSweep.connect(levelSweep);
	levelSweep.connect(masterLevel);

var squareOscillatorLevel = audioCtx.createGain();
	squareOscillatorLevel.gain.value = 0;
	squareOscillator.connect (squareOscillatorLevel);
	squareOscillatorLevel.connect (masterLevel);

var whiteNoiseNoFiltLevel = audioCtx.createGain(); //  White Noise No - Filter Level
	whiteNoiseNoFiltLevel.gain.value = 0;
	whiteNoise.connect(whiteNoiseNoFiltLevel);
	whiteNoiseNoFiltLevel.connect(masterLevel);

var whiteNoiseLevel = audioCtx.createGain(); //white noise level
	whiteNoiseLevel.gain.value = 0;
	filter.connect(whiteNoiseLevel);
	whiteNoiseLevel.connect(masterLevel);

var pinkNoiseNoFiltLevel = audioCtx.createGain(); // Pink Noise without filter
	pinkNoiseNoFiltLevel.gain.value = 0;
	pinkNoise.connect (pinkNoiseNoFiltLevel);
	pinkNoiseNoFiltLevel.connect (masterLevel);

var pinkNoiseLevel = audioCtx.createGain(); // Pink noise filtered
	pinkNoiseLevel.gain.value = 0;
	pinkFilter.connect (pinkNoiseLevel);
	pinkNoiseLevel.connect (masterLevel);

// Active variables
var active = false;
var activeSweep = true;
var activeSquare = false;
var activeWhiteNoise = false;
var activePinkNoise = false;
var pianoActive = false;

var activeFreq = 0;
var activeSquareFrequency = 0;
var activeNoiseFreq = 0;
var activePinkNoiseFreq = 0;
var activeUrl = 0;

var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true;};
document.onmouseup = function() { isMouseDown = false;};

// 									Functions
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function resetValues (example)
{	
	var buttonTextArray = ["Reproducir", "31.5 Hz", "63 Hz", "125 Hz", "250 Hz", "500 Hz", "1 kHz", 
							"2 kHz", "4 kHz", "8 kHz", "16 kHz"]
	if (example == 1)
	{	
		var alpha = ["31Button", "63Button", "125Button", "250Button", "500Button", 
					 "1000Button", "2000Button", "4000Button", "8000Button", "16000Button"];

		for (var i = 1; i <= buttonTextArray.length-1; i++) 
		{
			var tempValue = document.getElementById(alpha[i-1]);
			tempValue.innerHTML = buttonTextArray[i];
		}
	}
	else if (example == 2)
	{
		var betha = ["0WButton", "31WButton", "63WButton", "125WButton", "250WButton", "500WButton",
					 "1000WButton", "2000WButton", "4000WButton", "8000WButton", "16000WButton"];

		for (var i = 0; i <= buttonTextArray.length-1; i++) 
		{	
			var tempValue = document.getElementById(betha[i]);
			tempValue.innerHTML = buttonTextArray[i];
		}	
	}
	else if (example == 3)
	{
		var gamma = ["0PButton", "31PButton", "63PButton", "125PButton", "250PButton", "500PButton",
					 "1000PButton", "2000PButton", "4000PButton", "8000PButton", "16000PButton"];

		for (var i = 0; i <= buttonTextArray.length-1; i++) 
		{	
			var tempValue = document.getElementById(gamma[i]);
			tempValue.innerHTML = buttonTextArray[i];
		}
	}
	else if (example == 4)
	{
		var pianoVar  = ["PianoA1", "PianoA2", "PianoA3", "PianoA4"];
		var pianoText = ["La 1 - 110 Hz", "La 2 - 220 Hz", "La 3 - 440 Hz", "La 4 - 880 Hz"];
		for (var i = 0; i <= pianoVar.length -1; i++) 
		{
			var tempValue = document.getElementById(pianoVar[i]);
			tempValue.innerHTML = pianoText[i];
		}
	}
}

function sineGen(value, idButton)
{	
	var buttonText = document.getElementById(idButton);

	if (active == false || activeFreq != value)
	{	
		oscillator.frequency.value = value;
		level.gain.value = 0.3;
		active = true;
		resetValues(1)
		buttonText.innerHTML = "Detener";
	}

	else if (active == true && activeFreq == value)
	{	
		activeSweep = false;
		level.gain.value = 0;
		active = false;
		resetValues(1)
	}

	activeFreq = value;
}

function sineSweep(idButton)
{	
	var buttonText = document.getElementById(idButton);

	if (active == false)
	{	
		active = true;
		activeSweep = true;
		oscillatorSweep.frequency.value = 20;

		var i = 20;
		var sweep = setInterval(function()
		{levelSweep.gain.value = 0.3;
		oscillatorSweep.frequency.value = i;
		i += (2^(i))*0.003;
			if (i >= 20000 || activeSweep == false)
		{
			clearInterval(sweep);
			levelSweep.gain.value = 0;
			oscillatorSweep.frequency.value = 20;
			active = false;
		}

		}, 1);

		buttonText.innerHTML = "Detener";
	}
	else if (active == true)
	{	
		activeSweep = false;
		active = false;

		buttonText.innerHTML = "Barrido de Frecuencia";
	}
}

function squareGen(idButton)
{	
	var buttonText = document.getElementById(idButton);

	var notes = [130.81, 146.83, 164.81, 174.61, 196.00, 220, 246.94];

	var freqSquare = notes[Math.floor ((Math.random() * 7))];

	if (activeSquare == false)
	{	
		squareOscillator.frequency.value = freqSquare;
		squareOscillatorLevel.gain.value = 0.15
		buttonText.innerHTML = "Detener";
		activeSquare = true;
	}
	else if (activeSquare == true)
	{
		squareOscillatorLevel.gain.value = 0;
		activeSquare = false;
		buttonText.innerHTML = "Forma de Onda Cuadrada"
	}
}

function whiteNoiseGen(value, idButton)
{	
	var buttonText = document.getElementById(idButton);

	if (activeWhiteNoise == false || activeNoiseFreq != value)
	{	
		if (value == 0)
		{
			whiteNoiseLevel.gain.value = 0;
			whiteNoiseNoFiltLevel.gain.value = 0.2;
		}
		else
		{
			filter.frequency.value = value;
			whiteNoiseNoFiltLevel.gain.value = 0;
			whiteNoiseLevel.gain.value = 0.3;
		}	
		activeWhiteNoise = true;
		resetValues(2);
		buttonText.innerHTML = "Detener"
	}
	else if (activeWhiteNoise == true && activeNoiseFreq == value)
	{	
		whiteNoiseLevel.gain.value = 0;
		whiteNoiseNoFiltLevel.gain.value = 0;
		activeWhiteNoise = false;
		resetValues(2);
	}

	activeNoiseFreq = value;

}

function pinkNoiseGen(value, idButton)
{	
	var buttonText = document.getElementById(idButton);

	if (activePinkNoise == false || activePinkNoiseFreq != value)
	{	
		if (value == 0)
		{
			pinkNoiseLevel.gain.value = 0;
			pinkNoiseNoFiltLevel.gain.value = 0.2;
		}
		else
		{
			pinkFilter.frequency.value = value;
			pinkNoiseNoFiltLevel.gain.value = 0;
			pinkNoiseLevel.gain.value = 0.3;
		}	
		activePinkNoise = true;
		resetValues(3);
		buttonText.innerHTML = "Detener"
	}
	else if (activePinkNoise == true && activePinkNoiseFreq == value)
	{	
		pinkNoiseLevel.gain.value = 0;
		pinkNoiseNoFiltLevel.gain.value = 0;
		activePinkNoise = false;
		resetValues(3);
	}

	activePinkNoiseFreq = value;
}

function pianoPlay (url, note, elementId)
{
	var buttonText = document.getElementById(elementId);

	if (pianoActive == false && activeUrl != note)
	{	
		activeUrl = note;
		pianoActive = true;
		resetValues(4);
		buttonText.innerHTML = "Detener"
		getData(url);
	}
	else if (pianoActive == true && activeUrl != note)
	{
		source.stop(0);
		resetValues(4);
		activeUrl = note;
		buttonText.innerHTML = "Detener"
		getData(url);
	}
	else if (activeUrl == note)
	{	
		source.stop(0);
		activeUrl = 0;
		pianoActive = false;
		resetValues(4);
	}
}

var change = -1;

function volumeChange()
{	
	if (change > 0)
	{
		if (Volume < 100)
		{
			Volume++;
			document.getElementById("Volumen").textContent = "Volumen: " + Volume + "%";
		}
	}

	else if (change < 0)
	{
		if (Volume > 0)
		{
			Volume--;
			document.getElementById("Volumen").textContent = "Volumen: " + Volume + "%";
		}
	}

	masterLevel.gain.value = (Volume / 100);
}

var timeVar;

function autoVolume()
{
	timeVar = setInterval(volumeChange, 100);
}

function autoStop()
{
	clearInterval(timeVar);
}