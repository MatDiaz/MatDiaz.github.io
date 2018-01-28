
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
	
var mainFilter = audioCtx.createBiquadFilter(); // Filter Node
	mainFilter.connect(masterLevel);

var pinkNoiseLevel = audioCtx.createGain(); // Pink Noise Level
	pinkNoiseLevel.gain.value = 0;
	pinkNoiseLevel.connect(masterLevel);

var pinkNoiseFilterLevel = audioCtx.createGain(); // Pink Noise Level
	pinkNoiseFilterLevel.gain.value = 0;
	pinkNoiseFilterLevel.connect(mainFilter);

var audioLevel = audioCtx.createGain(); // Audio Level
	audioLevel.gain.value = 0;
	audioLevel.connect(masterLevel);

var audioLevelFilter = audioCtx.createGain(); // Audio Filter Level
	audioLevelFilter.gain.value = 0;
	audioLevelFilter.connect(mainFilter);

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------


//									Volume Control
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var change;

var url1 = "http://freesound.org/data/previews/277/277325_4548252-lq.mp3";

var addSound = function(url)
{
	this.url = url;
}

addSound.prototype.startSound = function()
{
	source = audioCtx.createBufferSource();
	request = new XMLHttpRequest();

	request.open ('GET', this.url, true);

	request.responseType = 'arraybuffer';

	request.onload = function()
	{
		this.audioData = request.response;
				
		audioCtx.decodeAudioData (this.audioData, function (buffer)
	{
		this.myBuffer = buffer;
		this.songLength = buffer.duration;
		source.buffer = this.myBuffer;
		source.loop = true;
		source.connect(audioLevel);
		source.connect(audioLevelFilter);
	},

	function(e){"Error with decoding audio data" + e.err});	
	}

	this.alpha = source;
	this.alpha.start(0);
	this.active = true;

	request.send();
	}

	addSound.prototype.stopSound = function()
	{
		if (this.active){this.alpha.stop(0); this.active = false}
	}

	addSound.prototype.drawThis = function()
	{
		analyser.getByteTimeDomainData(this.dataArray);
	}


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

// Ruido Rosa
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
pinkNoise.connect(pinkNoiseFilterLevel);

var audioActive = false;
var pinkActive = false;
var filterActive = false;

var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true;};
document.onmouseup = function() { isMouseDown = false;};

var newSound = new addSound(url1);
//									Filter Params
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------


// -------------------------------- Low Pass Filter -------------------------------------------

var activeFilterLP = document.getElementById ("activeFilterLP");
var activeFilterLP_JS = false;
var cutFrequencyLP = document.getElementById ("cutFrequencyLP");
var cutFrequencyLP_JS = 20000;
var QfrequencyLP = document.getElementById ("QfrequencyLP");
var QfrequencyLP_JS = 0.1;


// -------------------------------- High Pass Filter ------------------------------------------

var activeFilterHP = document.getElementById ("activeFilterHP");
var activeFilterHP_JS = false;
var cutFrequencyHP = document.getElementById ("cutFrequencyHP");
var cutFrequencyHP_JS = 20;
var QfrequencyHP = document.getElementById ("QfrequencyHP");
var QfrequencyHP_JS = 0.1;


// -------------------------------- Band Pass Filter ------------------------------------------

var activeFilterBP = document.getElementById ("activeFilterBP");
var activeFilterBP_JS = false;
var cutFrequencyBP = document.getElementById ("cutFrequencyBP");
var cutFrequencyBP_JS = 20;
var QfrequencyBP = document.getElementById ("QfrequencyBP");
var QfrequencyBP_JS = 0.1;


// ------------------------------- Band Reject Filter -----------------------------------------

var activeFilterBR = document.getElementById ("activeFilterBR");
var activeFilterBR_JS = false;
var cutFrequencyBR = document.getElementById ("cutFrequencyBR");
var cutFrequencyBR_JS = 20;
var QfrequencyBR = document.getElementById ("QfrequencyBR");
var QfrequencyBR_JS = 0.1;


// --------------------------------- Peaking Filter -------------------------------------------

var activeFilterPeak = document.getElementById ("activeFilterPeak");
var activeFilterPeak_JS  = false
var cutFrequencyPeak = document.getElementById ("cutFrequencyPeak");
var cutFrequencyPeak_JS = 20;
var QfrequencyPeak = document.getElementById ("QfrequencyPeak");
var QfrequencyPeak_JS = 0.1;
var gainPeak = document.getElementById ("gainPeak");
var gainPeak_JS = 0;


// --------------------------------- Shelving Filter -------------------------------------------

var activeFilterShel = document.getElementById ("activeFilterShel");
var activeFilterShel_JS = false;
var typeFilterShel_JS = document.getElementById("shelvingTypeButton");
var shelvingType = "highshelf";
var cutFrequencyShel = document.getElementById ("cutFrequencyShel");
var cutFrequencyShel_JS = 20;
var QfrequencyShel = document.getElementById ("QfrequencyShel"); 
var QfrequencyShel_JS = 0;

// 										Page Apps							
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

function freqChange(type)
{	
	if(isMouseDown)
	{
		if (type == "lowpass")
		{
			cutFrequencyLP_JS = document.getElementById("freqLP").value;
			mainFilter.frequency.value = cutFrequencyLP_JS;
			cutFrequencyLP.innerHTML = "Frecuencia de Corte: " + cutFrequencyLP_JS + " Hz";
		}
		else if (type == "highpass")
		{
			cutFrequencyHP_JS = document.getElementById("freqHP").value;
			mainFilter.frequency.value = cutFrequencyHP_JS;
			cutFrequencyHP.innerHTML = "Frecuencia de Corte: " + cutFrequencyHP_JS + " Hz";
		}
		else if (type == "bandpass")
		{
			cutFrequencyBP_JS = document.getElementById("freqBP").value;
			mainFilter.frequency.value = cutFrequencyBP_JS;
			cutFrequencyBP.innerHTML = "Frecuencia Central: " + cutFrequencyBP_JS + " Hz";
		}
		else if (type == "bandreject")
		{
			cutFrequencyBR_JS = document.getElementById("freqBR").value;
			mainFilter.frequency.value = cutFrequencyBR_JS;
			cutFrequencyBR.innerHTML = "Frecuencia Central: " + cutFrequencyBR_JS + " Hz";
		}
		else if (type == "peaking")
		{
			cutFrequencyPeak_JS = document.getElementById("freqPeak").value;
			mainFilter.frequency.value = cutFrequencyPeak_JS;
			cutFrequencyPeak.innerHTML = "Frecuencia Central: " + cutFrequencyPeak_JS + " Hz";
		}
		else if (type == "shelving")
		{
			cutFrequencyShel_JS = document.getElementById("freqShel").value;
			mainFilter.frequency.value = cutFrequencyShel_JS;
			cutFrequencyShel.innerHTML = "Frecuencia Central: " + cutFrequencyShel_JS + " Hz";		
		}
	}	
}

function QChange(type)
{	
	if (isMouseDown)
	{
		if (type == "lowpass")
		{
			QfrequencyLP_JS = document.getElementById("QLP").value;
			mainFilter.Q.value = QfrequencyLP_JS * 10;
			QfrequencyLP.innerHTML = "Factor de Calidad: " + QfrequencyLP_JS;
		}
		else if (type == "highpass")
		{
			QfrequencyHP_JS = document.getElementById("QHP").value;
			mainFilter.Q.value = QfrequencyHP_JS * 10;
			QfrequencyHP.innerHTML = "Factor de Calidad: " + QfrequencyHP_JS;
		}
		else if (type == "bandpass")
		{	
			QfrequencyBP_JS = document.getElementById("QBP").value;
			mainFilter.Q.value = QfrequencyBP_JS * 10;
			QfrequencyBP.innerHTML = "Factor de Calidad: " + QfrequencyBP_JS;
		}
		else if (type == "bandreject")
		{
			QfrequencyBR_JS = document.getElementById("QBR").value;
			mainFilter.Q.value = QfrequencyBR_JS * 10;
			QfrequencyBR.innerHTML = "Factor de Calidad: " + QfrequencyBR_JS;
		}
		else if (type == "peaking")
		{
			QfrequencyPeak_JS = document.getElementById("QPeak").value;
			mainFilter.Q.value = QfrequencyPeak_JS * 10;
			QfrequencyPeak.innerHTML = "Factor de Calidad: " + QfrequencyPeak_JS;
		}
	}
}

function gainChange(type)
{	
	if (isMouseDown)
	{
		if (type == "peaking")
		{
			gainPeak_JS = document.getElementById("gainPeakO").value;
			mainFilter.gain.value = gainPeak_JS;
			gainPeak.innerHTML = "Ganancia: " + gainPeak_JS +"dB";
		}
		else if (type == "shelving")
		{
			QfrequencyShel_JS = document.getElementById("gainShel").value;
			mainFilter.gain.value = QfrequencyShel_JS;
			QfrequencyShel.innerHTML = "Ganancia: " + QfrequencyShel_JS + "dB";
		}
	}	
}

function shutDownAudio()
{
	if(audioActive)
	{
		audioLevel.gain.value = 0;
		audioLevelFilter.gain.value = 1; 
	}

	if(pinkActive)
	{
		pinkNoiseLevel.gain.value = 0; 
		pinkNoiseFilterLevel.gain.value = 1;
	}
}

function antiShutDownAudio()
{
	if(audioActive)
	{
		audioLevel.gain.value = 1;
		audioLevelFilter.gain.value = 0; 

	}

	if(pinkActive)
	{
		pinkNoiseLevel.gain.value = 1; 
		pinkNoiseFilterLevel.gain.value = 0;
	}	
}

function setShelvingType()
{
	if (shelvingType == "highshelf")
	{
		typeFilterShel_JS.innerHTML = "Bass";
		shelvingType = "lowshelf";
	}
	else if (shelvingType == "lowshelf")
	{
		typeFilterShel_JS.innerHTML = "Treble";
		shelvingType = "highshelf";	
	}

	setParameters("shelving");

}

function setParameters(type)
{
	if (type == "lowpass")
	{
		mainFilter.type = "lowpass";
		mainFilter.frequency.value = cutFrequencyLP_JS;
		mainFilter.Q.value = QfrequencyLP_JS;
	}
	else if (type == "highpass")
	{
		mainFilter.type = "highpass";
		mainFilter.frequency.value = cutFrequencyHP_JS;
		mainFilter.Q.value = QfrequencyHP_JS;
	}
	else if (type == "bandpass")
	{
		mainFilter.type = "bandpass";
		mainFilter.frequency.value = cutFrequencyBP_JS;
		mainFilter.Q.value = QfrequencyBP_JS;
	}
	else if (type == "bandreject")
	{
		mainFilter.type = "notch";
		mainFilter.frequency.value = cutFrequencyBR_JS;
		mainFilter.Q.value = QfrequencyBR_JS;
	}
	else if (type == "peaking")
	{
		mainFilter.type = "peaking";
		mainFilter.frequency.value = cutFrequencyPeak_JS;
		mainFilter.Q.value = QfrequencyPeak_JS;
		mainFilter.gain.value = gainPeak_JS;
	}
	else if (type == "shelving")
	{	
		mainFilter.type = shelvingType;
		mainFilter.frequency.value = cutFrequencyShel_JS;
		mainFilter.gain.value = QfrequencyShel_JS;
	}
}

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

function activeFilter(type)
{
		if (type == "lowpass")
		{
			if (!activeFilterLP_JS)
			{
				shutDownAudio();
				setParameters(type);
				activeFilterLP_JS = true;
				activeFilterLP.innerHTML = "ACTIVO";
				activeFilterHP_JS = false;
				activeFilterHP.innerHTML = "INACTIVO";
				activeFilterBP_JS = false;
				activeFilterBP.innerHTML = "INACTIVO";
				activeFilterBR_JS = false;
				activeFilterBR.innerHTML = "INACTIVO";
				activeFilterPeak_JS = false;
				activeFilterPeak.innerHTML = "INACTIVO";
				activeFilterShel_JS = false;
				activeFilterShel.innerHTML = "INACTIVO";
			}
			else
			{	
				antiShutDownAudio();
				activeFilterLP_JS = false;
				activeFilterLP.innerHTML = "INACTIVO";
			}
		}
		else if (type == "highpass")
		{
			if (!activeFilterHP_JS)
			{	
				shutDownAudio();
				setParameters(type);

				activeFilterHP_JS = true;
				activeFilterHP.innerHTML = "ACTIVO";

				activeFilterLP_JS = false;
				activeFilterLP.innerHTML = "INACTIVO";
				activeFilterBP_JS = false;
				activeFilterBP.innerHTML = "INACTIVO";
				activeFilterBR_JS = false;
				activeFilterBR.innerHTML = "INACTIVO";
				activeFilterPeak_JS = false;
				activeFilterPeak.innerHTML = "INACTIVO";
				activeFilterShel_JS = false;
				activeFilterShel.innerHTML = "INACTIVO";
			}
			else
			{	
				antiShutDownAudio();
				activeFilterHP_JS = false;
				activeFilterHP.innerHTML = "INACTIVO";
			}
		}
		else if (type == "bandpass")
		{
			if (!activeFilterBP_JS)
			{	
				shutDownAudio();
				setParameters(type);

				activeFilterBP_JS = true;
				activeFilterBP.innerHTML = "ACTIVO";

				activeFilterLP_JS = false;
				activeFilterLP.innerHTML = "INACTIVO";
				activeFilterHP_JS = false;
				activeFilterHP.innerHTML = "INACTIVO";
				activeFilterBR_JS = false;
				activeFilterBR.innerHTML = "INACTIVO";
				activeFilterPeak_JS = false;
				activeFilterPeak.innerHTML = "INACTIVO";
				activeFilterShel_JS = false;
				activeFilterShel.innerHTML = "INACTIVO";
			}
			else
			{	
				antiShutDownAudio();
				activeFilterBP_JS = false;
				activeFilterBP.innerHTML = "INACTIVO";
			}
		}
		else if (type == "bandreject")
		{
			if (!activeFilterBR_JS)
			{	
				shutDownAudio();
				setParameters('bandreject');

				activeFilterBR_JS = true;
				activeFilterBR.innerHTML = "ACTIVO";

				activeFilterLP_JS = false;
				activeFilterLP.innerHTML = "INACTIVO";
				activeFilterBP_JS = false;
				activeFilterBP.innerHTML = "INACTIVO";
				activeFilterHP_JS = false;
				activeFilterHP.innerHTML = "INACTIVO";
				activeFilterPeak_JS = false;
				activeFilterPeak.innerHTML = "INACTIVO";
				activeFilterShel_JS = false;
				activeFilterShel.innerHTML = "INACTIVO";
			}
			else
			{	
				antiShutDownAudio();
				activeFilterBR_JS = false;
				activeFilterBR.innerHTML = "INACTIVO";
			}
		}
		else if (type == "peaking")
		{
			if (!activeFilterPeak_JS)
			{	
				shutDownAudio();
				setParameters(type);

				activeFilterPeak_JS = true;
				activeFilterPeak.innerHTML = "ACTIVO";

				activeFilterLP_JS = false;
				activeFilterLP.innerHTML = "INACTIVO";
				activeFilterBP_JS = false;
				activeFilterBP.innerHTML = "INACTIVO";
				activeFilterBR_JS = false;
				activeFilterBR.innerHTML = "INACTIVO";
				activeFilterHP_JS = false;
				activeFilterHP.innerHTML = "INACTIVO";
				activeFilterShel_JS = false;
				activeFilterShel.innerHTML = "INACTIVO";
			}
			else
			{	
				antiShutDownAudio();
				activeFilterPeak_JS = false;
				activeFilterPeak.innerHTML = "INACTIVO";
			}
		}
		else if (type == "shelving")
		{
			if (!activeFilterShel_JS)
			{	
				shutDownAudio();
				setParameters('shelving');

				activeFilterShel_JS = true;
				activeFilterShel.innerHTML = "ACTIVO";

				activeFilterLP_JS = false;
				activeFilterLP.innerHTML = "INACTIVO";
				activeFilterBP_JS = false;
				activeFilterBP.innerHTML = "INACTIVO";
				activeFilterBR_JS = false;
				activeFilterBR.innerHTML = "INACTIVO";
				activeFilterPeak_JS = false;
				activeFilterPeak.innerHTML = "INACTIVO";
				activeFilterHP_JS = false;
				activeFilterHP.innerHTML = "INACTIVO";
			}
			else
			{	
				antiShutDownAudio();
				activeFilterShel_JS = false;
				activeFilterShel.innerHTML = "INACTIVO";
			}		
		}
}

function resetValues()
{
	var listaBotonesUno = ["RosaUno","RosaDos","RosaTres","RosaCuatro","RosaCinco","RosaSeis"]

	var listaBotonesDos = ["MusicaUno","MusicaDos","MusicaTres","MusicaCuatro","MusicaCinco","MusicaSeis"];

	for (var i = 0; i <= (listaBotonesUno.length -1); i++) 
	{
		var tempOne = document.getElementById(listaBotonesUno[i]);
		tempOne.innerHTML = "Ruido Rosa";

		var tempTwo = document.getElementById(listaBotonesDos[i]);
		tempTwo.innerHTML = "Música";
	}
}

function playAudio(audioKind, elementId)
{	
	resetValues();
	var buttonPressed = document.getElementById(elementId);
	buttonPressed.innerHTML = "Detener";

	shutDownFilter();

	if (audioKind == 'noise')
	{	
		pinkNoiseFilterLevel.gain.value = 0;
		audioLevel.gain.value = 0;
		audioLevelFilter.gain.value = 0;
		if (audioActive){audioActive = false; newSound.stopSound();}

		if(pinkActive)
		{
			pinkNoiseLevel.gain.value = 0;
			pinkActive = false;
			resetValues();
		}
		else
		{
			pinkNoiseLevel.gain.value = 1;
			pinkActive = true;
		}
	}
	else if (audioKind == 'audio')
	{
		pinkNoiseFilterLevel.gain.value = 0;
		pinkNoiseLevel.gain.value = 0;
		audioLevelFilter.gain.value = 0;
		pinkActive = false;

		if(audioActive)
		{	
			audioLevel.gain.value = 0;
			audioActive = false;
			newSound.stopSound();
			resetValues();
		}
		else
		{
			audioLevel.gain.value = 1;
			audioActive = true;
			newSound.startSound();
		}
	}
}


function shutDownFilter()
{
	activeFilterShel_JS = false;
	activeFilterShel.innerHTML = "INACTIVO";
	activeFilterLP_JS = false;
	activeFilterLP.innerHTML = "INACTIVO";
	activeFilterBP_JS = false;
	activeFilterBP.innerHTML = "INACTIVO";
	activeFilterBR_JS = false;
	activeFilterBR.innerHTML = "INACTIVO";
	activeFilterPeak_JS = false;
	activeFilterPeak.innerHTML = "INACTIVO";
	activeFilterHP_JS = false;
	activeFilterHP.innerHTML = "INACTIVO";
}

