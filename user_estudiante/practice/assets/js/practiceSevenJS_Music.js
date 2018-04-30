//							  Reconocimiento de Frecuencias 							    //
//				** Aplicacion Web De Entrenamiento Auditivo Técnico ** 						//		
//				**            Para Ingenieros de Sonido. 			**						//
// -----------------------------------------------------------------------------------------//

// 									Player Class
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var player = function() // player constructor
{	// Variable Initialization
	this.Correct = 0; 
	this.Wrong = 0;
	this.level = "Fácil";
	this.timer = 20;
	this.subCounter = 0;
	this.url  = "https://freesound.org/data/previews/277/277325_4548252-lq.mp3";
	this.urlList = ["https://freesound.org/data/previews/215/215048_2866962-lq.mp3", 
	"https://freesound.org/data/previews/325/325407_4548252-lq.mp3",
	"https://freesound.org/data/previews/350/350473_1676145-lq.mp3",
	"https://freesound.org/data/previews/174/174589_2188371-lq.mp3"];
}

player.prototype.rightAnswer = function() // Answer counter
{	
	this.subCounter++;
	this.Correct++;
	if (this.Correct == 20){this.level = "Intermedio"; this.timer = 20}
	else if (this.Correct >= 30){this.level = "Avanzado"; this.timer = 20}
};
player.prototype.wrongAnswer = function() {this.Wrong++;};
player.prototype.resetAnswer = function() {this.Correct = 0; this.Wrong = 0;};

player.prototype.generateURL = function() {this.url = this.urlList[Math.floor(Math.random () * 4)]};

// 									AudioCtx init
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var controlFilterLevel = audioCtx.createGain();
	controlFilterLevel.gain.value = 0;
	controlFilterLevel.connect(audioCtx.destination);

var controlLevel = audioCtx.createGain();
	controlLevel.gain.value = 1;
	controlLevel.connect(audioCtx.destination);

var gameFilter = audioCtx.createBiquadFilter();
	gameFilter.type = "peaking";
	gameFilter.frequency.value = 1000;
	gameFilter.gain.value = 10;
	gameFilter.connect(controlFilterLevel);

var buttonActiveMedium = false;
var buttonActiveHard = false;

// Create Analyzer
var analyser = audioCtx.createAnalyser();

var gameControlClass = function() // Game Object Constructor
{	
	// This will be the incognitas to use in game, they'll change according to the game
	this.answerListA = [63, 125, 250, 500, 1000, 2000, 4000, 8000]; // Easy Level
	this.answerListB = [63, 125, 250, 500, 1000, 2000, 4000, 8000]; // Medium Level
	this.answerListC = [63, 125, 250, 500, 1000, 2000, 4000, 8000]; // Hard Level
	this.Guess = this.answerListA[Math.floor(Math.random() * 10)]; // Initialize an icongnita
}

function activateAudio()
{
	audioCtx.resume();
}

gameControlClass.prototype.generateIconigta = function (level) 
{	
	if (level == "Fácil") { this.Guess = this.answerListA[Math.floor(Math.random() * 8)]}
	else if (level == "Intermedio") { this.Guess = this.answerListB[Math.floor(Math.random() * 8)] }
	else if (level = "Avanzado") { this.Guess = this.answerListC[Math.floor(Math.random() * 8)] }
};

gameControlClass.prototype.controlGain = function (change)
{
	if (change == "Play") { this.gainValue = 0.3; }
	else if (change == "Stop") { this.gainValue = 0; }
	return this.gainValue;
};

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

		source.connect(controlLevel);
		source.connect(gameFilter);
		source.connect(analyser);
	},

	function(e){"Error with decoding audio data" + e.err});	
	}
	// Setup Analyzer parameters
	analyser.fftSize = 4096; // fft size (this is not the case to use fft, but it still matters)
	this.bufferLength = analyser.frequencyBinCount; // Get analyzer length
	this.dataArray = new Uint8Array(this.bufferLength); // make a new array based on analyzer length

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

	// Create Audio Player
	var soundOne = new addSound();
// 																		 Create JS init
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

function init()
{	
// 																		 Object Creation
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	// Create Audio Player
	soundOne = new addSound();

	// Create New Player
	newPlayer = new player();

	// Create Game Controls
	gameControl = new gameControlClass();

	// Drawning Line
	var line = new createjs.Shape();
// 																		 Variable Initialization
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

	// Vector
	var sineArray = []; 
	var time = 0;
	var oneTime = true;
	var pause = true;
	var original = true;
	var beep = true;
	var rightStop = false;
	var url2 = "https://freesound.org/data/previews/352/352651_4019029-lq.mp3";
	var gainModifier = 10;

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(60); // Canvas update frequency

	// Animation
	function handleTick() 
	{	// This function is called at FPS speed. i.e. 60FPS (60 times per second)
		// All processing done here is critical
		if (!pause)
		{	
			soundOne.drawThis(); // Get analyzer data from the audio object
			line.graphics.clear(); // Clear previous line
			line.graphics.setStrokeStyle(1); // Set line width attribute
			line.graphics.beginStroke('rgba(255, 255, 255, 0.15)'); // set line color
			line.graphics.moveTo (25, 75 + (225 / 2)); // Place the line in some point of the canvas
			for (var i = 25; i < (890 + 25); i ++) // Draw ponint to point
			{	
				line.graphics.lineTo (i, ((225 / 2) + 75) + ((soundOne.dataArray[i])) - (128));
			}
			stage.update();
		}
	}

	function resetCanvasLine() // This function is called to draw a straight line
	{	
		line.graphics.clear();
		line.graphics.setStrokeStyle(1);
		line.graphics.beginStroke('rgba(255, 255, 255, 0.1)');
		line.graphics.moveTo (25, 75 + (225 / 2));
		// Init Line
		for (var i = 25; i < (890 + 25); ++i) 
		{
			line.graphics.lineTo (i, ((225 / 2) + 75));
		}
	}

	// Stage
	var stage = new createjs.Stage("levelApp");
	
	// Background
	var background = new createjs.Shape();
		background.graphics.beginFill("rgba(0, 0, 0, 0.90)").drawRoundRect(0, 0, 940, 385, 10, 90, 10, 90);

	// Second Rectangle Over
	var actionCanvas = new createjs.Shape();
		actionCanvas.graphics.beginStroke("darkorange").beginFill("rgba(32, 32, 32, 0.75)").drawRoundRect(25, 75, 890, 225, 10, 90, 10, 90);

	// Title
	var title = new createjs.Text("REALCES Y CORTES", "300 24pt Source Sans Pro", "white");
		title.x = stage.canvas.width / 2 - (title.getBounds().width / 2);
		title.y = (title.getBounds().height / 2);

	// Frequency
	var answerText = new createjs.Text(" ", "300 34pt Source Sans Pro", "darkorange");
		answerText.x = (stage.canvas.width / 2) - (answerText.getBounds().width / 2);
		answerText.y = ((225 / 2) + 75) - (answerText.getBounds().height) ;

	resetCanvasLine(); // Draw a straight line
	
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	// Button Properties
	var buttonHeight = 74; // Button Height
	var buttonWidth = 35; // Button Width
	var buttonStroke = "black"; // Button Color
	var buttonFont = "300 13pt Source Sans Pro"; // Font-> .Font Weight. Font Size. Font Family
	var textFont = "300 14pt Source Sans Pro"; // Font-> .Font Weight. Font Size. Font Family

	// Class for make texts
	// text = Text to display
	// font = type of font to use
	// color = text color
	// stage = createJS Stage
	// x, y -> text position

	var newText = function(text, font, color, stage, x, y)
	{
		this.createText = new createjs.Text(text, font, "darkorange"); // 
		this.createText.x = x - (this.createText.getBounds().width / 2); //
		this.createText.y = y  - (this.createText.getBounds().height); //
		stage.addChild(this.createText); //
	}

	// Clase for making buttons
	// buttonHeight = button Height
	// buttonWidth = button Width
	// buttonStroke = button line stroke
	// buttonFill = button fill color
	// x, y -> button position
	// canvasStage = createJS Stage
	// Text = text to display in button
	// font = font family of button
	// color = text ccolor

	var newButton = function(buttonHeight, buttonWidth, buttonStroke, buttonFill, x, y, canvasStage, text, font, color)
	{	
		this.buttonHeight = buttonHeight;
		this.buttonWidth = buttonWidth;
		this.buttonFill = buttonFill;

		this.newContainer = new createjs.Container(); this.newContainer.setBounds(x, y, buttonHeight, buttonWidth); //
		this.createButton = new createjs.Shape(); // 
		this.createButton.graphics.beginStroke(buttonStroke).beginFill(buttonFill).drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90); //
		this.buttonText = new createjs.Text(text, font, color); //
		this.buttonText.x = (this.newContainer.getBounds().width / 2) - (this.buttonText.getBounds().width / 2); //
		this.buttonText.y = (this.newContainer.getBounds().height / 2)- (this.buttonText.getBounds().height / 2)*1.5; //
		this.newContainer.x = x; // 
		this.newContainer.y = y; //
		this.newContainer.cursor = "pointer"; // 
		this.newContainer.addChild(this.createButton, this.buttonText); // 
		stage.addChild(this.newContainer); // 
	}

	newButton.prototype.changeColor = function()
	{	
		var childOne = this.newContainer.getChildAt(0);
		var buttonHeight = this.buttonHeight;
		var buttonWidth = this.buttonWidth;
		var buttonFill = this.buttonFill;

		childOne.graphics.clear();
		childOne.graphics.beginStroke("darkorange").beginFill(buttonFill).drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	}

	newButton.prototype.addListeners = function(fillColor)
	{	
		var childOne = this.newContainer.getChildAt(0);
		var buttonHeight = this.buttonHeight;
		var buttonWidth = this.buttonWidth;
		var buttonFill = this.buttonFill;

		this.newContainer.on("mouseover", function(event)
		{
			childOne.graphics.clear();
			childOne.graphics.beginStroke("darkorange").beginFill(fillColor).drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
			stage.update();		
		});

		this.newContainer.addEventListener("mouseout", function(event)
		{	
			childOne.graphics.clear();
			childOne.graphics.beginStroke("darkorange").beginFill(buttonFill).drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
			stage.update();
		});
	}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
	// Append to stage text and titles
	stage.addChild(background);
	stage.addChild(actionCanvas);
	stage.addChild(line);
	stage.addChild(title);
	stage.addChild(answerText);

	// Create Text Objects
	levelText = new newText("Nivel: Fácil", textFont, "darkorange", stage, (25*3), (75*1.25)); // Difficulty Level Text
	timeText = new newText("Tiempo: --", textFont, "darkorange", stage, (25*3) + 787, (75*1.25)); // Time Text 
	rightText = new newText("Aciertos: 0", textFont, "darkorange", stage, (25*3), (75*1.25) + 195); // Right Answer count Text
	wrongText = new newText("Errores: 0", textFont, "darkorange", stage, (25*3) + 780, (75*1.25) + 195); // Wrong Answer count Text
	correctText = new newText(" ", "300 38pt Source Sans Pro", "darkorange", stage, (stage.canvas.width / 2), (225 / 2) + 10); // Text state
	initText = new newText(" Elige un modo ", "300 38pt Source Sans Pro", "darkorange", stage, (stage.canvas.width / 2), (225 / 2) + 10);

	var modifier;
	var separator;

	modifier = 16;
	separator = 100;

	// Create Buttons
	modeAButton = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) - 265, 170, stage, "Realces", textFont, "white");
	modeBButton = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) + 145, 170, stage, "Cortes", textFont, "white");

	bButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, 25, 325, stage, "63 Hz",  buttonFont, "white");
	cButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 113), 325, stage, "125 Hz",  buttonFont, "white");
	dButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 226), 325, stage, "250 Hz",  buttonFont, "white");
	eButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 339), 325, stage, "500 Hz",  buttonFont, "white");
	fButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 451), 325, stage, "1 kHz",  buttonFont, "white");
	gButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 564), 325, stage, "2 kHz",  buttonFont, "white");
	hButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 677), 325, stage, "4 kHz",  buttonFont, "white");
	iButton = new newButton(buttonHeight + 27.5, buttonWidth, "gray", buttonStroke, (25 + 790), 325, stage, "8 kHz",  buttonFont, "white");

	stage.enableMouseOver(); // Enable pointer over buttons
	stage.update();

	modeAButton.addListeners("darkorange");
	modeBButton.addListeners("darkorange");

	modeAButton.newContainer.addEventListener("click", function(event)
	{
		levelSelectionButtons("Realces");
	});
	modeBButton.newContainer.addEventListener("click", function(event)
	{
		levelSelectionButtons("Cortes");
	});

// 															    MOUSE/KEYBOARD EVENTS
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  		INIT BUTTONS
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  ACTIVATE BUTTONS FUNCTIONS
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
	function activateButtons()
	{ 	

		// B Button
		bButton.addListeners("rgba(64, 64, 64, 0.9)");
		bButton.changeColor();

		bButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("63 Hz", compareFrequency(63));
		});

		// C Button
		cButton.addListeners("rgba(64, 64, 64, 0.9)");
		cButton.changeColor();	

		cButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("125 Hz", compareFrequency(125));
		});

		// D Button
		dButton.addListeners("rgba(64, 64, 64, 0.9)");
		dButton.changeColor();	

		dButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("250 Hz", compareFrequency(250));
		});

		//E Button
		eButton.addListeners("rgba(64, 64, 64, 0.9)");
		eButton.changeColor();

		eButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("500 Hz", compareFrequency(500));
		});	
		
		// F Button
		fButton.addListeners("rgba(64, 64, 64, 0.9)");
		fButton.changeColor();

		fButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("1000 Hz", compareFrequency(1000));
		});
		
		// G Button
		gButton.addListeners("rgba(64, 64, 64, 0.9)");
		gButton.changeColor();

		gButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("2000 Hz", compareFrequency(2000));
		});
		
		// H Button
		hButton.addListeners("rgba(64, 64, 64, 0.9)");
		hButton.changeColor();

		hButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("4000 Hz", compareFrequency(4000));
		});

		// I Button
		iButton.addListeners("rgba(64, 64, 64, 0.9)");
		iButton.changeColor();
		
		iButton.newContainer.addEventListener("click", function(event)
		{
			updateFrequencyText("8000 Hz", compareFrequency(8000));
		});

	}


// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  ACTIVATE BUTTONS FUNCTION - END
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
	function playButtonStart(startLevelUpdate, modeUpdate)
	{	
		playButton = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) - 60, 215, stage, "Iniciar", textFont, "white");
		changeButton = new newButton((buttonHeight + 110), buttonWidth, "orange", "orange", (940 / 2) - 94, 255, stage, "Escuchas: Original", textFont, "white");

		modeText = new newText("Modo: " + modeUpdate, textFont, "darkorange", stage, (25*10), (75*1.25));

		playButton.addListeners("darkorange");
		changeButton.addListeners("darkorange");

		playButton.newContainer.addEventListener("click", stopPlaying);
		changeButton.newContainer.addEventListener("click", changeMessage);

		if (startLevelUpdate == "Easy")
		{
			activateButtons();
			gainModifier = 10;
			gameControl.generateIconigta("Fácil");
			console.log(gameControl.Guess)
		}
		else if (startLevelUpdate == "Medium")
		{
			activateButtons();
			newPlayer.Correct = 20;
			newPlayer.level = "Intermedio";
			buttonActiveMedium = true;
			gainModifier = 6;
			gameControl.generateIconigta("Intermedio");
		}
		else
		{
			activateButtons();
			newPlayer.Correct = 30;
			newPlayer.level = "Avanzado";
			buttonActiveHard = true;
			gainModifier = 3;
			gameControl.generateIconigta("Avanzado");
		}
		if (modeUpdate == "Cortes") {gainModifier *= -1;}

		gameFilter.gain.value = gainModifier;
		gameFilter.frequency.value = gameControl.Guess;

		gainText = new newText("Ganancia: " + gainModifier.toString() + " dB", textFont, "darkorange", stage, (25*28), (75*1.25));
		rightText.createText.text = "Aciertos: " + newPlayer.subCounter.toString();
		levelText.createText.text = "Nivel: " + newPlayer.level;

		initEasy.newContainer.removeAllChildren();
		initMedium.newContainer.removeAllChildren();
		initAdvanced.newContainer.removeAllChildren();

		stage.removeChild(initText.createText);

		stage.update();

		delete initText;
		delete initEasy;
		delete initMedium;
		delete initAdvanced;
	}

	function levelSelectionButtons(gameMode)
	{	
		initText.createText.text = "Elige un nivel";

		initAdvanced = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) + 145, 170, stage, "Avanzado", textFont, "white");
		initMedium = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) - 60, 170, stage, "Intermedio", textFont, "white");
		initEasy = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) - 265, 170, stage, "Fácil", textFont, "white");

		initEasy.addListeners("darkorange");
		initMedium.addListeners("darkorange");
		initAdvanced.addListeners("darkorange");

		initEasy.newContainer.addEventListener("click", function(event)
		{
			playButtonStart("Easy", gameMode);
		});

		initMedium.newContainer.addEventListener("click", function(event)
		{
			playButtonStart("Medium", gameMode);
		});

		initAdvanced.newContainer.addEventListener("click", function(event)
		{
			playButtonStart("Advanced", gameMode);
		});

		modeAButton.newContainer.removeAllChildren();
		modeBButton.newContainer.removeAllChildren();

		delete modeAButton;
		delete modeBButton;
	}// 														   Change Button
// =====================================================================================================================================================
// =====================================================================================================================================================

	function changeMessage()
	{

		if (!original)
		{	
			changeButton.buttonText.text = "Escuchas: Original";
			changeButton.buttonText.x = (changeButton.newContainer.getBounds().width / 2) - (changeButton.buttonText.getBounds().width / 2);
			changeButton.buttonText.y = (changeButton.newContainer.getBounds().height / 2)- (changeButton.buttonText.getBounds().height / 2) * 1.5;
			controlLevel.gain.value = 1;
			controlFilterLevel.gain.value = 0;
			original = true;			
		}
		else 
		{	
			changeButton.buttonText.text = "Escuchas: Modificada";
			changeButton.buttonText.x = (changeButton.newContainer.getBounds().width / 2) - (changeButton.buttonText.getBounds().width / 2);
			changeButton.buttonText.y = (changeButton.newContainer.getBounds().height / 2)- (changeButton.buttonText.getBounds().height / 2) * 1.5;
			// Signal Processing changes with every different game
			controlLevel.gain.value = 0;
			controlFilterLevel.gain.value = 1;
			original = false;
		}
		stage.update();
	}

// 														   Play Button
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

	function stopPlaying()
	{
		if (oneTime)	
		{	
			time = newPlayer.timer;
			timedFunction();
			oneTime = false;
		}

		if (!pause)
		{	
			resetCanvasLine();
			playButton.buttonText.text = "Reproducir";
			playButton.buttonText.x = (playButton.newContainer.getBounds().width / 2) - (playButton.buttonText.getBounds().width / 2);
			playButton.buttonText.y = (playButton.newContainer.getBounds().height / 2)- (playButton.buttonText.getBounds().height / 2) * 1.5;
			soundOne.stopSound(); // Stop sound from audio object

			pause = true;			
		}
		else 
		{	
			beep = false;
			if (soundOne.active){soundOne.stopSound();}

			answerText.text = " ";
			correctText.createText.text = " ";

			playButton.buttonText.text = "Detener";
			playButton.buttonText.x = (playButton.newContainer.getBounds().width / 2) - (playButton.buttonText.getBounds().width / 2);
			playButton.buttonText.y = (playButton.newContainer.getBounds().height / 2)- (playButton.buttonText.getBounds().height / 2) * 1.5;
			soundOne.startSound(newPlayer.url);
			soundOne.drawThis();

			pause = false;
		}

		stage.update();
	}
// 														   Update Functions
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------- 
	function updateFrequencyText(newFreq, newColor) // Called when the answer is right 
	{
		answerText.text = newFreq;
		answerText.color = newColor
		answerText.x = (stage.canvas.width / 2) - (answerText.getBounds().width / 2);
		answerText.y = ((225 / 2) + 75) - (answerText.getBounds().height/1.2) - 13;
		stage.update();

		// ==========================================================================================================================

		if (newPlayer.level == "Intermedio" && !buttonActiveMedium)
		{
			setTimeout(function()
			{
				correctText.createText.text = "Nivel"; // Change displayText
				correctText.createText.color = "darkorange"; // Change displayText color
				correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2); // Update position
				correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height) // Update position

				answerText.text = "Intermedio";
				answerText.color = "darkorange";
				answerText.x = (stage.canvas.width / 2) - (answerText.getBounds().width / 2);
				answerText.y = ((225 / 2) + 75) - (answerText.getBounds().height/1.2);
			}, 250)

			buttonActiveMedium = true;

			gameFilter.gain.value = (gainModifier/gainModifier) * 6;

			var actualGain = gameFilter.gain.value;
			console.log(actualGain);
			gainText.createText.text = ("Ganancia: " + actualGain.toString() + " dB");

		}

		if (newPlayer.level == "Avanzado" && !buttonActiveHard)
		{
			setTimeout(function()
			{
				correctText.createText.text = "Nivel"; // Change displayText
				correctText.createText.color = "darkorange"; // Change displayText color
				correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2); // Update position
				correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height) // Update position

				answerText.text = "Avanzado";
				answerText.color = "darkorange";
				answerText.x = (stage.canvas.width / 2) - (answerText.getBounds().width / 2);
				answerText.y = ((225 / 2) + 75) - (answerText.getBounds().height/1.2);
			}, 250)
			
			buttonActiveHard = true;

			gameFilter.gain.value = (gainModifier/gainModifier) * 3;

			var actualGain = gameFilter.gain.value;
			console.log(actualGain);
			gainText.createText.text = ("Ganancia: " + actualGain.toString() + " dB");
		}
	}

	function compareFrequency(newValue) // Called when any answer button is pressed
	{	
		var color;

		if (newValue == gameControl.Guess) // Right Answer!
		{	
			newPlayer.rightAnswer(); // Add to right answer counter
			stopPlaying(); // Call function to stop playing sound

			soundOne.startSound(url2); // Play beep sound
			beep = true; // Beep is playing
			setTimeout (function(){if(beep){soundOne.stopSound()} beep = false;}, 750); // Stop beep

			correctText.createText.text = "¡Correcto!"; // Change displayText
			correctText.createText.color = "darkorange"; // Change displayText color
			correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2); // Update position
			correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height) // Update position

			rightText.createText.text = "Aciertos: " + newPlayer.subCounter.toString(); // update right answers
			levelText.createText.text = "Nivel: " + newPlayer.level; // update difficulty text
			gameControl.generateIconigta(newPlayer.level) // generate new incognita

			gameFilter.frequency.value = gameControl.Guess;

			newPlayer.generateURL();
			rightStop = true;

			time = newPlayer.timer; // Reset Timer
			updateTimeText();
			original = false; // Reset comparison button flag
			changeMessage(); // Reset comparison button

			stage.update();

			return color = "darkorange" // Return right answer color
		}
		else // Wrong Answer
		{	
			newPlayer.wrongAnswer(); // Add to the wrong answer text

			correctText.createText.text = "Incorrecto";
			correctText.createText.color = "red";
			correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2);
			correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height)

			wrongText.createText.text = "Errores: " + newPlayer.Wrong.toString(); // update wrong answers
			levelText.createText.text = "Nivel: " + newPlayer.level; // update difficulty level text
			return color = "red" // Return wrong answer color
		}
	}

	function updateTimeText()
	{
		timeText.createText.text = "Tiempo: " + time;
		stage.update();
	}

	function timedFunction() // This function is called when the counter starts
	{	
		updateTimeText();

		var alpha = setInterval(function()
		{	
			if (time <= 1)
			{	
				time = newPlayer.timer;
				compareFrequency("Time")
				answerText.text = "R. " + gameControl.Guess.toString() + " dB";
				answerText.color = "red";
				answerText.x = (stage.canvas.width / 2) - (answerText.getBounds().width / 2);
				answerText.y = ((225 / 2) + 75) - (answerText.getBounds().height/1.2);
				pause = false;
				rightStop = true;
				gameControl.generateIconigta(newPlayer.level);
				gameFilter.frequency.value = gameControl.Guess;
				stopPlaying();
			}

			if (rightStop)
			{	
				clearInterval(alpha); 
				oneTime = true; 
				rightStop = false;
				updateTimeText();
				return;
			}

			time--; //Decreases Time
			updateTimeText();

		}, 1000);
	}
}
