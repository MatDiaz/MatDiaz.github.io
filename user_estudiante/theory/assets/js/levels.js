
//							Aplicaciones - Cambios de Nivel 						    	//
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

var sineGenLevel = audioCtx.createGain(); // SineGen Level
	sineGenLevel.gain.value = 0;
	sineGenLevel.connect(masterLevel);

var sineGenLevelTwo = audioCtx.createGain(); // SineGen Two Level
	sineGenLevelTwo.gain.value = 0;
	sineGenLevelTwo.connect(masterLevel);

var pinkNoiseLevel = audioCtx.createGain(); // Pink Noise Level
	pinkNoiseLevel.gain.value = 0;
	pinkNoiseLevel.connect(masterLevel);

var audioLevel = audioCtx.createGain(); // Audio Level
	audioLevel.gain.value = 0;
	audioLevel.connect(masterLevel);

var sineGen = audioCtx.createOscillator(); // Oscillator 1
	sineGen.type = "sine";
	sineGen.frequency.value = 1000;
	sineGen.connect(sineGenLevel);
	sineGen.start();

var sineGenTwo = audioCtx.createOscillator(); // Oscillator 2
	sineGenTwo.type = 'sine';
	sineGenTwo.frequency.value = 500;
	sineGenTwo.connect(sineGenLevelTwo);
	sineGenTwo.start();

var audioLevelsActive = true;

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var buttonId = ["VozM10dB", "VozM6dB", "VozM2dB", "Voz0dB", "Voz2dB", "Voz6dB", "Voz10dB", "SenoM10dB",
				"SenoM6dB", "SenoM2dB", "Seno0dB", "Seno2dB", "Seno6dB", "Seno10dB", "AudioM10dB",
				"AudioM6dB", "AudioM2dB", "Audio0dB", "Audio2dB", "Audio6dB", "Audio10dB"]
var buttonText = [];

for (var i = 0; i <= buttonId.length - 1; i++) 
{
	buttonText[i] = document.getElementById(buttonId[i]).innerHTML;
}

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

//									Volume Control
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function resetValues()
{
	for (var i = 0; i <= buttonId.length - 1; i++) 
	{
	 	var tempValue = document.getElementById(buttonId[i]);
	 	tempValue.innerHTML = buttonText[i];
	}
}

var change;

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

// Reproducir Audios
function getData(url)
{
	source = audioCtx.createBufferSource();
	request = new XMLHttpRequest();

	request.open ('GET', url, true);

	request.withCredentials = false;

	request.responseType = 'arraybuffer';

	request.onload = function()
	{
		var audioData = request.response;
		
		audioCtx.decodeAudioData (audioData, function (buffer)
		{
			myBuffer = buffer;
			songLength = buffer.duration;
			source.buffer = myBuffer;
			source.connect(audioLevel);
			source.loop = true;
		},

		function(e){"Error with decoding audio data" + e.err});	
	}

	request.send();
}

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

pinkNoise.connect(pinkNoiseLevel);

// 										Page Apps							
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var buttonActive = true;
var audioActive = false;
var activeLevel = 0;
var activeType = null;
var activeUrl = null;
var url1 = 'http://freesound.org/data/previews/256/256994_2522406-lq.mp3';
var url2 = 'http://freesound.org/data/previews/347/347848_4019029-lq.mp3';

function audioLevels(level, type, url, elementId)
{	
	var tempLevel = (Math.pow(Math.pow(10, level), (1 / 20)) / Math.pow(Math.pow(10, 10), (1 / 20)));
	var tempButton = document.getElementById(elementId);

	if (type == activeType && level == activeLevel && buttonActive == true)
	{	
		if (buttonActive == true)
		{
			if (audioActive == true)
			{
				source.stop(0);
				audioActive = false;
			}
			sineGenLevel.gain.value = 0;
			resetValues();
		}

		buttonActive = false;
	}
	else if (type == "sine")
	{	
		if (audioActive == true)
		{
			source.stop(0);
			
		}
		resetValues();
		
		sineGenLevel.gain.value = tempLevel;

		tempButton.innerHTML = "DETENER";

		buttonActive = true;
	}
	else if (type == "audio")
	{
		if (audioActive == false)
		{
			getData(url);
			source.start(0); 
		}
		if (activeUrl != url)
		{	

			source.stop(0);
			getData(url);
			source.start(0);
		}

		sineGenLevel.gain.value = 0;
		audioLevel.gain.value = tempLevel;
		audioActive = true;
		buttonActive = true;
		resetValues();
		tempButton.innerHTML = "DETENER";
	}
	activeType = type;
	activeLevel = level;
	activeUrl = url;
}

var sonoActive = false
function sonDiff(even, elementId)
{
	var tempButton = document.getElementById(elementId);

	if (even == true && sonoActive == false) 
	{
		sineGenLevel.gain.value = 0.3;
		setTimeout(function(){sineGenLevelTwo.gain.value = 0.3}, 1000);

		sonoActive = true;
		tempButton.innerHTML = "Detener"
	}
	else if (even == false && sonoActive == false)
	{
		sineGenLevel.gain.value = 0.3;
		setTimeout(function(){sineGenLevelTwo.gain.value = 0.5}, 1000);

		sonoActive = true;
		tempButton.innerHTML = "Detener";
	}
	else if (sonoActive == true)
	{
		sineGenLevel.gain.value = 0;
		sineGenLevelTwo.gain.value = 0;
		sonoActive = false;
		tempButton.innerHTML = "Diferencias de Sonoridad"
	}
}

var maskingActive = false;

function masking(elementId)
{	
	var tempButton = document.getElementById(elementId);

	if (maskingActive == false)
	{
		tempButton.innerHTML = "Detener"
		sineGenLevel.gain.value = 0.03;
		maskingActive = true;
		var pink = setInterval(function()
		{
			pinkNoiseLevel.gain.value += 0.001;
			if (pinkNoiseLevel.gain.value > 0.5 || maskingActive == false)
			{
				clearInterval(pink);
			}
		}, 10);
	}
	else if (maskingActive == true)
	{	
		sineGenLevel.gain.value = 0;
		pinkNoiseLevel.gain.value = 0;
		maskingActive = false;
		tempButton.innerHTML = "Enmascaramiento"
	}
}