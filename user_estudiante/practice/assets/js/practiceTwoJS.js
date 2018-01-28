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
	this.url  = "http://freesound.org/data/previews/277/277325_4548252-lq.mp3";
	this.urlList = ["http://freesound.org/data/previews/277/277325_4548252-lq.mp3", 
	"http://freesound.org/data/previews/325/325407_4548252-lq.mp3",
	"http://freesound.org/data/previews/350/350877_2305278-lq.mp3",
	"http://freesound.org/data/previews/174/174589_2188371-lq.mp3"];
}

player.prototype.rightAnswer = function() // Answer counter
{	
	this.Correct++;
	if (this.Correct == 10){this.level = "Intermedio"; this.timer = 15}
	else if (this.Correct >= 20){this.level = "Avanzado"; this.timer = 10}
};
player.prototype.wrongAnswer = function() {this.Wrong++;};
player.prototype.resetAnswer = function() {this.Correct = 0; this.Wrong = 0;};

player.prototype.generateURL = function() {this.url = this.urlList[Math.floor(Math.random () * 4)]};

// 									AudioCtx init
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gameOscillator = audioCtx.createOscillator();
	gameOscillator.type = "sine";
	gameOscillator.frequency.value = 0;
	gameOscillator.start();

var controlLevel = audioCtx.createGain();
	controlLevel.gain.value = 1;
	controlLevel.connect(audioCtx.destination);

var buttonActiveMedium = false;
var buttonActiveHard = false;

// Create Analyzer
var analyser = audioCtx.createAnalyser();

var gameOscillatorControl = function() // Game Object Constructor
{	
	// This will be the incognitas to use in game, they'll change according to the game
	this.frequencyListA = [-10, 0, 10]; // Easy Level
	this.frequencyListB = [-4, -6, -10, 0, 10, 6, 4]; // Medium Level
	this.frequencyListC = [-1, -2, -4, -6, -10, 0, 10, 6, 4, 1]; // Hard Level
	this.Guess = this.frequencyListA[Math.floor(Math.random() * 3)]; // Initialize an icongnita
}

gameOscillatorControl.prototype.generateIconigta = function (level) 
{	
	if (level == "Fácil") { this.Guess = this.frequencyListA[Math.floor(Math.random() * 3)]}
	else if (level == "Intermedio") { this.Guess = this.frequencyListB[Math.floor(Math.random() * 7)] }
	else if (level = "Avanzado") { this.Guess = this.frequencyListC[Math.floor(Math.random() * 8)] }
};

gameOscillatorControl.prototype.controlGain = function (change)
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

// 																		 Preload Audio

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
	gameControl = new gameOscillatorControl();
	gameOscillator.frequency.value = 0;

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
	var url2 = "http://freesound.org/data/previews/352/352651_4019029-lq.mp3";

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
	var title = new createjs.Text("CAMBIOS DE NIVEL", "300 24pt Source Sans Pro", "white");
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

	// Create Buttons
	aButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, 26, 325, stage, "-1 dB", buttonFont, "white");
	bButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + 81), 325, stage, "- 2 dB",  buttonFont, "white");
	cButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + (81*2)), 325, stage, "- 4 dB",  buttonFont, "white");
	dButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + (81*3)), 325, stage, "- 6 dB",  buttonFont, "white");
	eButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (26 + (81*4)), 325, stage, "- 10 dB",  buttonFont, "white");
	fButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (26 + (81*5)), 325, stage, "0 dB",  buttonFont, "white");
	gButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (26 + (81*6)), 325, stage, "+ 10 dB",  buttonFont, "white");
	hButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + (81*7)), 325, stage, "+ 6 dB",  buttonFont, "white");
	iButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + (81*8)), 325, stage, "+ 4 dB",  buttonFont, "white");
	jButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + (81*9)), 325, stage, "+ 2 dB",  buttonFont, "white");
	kButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (26 + (81*10)), 325, stage, "+ 1 dB",  buttonFont, "white");
	playButton = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) - 60, 215, stage, "Iniciar", textFont, "white");
	changeButton = new newButton((buttonHeight + 110), buttonWidth, "orange", "orange", (940 / 2) - 94, 255, stage, "Escuchas: Original", textFont, "white");
	stage.enableMouseOver(); // Enable pointer over buttons
	stage.update();

// 															    MOUSE/KEYBOARD EVENTS
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  		INIT BUTTONS
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------


// 															  BUTTON E
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
	eButton.newContainer.addEventListener("mouseover", function(event)
	{	
		eButton.createButton.graphics.clear();
		eButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	eButton.newContainer.addEventListener("mouseout", function(event)
	{	
		eButton.createButton.graphics.clear();
		eButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	eButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("- 10 dB", compareFrequency(-10));
	});
// 															  Button 6
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
	fButton.newContainer.addEventListener("mouseover", function(event)
	{	
		fButton.createButton.graphics.clear();
		fButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	fButton.newContainer.addEventListener("mouseout", function(event)
	{	
		fButton.createButton.graphics.clear();
		fButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	fButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("0 dB", compareFrequency(0));
	});
// 															  Button 7
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
	gButton.newContainer.addEventListener("mouseover", function(event)
	{	
		gButton.createButton.graphics.clear();
		gButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	gButton.newContainer.addEventListener("mouseout", function(event)
	{	
		gButton.createButton.graphics.clear();
		gButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	gButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("+ 10 dB", compareFrequency(10));
	});


// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  ACTIVATE BUTTONS FUNCTIONS
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
function activateButtonsMediumLevel()
{
// 																Button 3
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
	cButton.createButton.graphics.clear();
	cButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();

	cButton.newContainer.addEventListener("mouseover", function(event)
	{	
		cButton.createButton.graphics.clear();
		cButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	cButton.newContainer.addEventListener("mouseout", function(event)
	{	
		cButton.createButton.graphics.clear();
		cButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	cButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("- 4 dB", compareFrequency(-4));
	});
// 																Button 4
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	dButton.createButton.graphics.clear();
	dButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();

	dButton.newContainer.addEventListener("mouseover", function(event)
	{	
		dButton.createButton.graphics.clear();
		dButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	dButton.newContainer.addEventListener("mouseout", function(event)
	{	
		dButton.createButton.graphics.clear();
		dButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	dButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("- 6 dB", compareFrequency(-6));
	});
// 															Button 8
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	hButton.createButton.graphics.clear();
	hButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();

	hButton.newContainer.addEventListener("mouseover", function(event)
	{	
		hButton.createButton.graphics.clear();
		hButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	hButton.newContainer.addEventListener("mouseout", function(event)
	{	
		hButton.createButton.graphics.clear();
		hButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	hButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("+ 6 dB", compareFrequency(6));
	});
// 															Button 9
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	iButton.createButton.graphics.clear();
	iButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();	

	iButton.newContainer.addEventListener("mouseover", function(event)
	{	
		iButton.createButton.graphics.clear();
		iButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	iButton.newContainer.addEventListener("mouseout", function(event)
	{	
		iButton.createButton.graphics.clear();
		iButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	iButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("+ 4 dB", compareFrequency(4));
	});
}

function activateButtonsHardLevel()
{
	// 															Button 10
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	
	jButton.createButton.graphics.clear();
	jButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();	

	jButton.newContainer.addEventListener("mouseover", function(event)
	{	
		jButton.createButton.graphics.clear();
		jButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	jButton.newContainer.addEventListener("mouseout", function(event)
	{	
		jButton.createButton.graphics.clear();
		jButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	jButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("+ 2 dB", compareFrequency(2));
	});

// 															Button 11
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	kButton.createButton.graphics.clear();
	kButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();

	kButton.newContainer.addEventListener("mouseover", function(event)
	{	
		kButton.createButton.graphics.clear();
		kButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	kButton.newContainer.addEventListener("mouseout", function(event)
	{	
		kButton.createButton.graphics.clear();
		kButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	kButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("+ 1 dB", compareFrequency(1));
	});

	aButton.createButton.graphics.clear();
	aButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();

	aButton.newContainer.addEventListener("mouseover", function(event)
	{	
		aButton.createButton.graphics.clear();
		aButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	aButton.newContainer.addEventListener("mouseout", function(event)
	{	
		aButton.createButton.graphics.clear();
		aButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	aButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("- 1 dB", compareFrequency(-1));
	});
// 																Button 2								
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	bButton.createButton.graphics.clear();
	bButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
	stage.update();

	bButton.newContainer.addEventListener("mouseover", function(event)
	{	
		bButton.createButton.graphics.clear();
		bButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.3)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		stage.update();
	});

	bButton.newContainer.addEventListener("mouseout", function(event)
	{	
		bButton.createButton.graphics.clear();
		bButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	bButton.newContainer.addEventListener("click", function(event)
	{
		updateFrequencyText("- 2 dB", compareFrequency(-2));
	});

}

// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  ACTIVATE BUTTONS FUNCTION - END
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================


// 														   Change Button
// =====================================================================================================================================================
// =====================================================================================================================================================
	changeButton.newContainer.addEventListener("mouseover", function(event)
	{
		changeButton.createButton.graphics.clear();
		changeButton.createButton.graphics.beginStroke("orange").beginFill("darkorange").drawRoundRect(0, 0, (buttonHeight + 110), buttonWidth, 10, 90, 10, 90);
		stage.update();		
	});

	changeButton.newContainer.addEventListener("mouseout", function(event)
	{
		changeButton.createButton.graphics.clear();
		changeButton.createButton.graphics.beginStroke("orange").beginFill("orange").drawRoundRect(0, 0, (buttonHeight + 110), buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	changeButton.newContainer.addEventListener("click", changeMessage);

	function changeMessage()
	{

		if (!original)
		{	
			changeButton.buttonText.text = "Escuchas: Original";
			changeButton.buttonText.x = (changeButton.newContainer.getBounds().width / 2) - (changeButton.buttonText.getBounds().width / 2);
			changeButton.buttonText.y = (changeButton.newContainer.getBounds().height / 2)- (changeButton.buttonText.getBounds().height / 2) * 1.5;
			controlLevel.gain.value = 1;
			original = true;			
		}
		else 
		{	
			changeButton.buttonText.text = "Escuchas: Modificada";
			changeButton.buttonText.x = (changeButton.newContainer.getBounds().width / 2) - (changeButton.buttonText.getBounds().width / 2);
			changeButton.buttonText.y = (changeButton.newContainer.getBounds().height / 2)- (changeButton.buttonText.getBounds().height / 2) * 1.5;
			// Signal Processing changes with every different game
			controlLevel.gain.value = Math.pow(10, (gameControl.Guess / 20));

			original = false;
		}
		stage.update();
	}

// 														   Play Button
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

	playButton.newContainer.addEventListener("mouseover", function(event)
	{
		playButton.createButton.graphics.clear();
		playButton.createButton.graphics.beginStroke("darkorange").beginFill("darkorange").drawRoundRect(0, 0, (buttonHeight + 40), buttonWidth, 10, 90, 10, 90);
		stage.update();		
	});

	playButton.newContainer.addEventListener("mouseout", function(event)
	{
		playButton.createButton.graphics.clear();
		playButton.createButton.graphics.beginStroke("orange").beginFill("orange").drawRoundRect(0, 0, (buttonHeight + 40), buttonWidth, 10, 90, 10, 90);;
		stage.update();
	});

	playButton.newContainer.addEventListener("click", stopPlaying);

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
			activateButtonsMediumLevel(); 

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

		}

		if (newPlayer.level == "Avanzado" && !buttonActiveHard)
		{
			activateButtonsHardLevel(); 

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

			rightText.createText.text = "Aciertos: " + newPlayer.Correct.toString(); // update right answers
			levelText.createText.text = "Nivel: " + newPlayer.level; // update difficulty text
			gameControl.generateIconigta(newPlayer.level) // generate new incognita

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