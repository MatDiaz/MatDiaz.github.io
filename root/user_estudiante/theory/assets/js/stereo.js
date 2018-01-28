
//							Aplicaciones - Cambios de Nivel 						    	//
//				** Aplicacion Web De Entrenamiento Auditivo Técnico ** 						//		
//				**            Para Ingenieros de Sonido. 			**						//
// -----------------------------------------------------------------------------------------//

// 									Audio Context
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

var Volume = 100; // Master Volume

var masterLevel = audioCtx.createGain(); // Master Level
	masterLevel.gain.value = 1;
	masterLevel.connect(audioCtx.destination);

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

var exampleOneGain = audioCtx.createGain();
	exampleOneGain.gain.value = 0;

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

var panNode = audioCtx.createStereoPanner();
	panNode.connect(masterLevel); 

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

var sineExampleGain = audioCtx.createGain();
	sineExampleGain.gain.value = 0;
	sineExampleGain.connect(masterLevel);

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------
var exampleFourCleanGain = audioCtx.createGain();
	exampleFourCleanGain.gain.value = 0;
	exampleFourCleanGain.connect(masterLevel);
	
var exampleFourRevGain = audioCtx.createGain();
	exampleFourRevGain.gain.value = 0;
	exampleFourRevGain.connect(masterLevel);

// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

var exampleFiveGain = audioCtx.createGain();
	exampleFiveGain.gain.value = 0;
	exampleFiveGain.connect(masterLevel);

var exampleFiveGainMid = audioCtx.createGain();
	exampleFiveGainMid.gain.value = 0;
	exampleFiveGainMid.connect(masterLevel);

var exampleFiveGainSide = audioCtx.createGain();
	exampleFiveGainSide.gain.value = 0;
	exampleFiveGainSide.connect(masterLevel);
// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------

//									Volume Control
// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------
var change;

var url1 = "http://freesound.org/data/previews/277/277325_4548252-lq.mp3"; // Default Sound
var url2Drums = "http://freesound.org/data/previews/106/106552_1826123-lq.mp3"; //Bateria Limpia
var url2DrumsReverb = "http://www.freesound.org/data/previews/395/395785_6522111-lq.mp3"; // Bateria Reverb
var url3Loop = "http://www.freesound.org/data/previews/395/395784_6522111-lq.mp3"; // Loop Electronico Completo
var url4LoopMid = "http://www.freesound.org/data/previews/395/395783_6522111-lq.mp3"; // Loop Electronico Mid
var url4LoopSide = "http://www.freesound.org/data/previews/395/395786_6522111-lq.mp3"; // Loop Electronico Side
var urlSumaSenos = "http://www.freesound.org/data/previews/395/395782_6522111-lq.mp3"; // Suma de Senos


var addSound = function(url)
{
	this.url = url;
}

var bufferLoader;

bufferLoader = new BufferLoader(audioCtx, ["http://freesound.org/data/previews/106/106552_1826123-lq.mp3", 
	"http://freesound.org/data/previews/395/395785_6522111-lq.mp3", "http://freesound.org/data/previews/395/395784_6522111-lq.mp3",
	"http://freesound.org/data/previews/395/395783_6522111-lq.mp3", "http://freesound.org/data/previews/395/395786_6522111-lq.mp3"], finishedLoading);
bufferLoader.load();

var source1 = audioCtx.createBufferSource();
var source2 = audioCtx.createBufferSource();
var source3 = audioCtx.createBufferSource();
var source4 = audioCtx.createBufferSource();
var source5 = audioCtx.createBufferSource();

function finishedLoading(bufferList)
{
	source1.buffer = bufferList[0];
	source2.buffer = bufferList[1];
	source3.buffer = bufferList[2];
	source4.buffer = bufferList[3];
	source5.buffer = bufferList[4];
}
source1.start(0);
source2.start(0);
source3.start(0);
source4.start(0);
source5.start(0);

source1.loop = true;
source2.loop = true;
source3.loop = true;
source4.loop = true;
source5.loop = true;

source1.connect(exampleFourCleanGain);
source2.connect(exampleFourRevGain);
source3.connect(exampleFiveGain);
source4.connect(exampleFiveGainMid);
source5.connect(exampleFiveGainSide);

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

		source.connect(panNode);
		source.connect(sineExampleGain);
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

var exampleSoundOne = new addSound(url1);
var exampleSoundTwo = new addSound(urlSumaSenos);
var exampleSoundThree = new addSound(url1);
var exampleSoundFourClean = new addSound(url2Drums);
var exampleSoundFourRever = new addSound(url2DrumsReverb);

// 															PAGE APPS
// ==============================================================================================================================
// ------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
// ==============================================================================================================================
var exampleOneActive = false;
var exampleTwoActive = false;
var exampleThreeActive = false;
var exampleFourActive = false;
var exampleFiveActive = false;
var exampleThreeCounter = 0;
var prevValue;

function resetText()
{	
	var ButtonList = ["panButtonLeft", "panButtonCenter", "panButtonRight", "phaseButtonExample", "positionButton", "reverbButtonOne",
					  "reverbButtonTwo", "midSideButton", "midButton", "sideButton"];

	var nameList = ["Extremo Izquierdo", "Centro", "Extremo Derecho", "Reproducir Ondas Seno", "Cambiar Posición", "Sonido Limpio",
					"Sonido con Reverberación", "Reproducir Audio", "Mid", "Side"];					  

	for (var i = 0; i <= ButtonList.length - 1 ;i++) 
	{	
		var tempValue = document.getElementById(ButtonList[i]);
		tempValue.innerHTML = nameList[i];
	}
}

function exampleOne(elementId, audioElement)
{
	resetText();

	var buttonId = document.getElementById(elementId);
	buttonId.innerHTML = "Detener"

	if (audioElement == 1)
	{
		panNode.pan.value = -1;
	}
	else if (audioElement == 2)
	{
		panNode.pan.value = 0;
	}
	else if (audioElement == 3)
	{
		panNode.pan.value = 1;
	}

	if(!exampleOneActive)
	{
		exampleOneActive = true;

		exampleSoundOne.startSound();
	}
	else if (exampleOneActive && prevValue == audioElement)
	{	
		resetText();
		exampleSoundOne.stopSound();
		exampleOneActive = false;
	}
	prevValue = audioElement;
}

function exampleTwo(elementId)
{
	resetText();

	var buttonId = document.getElementById(elementId);
	buttonId.innerHTML = "Detener";

	if (!exampleTwoActive)
	{
		exampleTwoActive = true;
		sineExampleGain.gain.value = 1;
		exampleSoundTwo.startSound();
	}
	else if (exampleTwoActive)
	{
		resetText();
		exampleTwoActive = false;
		sineExampleGain.gain.value = 0;
		exampleSoundTwo.stopSound();
	}

}

var counter;

function exampleThree(elementId)
{	
	resetText();

	var buttonId = document.getElementById(elementId);
	buttonId.innerHTML = "Detener";

	movingValue = -1;

	panNode.pan.value = movingValue;

	exampleThreeCounter = 0;

	var counter = setInterval(panner, 250);

	function panner()
	{
		if (exampleThreeCounter >= 60)
		{	
			clearInterval(counter);
			exampleSoundThree.stopSound();
			exampleThreeActive = false;
			resetText();
		}
		else 
		{
			exampleThreeCounter++;
			movingValue += (2/60);
			panNode.pan.value = movingValue;
		}
	}	

	if(!exampleThreeActive)
	{
		exampleThreeActive = true;
		exampleSoundThree.startSound();
	}
	else if (exampleThreeActive)
	{	
		exampleThreeCounter = 61;
		resetText();
		exampleThreeActive = false;
		exampleSoundThree.stopSound();
	}
}

var prevValueFour = 0;

function exampleFour(elementId, buttonSelected)
{	
	resetText();

	var buttonId = document.getElementById(elementId);
	buttonId.innerHTML = "Detener";

	if (buttonSelected == 1)
	{
		exampleFourCleanGain.gain.value = 1;
		exampleFourRevGain.gain.value = 0;
	}
	else if (buttonSelected == 2)
	{
		exampleFourCleanGain.gain.value = 0;
		exampleFourRevGain.gain.value = 1;
	}

	if (!exampleFourActive)
	{
		exampleFourActive = true;

	}
	else if (exampleFourActive && prevValueFour == buttonSelected)
	{
		exampleFourActive = false;
		resetText();
		exampleFourCleanGain.gain.value = 0;
		exampleFourRevGain.gain.value = 0;
	}

	prevValueFour = buttonSelected;
}

var prevValueFive = 0;

function exampleFive(elementId, buttonSelected)
{
	resetText();

	var buttonId = document.getElementById(elementId);
	buttonId.innerHTML = "Detener";

	if (buttonSelected == 1)
	{
		exampleFiveGain.gain.value = 1;
		exampleFiveGainMid.gain.value = 0;
		exampleFiveGainSide.gain.value = 0;
	}
	else if (buttonSelected == 2)
	{
		exampleFiveGain.gain.value = 0;
		exampleFiveGainMid.gain.value = 1;
		exampleFiveGainSide.gain.value = 0;
	}
	else if (buttonSelected == 3)
	{
		exampleFiveGain.gain.value = 0;
		exampleFiveGainMid.gain.value = 0;
		exampleFiveGainSide.gain.value = 1;
	}

	if (!exampleFiveActive)
	{
		exampleFiveActive = true;
	}
	else if (exampleFiveActive && prevValueFive == buttonSelected)
	{
		exampleFiveActive = false;
		resetText();
		exampleFiveGain.gain.value = 0;
		exampleFiveGainMid.gain.value = 0;
		exampleFiveGainSide.gain.value = 0;
	}

	prevValueFive = buttonSelected;
}