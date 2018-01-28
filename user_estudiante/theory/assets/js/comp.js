
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

// ============================================================================================
// ============================================================================================

var compressorOneLevel = audioCtx.createGain();
	compressorOneLevel.gain.value = 0;
	compressorOneLevel.connect(masterLevel);

var compressorTwoLevel = audioCtx.createGain();
	compressorTwoLevel.gain.value = 0;
	compressorTwoLevel.connect(masterLevel);

var compressorThreeLevel = audioCtx.createGain();
	compressorThreeLevel.gain.value = 0;
	compressorThreeLevel.connect(masterLevel);

// ============================================================================================
// ============================================================================================


var compressorOne = audioCtx.createDynamicsCompressor();
	compressorOne.connect(compressorOneLevel);

var compressorTwo = audioCtx.createDynamicsCompressor();
	compressorTwo.ratio.value = 5;
	compressorTwo.connect(compressorTwoLevel);

var compressorThree = audioCtx.createDynamicsCompressor();
	compressorThree.connect(compressorThreeLevel);

// ============================================================================================
// ============================================================================================

var audioOneClean = audioCtx.createGain();
	audioOneClean.gain.value = 1;
	audioOneClean.connect(compressorOneLevel);

var audioTwoClean = audioCtx.createGain();
	audioTwoClean.gain.value = 1;
	audioTwoClean.connect(compressorTwoLevel);

var audioThreeClean = audioCtx.createGain();
	audioThreeClean.gain.value = 1;
	audioThreeClean.connect(compressorThreeLevel);

// ============================================================================================
// ============================================================================================

var compressorOneActiveLevel = audioCtx.createGain();
	compressorOneActiveLevel.gain.value = 0;
	compressorOneActiveLevel.connect(compressorOne);

var compressorTwoActiveLevel = audioCtx.createGain();
	compressorTwoActiveLevel.gain.value = 0;
	compressorTwoActiveLevel.connect(compressorTwo);

var compressorThreeActiveLevel = audioCtx.createGain();
	compressorThreeActiveLevel.gain.value = 0;
	compressorThreeActiveLevel.connect(compressorThree);


//									Volume Control
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var change;

var addSound = function(){}

addSound.prototype.startSound = function(playerUrl)
{	
	source = audioCtx.createBufferSource();

	request = new XMLHttpRequest();

	request.open ('GET', playerUrl, true);

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

		source.connect(audioOneClean);
		source.connect(audioTwoClean);
		source.connect(audioThreeClean);

		source.connect(compressorOneActiveLevel);
		source.connect(compressorTwoActiveLevel);
		source.connect(compressorThreeActiveLevel);
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
	if (this.active){this.alpha.stop(0); this.active = false;}
	else {return;}
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

var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true;};
document.onmouseup = function() { isMouseDown = false;};

var timeVar;

function autoVolume()
{
	timeVar = setInterval(volumeChange, 100);
}

function autoStop()
{
	clearInterval(timeVar);
}

var audioActive = false;
var filterActive = false;

var url1 = "http://freesound.org/data/previews/174/174589_2188371-lq.mp3";
var newSound = new addSound();

var audioOneActive = false;
var audioTwoActive = false;
var audioThreeActive = false;

var compressorOneActive = false;
var compressorTwoActive = false;
var compressorThreeActive = false;


//									Update Sliders
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

function updateSliders(sliderId)
{	
	if (isMouseDown)
	{
		if (sliderId == "sliderOne") // Threshold Slider from example one
		{	
			document.getElementById("thresholdLevel").innerHTML = "Threshold: " + document.getElementById("thresholdSlider").value + " dB";
		}
		else if (sliderId == "sliderTwo") // Ratio Slider from example one
		{
			document.getElementById("ratioLevel").innerHTML = "Ratio " + document.getElementById("ratioSlider").value + ":1 dB";
		}
		else if  (sliderId == "sliderThree") // Attack Slider from example two
		{
			document.getElementById("attackTime").innerHTML = "Attack: " + document.getElementById("attackSlider").value + " Segundos"; 
		}
		else if (sliderId == "sliderFour") // Release Slider from example two
		{	
			document.getElementById("releaseTime").innerHTML = "Release: " + document.getElementById("releaseSlider").value + " Segundos";
		}
		else if (sliderId == "sliderFive") // Threshold slider from example three
		{	
			document.getElementById("thresholdLevelTwo").innerHTML = "Threshold: " + document.getElementById("thresholdSliderTwo").value + " dB";
		}
		else if (sliderId == "sliderSix") // Ratio slider from example three
	 	{	
			document.getElementById("ratioLevelTwo").innerHTML = "Ratio " + document.getElementById("ratioSliderTwo").value + ":1 dB";
		}
		else if (sliderId == "sliderSeven") // Attack slider from example three
		{	
			document.getElementById("attackTimeTwo").innerHTML = "Attack: " + document.getElementById("attackSliderTwo").value + " Segundos"; 
		}	
		else if (sliderId == "sliderEight") // Release slider from example three
		{	
			document.getElementById("releaseTimeTwo").innerHTML = "Release: " + document.getElementById("releaseSliderTwo").value + " Segundos";
		}
	updateCompressor();
	}
}

function updateCompressor()
{	
	compressorOne.threshold.value = document.getElementById("thresholdSlider").value;
	compressorOne.ratio.value = document.getElementById("ratioSlider").value;

	compressorTwo.attack.value = document.getElementById("attackSlider").value;
	compressorTwo.release.value = document.getElementById("releaseSlider").value;

	compressorThree.threshold.value = document.getElementById("thresholdSliderTwo").value;
	compressorThree.ratio.value = document.getElementById("ratioSliderTwo").value;
	compressorThree.attack.value = document.getElementById("attackSliderTwo").value;
	compressorThree.release.value = document.getElementById("releaseSliderTwo").value; 
}

// ============================================================================================
// ============================================================================================
// Update button from example one

function deactivateCompressor(elementId)
{
	var tempButton = document.getElementById(elementId)

	if (elementId == "compressorButtonOne")
	{
		if (compressorOneActive)
		{
			compressorOneActive = false;
			tempButton.innerHTML = "Inactivo";
			audioOneClean.gain.value = 1;
			compressorOneActiveLevel.gain.value = 0;
		}
		else
		{
			compressorOneActive = true;
			tempButton.innerHTML = "Activo";
			audioOneClean.gain.value = 0;
			compressorOneActiveLevel.gain.value = 1;
		}
	}
	else if (elementId == "compressorButtonTwo")
	{	
		if (compressorTwoActive)
		{
			compressorTwoActive = false;
			tempButton.innerHTML = "Inactivo";	
			audioTwoClean.gain.value = 1;
			compressorTwoActiveLevel.gain.value = 0;
		}
		else
		{
			compressorTwoActive = true;
			tempButton.innerHTML = "Activo";
			audioTwoClean.gain.value = 0;
			compressorTwoActiveLevel.gain.value = 1;
		}
	}
	else if (elementId == "compressorButtonThree")
	{	
		if (compressorThreeActive)
		{
			compressorThreeActive = false;	
			tempButton.innerHTML = "Inactivo";
			audioThreeClean.gain.value = 1;
			compressorThreeActiveLevel.gain.value = 0;
		}
		else
		{
			compressorThreeActive = true;
			tempButton.innerHTML = "Activo";
			audioThreeClean.gain.value = 0;
			compressorThreeActiveLevel.gain.value = 1;
		}
	}
}

function playAudioOne()
{
	compressorOneLevel.gain.value = 1;
	compressorTwoLevel.gain.value = 0;
	compressorThreeLevel.gain.value = 0;

	var textAudioButtonOne = document.getElementById("audioButtonOne");

	if (audioOneActive)
	{
		textAudioButtonOne.innerHTML = "Reproducir Audio";
		audioOneActive = false;
		newSound.stopSound();
	}
	else if (!audioOneActive)
	{
		textAudioButtonOne.innerHTML = "Detener";
		audioOneActive = true;
		newSound.startSound(url1);
	}
}

// Update button from example two
function playAudioTwo()
{
	compressorOneLevel.gain.value = 0;
	compressorTwoLevel.gain.value = 1;
	compressorThreeLevel.gain.value = 0;

	var textAudioButtonTwo = document.getElementById("audioButtonTwo");

	if (audioTwoActive)
	{	
		textAudioButtonTwo.innerHTML = "Reproducir Audio";
		newSound.stopSound();
		audioTwoActive = false;
	}
	else if (!audioTwoActive)
	{	
		textAudioButtonTwo.innerHTML = "Detener";
		newSound.startSound(url1);
		audioTwoActive = true;
	}
}

// Update button from example three
function playAudioThree()
{
	compressorOneLevel.gain.value = 0;
	compressorTwoLevel.gain.value = 0;
	compressorThreeLevel.gain.value = 1;

	var textAudioButtonThree = document.getElementById("audioButtonThree");

	if (audioThreeActive)
	{
		textAudioButtonThree.innerHTML = "Reproducir Audio";
		newSound.stopSound();
		audioThreeActive = false;
	}
	else if (!audioThreeActive)
	{
		textAudioButtonThree.innerHTML = "Detener";
		newSound.startSound(url1);
		audioThreeActive = true;
	}
}
