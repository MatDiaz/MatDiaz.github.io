//							  Reconocimiento de Frecuencias 							    //
//				** Aplicacion Web De Entrenamiento Auditivo Técnico ** 						//		
//				**            Para Ingenieros de Sonido. 			**						//
// -----------------------------------------------------------------------------------------//

// 									PLAYER OBJECT
// ============================================================================================
// ============================================================================================
// --------------------------------------------------------------------------------------------

var player = function()
{
	this.Correct = 0;
	this.Wrong = 0;
	this.level = "Fácil";
	this.timer = 20;
}

player.prototype.rightAnswer = function() 
{	
	this.Correct++;
	if (this.Correct == 20){this.level = "Intermedio"; this.timer = 15;}
	else if (this.Correct >= 40){this.level = "Avanzado"; this.timer = 10}
}
player.prototype.wrongAnswer = function() {this.Wrong++;};
player.prototype.resetAnswer = function() {this.Correct = 0; this.Wrong = 0;};


// 									audioCtx init
// ============================================================================================
// ============================================================================================
// --------------------------------------------------------------------------------------------

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gameOscillator = audioCtx.createOscillator();
	gameOscillator.type = "sine";
	gameOscillator.frequency.value = 0;
	gameOscillator.start();

var controlLevel = audioCtx.createGain();
	controlLevel.gain.value = 0;

	gameOscillator.connect(controlLevel);
	controlLevel.connect(audioCtx.destination);

var beepLevelControl = audioCtx.createGain();
	beepLevelControl.gain.value = 1;
	beepLevelControl.connect(audioCtx.destination);

var buttonActiveMedium = false;
var buttonActiveHard = false;

var prevAnswer = 0;

var gameOscillatorControl = function()
{
	this.frequencyListA = [250, 500, 1000, 2000];
	this.frequencyListB = [125, 250, 500, 1000, 2000, 4000, 8000];
	this.frequencyListC = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
	this.toneGuess = this.frequencyListA[Math.floor(Math.random() * 4)];
	this.gainValue = 0;
}

gameOscillatorControl.prototype.generateIconigta = function (level) 
{	
	if (level == "Fácil") { this.toneGuess = this.frequencyListA[Math.floor(Math.random() * 4)]}
	else if (level == "Intermedio") { this.toneGuess = this.frequencyListB[Math.floor(Math.random() * 7)] }
	else if (level = "Avanzado") { this.toneGuess = this.frequencyListC[Math.floor(Math.random() * 10)] }
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

		source.connect(beepLevelControl);
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
// 																		 Create JS init
// =====================================================================================================================================================
// =====================================================================================================================================================

function init()
{	
	// Create Audio Player
	soundOne = new addSound();

	// Create New Player
	newPlayer = new player();

	// Create Game Controls
	gameControl = new gameOscillatorControl();
	gameOscillator.frequency.value = gameControl.toneGuess;

	// Variables
	var sineArray = []; 
	var time = 0;
	var oneTime = true;
	var pause = true;
	var original = true;
	var beep = true;
	var rightStop = false;
	var url2 = "https://freesound.org/data/previews/352/352651_4019029-lq.mp3";

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(60);

	// Animation
	function handleTick() 
	{	
		if (!pause)
		{	
			line.graphics.clear();
			line.graphics.setStrokeStyle(1);
			line.graphics.beginStroke('rgba(255, 255, 255, 0.1)');
			line.graphics.moveTo (25, 75 + (225 / 2));
			for (var i = 25; i < (890 + 25); ++i) 
			{	
				sineArray[i - 25] = (225 / 2.5) * (Math.sin((((i / 890) * 2 * Math.PI) * 4 ) - (stageInit / 6)));
				line.graphics.lineTo (i, ((225 / 2) + 75) + sineArray[i - 25]);
			}

			stageInit++;
			if (stageInit == ((890 + 25) * 6)){ stageInit = 0;}
			stage.update();
		}
		  
	}

	// Stage
	var stage = new createjs.Stage("frequencyApp");
	
	// Background
	var background = new createjs.Shape();
		background.graphics.beginFill("rgba(0, 0, 0, 0.90)").drawRoundRect(0, 0, 940, 385, 10, 90, 10, 90);

	// Second Rectangle Over
	var actionCanvas = new createjs.Shape();
		actionCanvas.graphics.beginStroke("darkorange").beginFill("rgba(32, 32, 32, 0.75)").drawRoundRect(25, 75, 890, 225, 10, 90, 10, 90);

	// Title
	var title = new createjs.Text("RECONOCIMIENTO DE TONOS", "300 24pt Source Sans Pro", "white");
		title.x = stage.canvas.width / 2 - (title.getBounds().width / 2);
		title.y = (title.getBounds().height / 2);

	// Frequency
	var frequencyText = new createjs.Text(" ", "300 34pt Source Sans Pro", "darkorange");
		frequencyText.x = (stage.canvas.width / 2) - (frequencyText.getBounds().width / 2);
		frequencyText.y = ((225 / 2) + 75) - (frequencyText.getBounds().height);

	// Line
	var line = new createjs.Shape();
	line.graphics.setStrokeStyle(1);
	line.graphics.beginStroke('rgba(255, 255, 255, 0.1)');
	line.graphics.moveTo (25, 75 + (225 / 2));
	// Init Line
	for (var i = 25; i < (890 + 25); ++i) 
	{
		line.graphics.lineTo (i, ((225 / 2) + 75));
	}
	var stageInit = 0;

// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
	// Button Properties
	var buttonHeight = 80;
	var buttonWidth = 35;
	var buttonStroke = "black";
	var buttonFont = "300 13pt Source Sans Pro";
	var textFont = "300 14pt Source Sans Pro";

	// Clase para dibujar texto
	var newText = function(text, font, color, stage, x, y)
	{
		this.createText = new createjs.Text(text, font, "darkorange"); // 
		this.createText.x = x - (this.createText.getBounds().width / 2); //
		this.createText.y = y  - (this.createText.getBounds().height); //
		stage.addChild(this.createText); //
	}

	// Clase para dibujar botones
	var newButton = function(buttonHeight, buttonWidth, buttonStroke, buttonFill, x, y, canvasStage, text, font, color)
	{	
		this.newContainer = new createjs.Container(); this.newContainer.setBounds(x, y, buttonHeight, buttonWidth);
		this.createButton = new createjs.Shape();
		this.createButton.graphics.beginStroke(buttonStroke).beginFill(buttonFill).drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
		this.buttonText = new createjs.Text(text, font, color);
		this.buttonText.x = (this.newContainer.getBounds().width / 2) - (this.buttonText.getBounds().width / 2);
		this.buttonText.y = (this.newContainer.getBounds().height / 2)- (this.buttonText.getBounds().height / 2)*1.5;
		this.newContainer.x = x;
		this.newContainer.y = y;
		this.newContainer.cursor = "pointer";
		this.newContainer.addChild(this.createButton, this.buttonText);
		stage.addChild(this.newContainer);
	}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

	stage.addChild(background);
	stage.addChild(actionCanvas);
	stage.addChild(line);
	stage.addChild(title);
	stage.addChild(frequencyText);

	// Create Text Objects
	levelText = new newText("Nivel: Fácil", textFont, "darkorange", stage, (25*3), (75*1.25));
	timeText = new newText("Tiempo: --", textFont, "darkorange", stage, (25*3) + 787, (75*1.25));
	rightText = new newText("Aciertos: 0", textFont, "darkorange", stage, (25*3), (75*1.25) + 195);
	wrongText = new newText("Errores: 0", textFont, "darkorange", stage, (25*3) + 780, (75*1.25) + 195);
	correctText = new newText(" ", "300 38pt Source Sans Pro", "darkorange", stage, (stage.canvas.width / 2), (225 / 2) + 10); // Text state

	// Create Buttons
	aButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, 25, 325, stage, "31 Hz", buttonFont, "white");
	bButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (25 + 90), 325, stage, "63 Hz",  buttonFont, "white");
	cButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (25 + 180), 325, stage, "125 Hz",  buttonFont, "white");
	dButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (25 + 270), 325, stage, "250 Hz",  buttonFont, "white");
	eButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (25 + 360), 325, stage, "500 Hz",  buttonFont, "white");
	fButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (25 + 450), 325, stage, "1 kHz",  buttonFont, "white");
	gButton = new newButton(buttonHeight, buttonWidth, "darkorange", buttonStroke, (25 + 540), 325, stage, "2 kHz",  buttonFont, "white");
	hButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (25 + 630), 325, stage, "4 kHz",  buttonFont, "white");
	iButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (25 + 720), 325, stage, "8 kHz",  buttonFont, "white");
	jButton = new newButton(buttonHeight, buttonWidth, "gray", buttonStroke, (25 + 810), 325, stage, "16 kHz",  buttonFont, "white");
	playButton = new newButton((buttonHeight + 40), buttonWidth, "orange", "orange", (940 / 2) - 60, 235, stage, "Iniciar", textFont, "white");
	stage.enableMouseOver();
	stage.update();


// 															    MOUSE/KEYBOARD EVENTS
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  		INIT BUTTONS
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

// 															  		 BUTTON F
// =====================================================================================================================================================
// =====================================================================================================================================================
	
	fButton.newContainer.addEventListener("mouseover", function(event)
	{	
		fButton.createButton.graphics.clear();
		fButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
		updateFrequencyText("1000 Hz", compareFrequency(1000));

	});
// 															  		 BUTTON G
// =====================================================================================================================================================
// =====================================================================================================================================================
	
	gButton.newContainer.addEventListener("mouseover", function(event)
	{	
		gButton.createButton.graphics.clear();
		gButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
		updateFrequencyText("2000 Hz", compareFrequency(2000));
	});

// 															  		 BUTTON D
// =====================================================================================================================================================
// =====================================================================================================================================================

	
	dButton.newContainer.addEventListener("mouseover", function(event)
	{	
		dButton.createButton.graphics.clear();
		dButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
		updateFrequencyText("250 Hz", compareFrequency(250));
	});

	eButton.newContainer.addEventListener("mouseover", function(event)
		{	
			eButton.createButton.graphics.clear();
			eButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("500 Hz", compareFrequency(500));
		});

// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  ACTIVATE BUTTONS FUNCTIONS
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================

	function activateButtonsMediumLevel()
	{	
	  //												    	  Button C
	// =================================================================================================================================================
	// =================================================================================================================================================
		cButton.createButton.graphics.clear();
		cButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();		

		cButton.newContainer.addEventListener("mouseover", function(event)
		{	
			cButton.createButton.graphics.clear();
			cButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("125 Hz", compareFrequency(125));
		});

	//														  Button I
	// =================================================================================================================================================
	// =================================================================================================================================================
		iButton.createButton.graphics.clear();
		iButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();

		iButton.newContainer.addEventListener("mouseover", function(event)
		{	
			iButton.createButton.graphics.clear();
			iButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("8000 Hz", compareFrequency(8000));
		});

	//														  Button H
	// =================================================================================================================================================
	// =================================================================================================================================================
		hButton.createButton.graphics.clear();
		hButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();

		hButton.newContainer.addEventListener("mouseover", function(event)
		{	
			hButton.createButton.graphics.clear();
			hButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("4000 Hz", compareFrequency(4000));
		});

	}

function activateButtonsHardLevel()
{
	//														  Button A
	// =================================================================================================================================================
	// =================================================================================================================================================
		aButton.createButton.graphics.clear();
		aButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();

		aButton.newContainer.addEventListener("mouseover", function(event)
		{	
			aButton.createButton.graphics.clear();
			aButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("31 Hz", compareFrequency(31));
		});

	//														  Button B
	// =================================================================================================================================================
	// =================================================================================================================================================
		bButton.createButton.graphics.clear();
		bButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();

		bButton.newContainer.addEventListener("mouseover", function(event)
		{	
			bButton.createButton.graphics.clear();
			bButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("63 Hz", compareFrequency(63));
		});

	//														  Button J
	// =================================================================================================================================================
	// =================================================================================================================================================
		jButton.createButton.graphics.clear();
		jButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(0, 0, 0, 0.5)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);;
		stage.update();

		jButton.newContainer.addEventListener("mouseover", function(event)
		{	
			jButton.createButton.graphics.clear();
			jButton.createButton.graphics.beginStroke("darkorange").beginFill("rgba(64, 64, 64, 0.9)").drawRoundRect(0, 0, buttonHeight, buttonWidth, 10, 90, 10, 90);
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
			updateFrequencyText("16000 Hz", compareFrequency(16000));
		});
}
// =====================================================================================================================================================
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 															  ACTIVATE BUTTONS FUNCTION - END
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// =====================================================================================================================================================



// 														   PLAY BUTTON
// =====================================================================================================================================================
// =====================================================================================================================================================

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
			line.graphics.clear();
			line.graphics.setStrokeStyle(1);
			line.graphics.beginStroke('rgba(255, 255, 255, 0.1)');
			line.graphics.moveTo (25, 75 + (225 / 2));
			for (var i = 25; i < (890 + 25); ++i) 
			{
				line.graphics.lineTo (i, ((225 / 2) + 75));
			}
			playButton.buttonText.text = "Reproducir";
			playButton.buttonText.x = (playButton.newContainer.getBounds().width / 2) - (playButton.buttonText.getBounds().width / 2);
			playButton.buttonText.y = (playButton.newContainer.getBounds().height / 2)- (playButton.buttonText.getBounds().height / 2) * 1.5;
			controlLevel.gain.value =  gameControl.controlGain("Stop");

			pause = true;			
		}
		else 
		{	
			beep = false;
			if (soundOne.active){soundOne.stopSound();}

			frequencyText.text = " ";
			correctText.createText.text = " "
			playButton.buttonText.text = "Detener";
			playButton.buttonText.x = (playButton.newContainer.getBounds().width / 2) - (playButton.buttonText.getBounds().width / 2);
			playButton.buttonText.y = (playButton.newContainer.getBounds().height / 2)- (playButton.buttonText.getBounds().height / 2) * 1.5;
			controlLevel.gain.value = gameControl.controlGain("Play");

			pause = false;
		}

		stage.update();
	}

// =====================================================================================================================================================
// =====================================================================================================================================================
	
	function updateFrequencyText(newFreq, newColor)
	{
		frequencyText.text = newFreq;
		frequencyText.color = newColor;
		frequencyText.x = (stage.canvas.width / 2) - (frequencyText.getBounds().width / 2);
		frequencyText.y = ((225 / 2) + 75) - (frequencyText.getBounds().height/1.2);

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

				frequencyText.text = "Intermedio";
				frequencyText.color = "darkorange";
				frequencyText.x = (stage.canvas.width / 2) - (frequencyText.getBounds().width / 2);
				frequencyText.y = ((225 / 2) + 75) - (frequencyText.getBounds().height/1.2);
			}, 250)

			buttonActiveMedium = true;

		}

		if (newPlayer.level == "Avanzado" && !buttonActiveHard)
		{
			activateButtonsHardLevel(); 
			buttonActiveHard = true;

			setTimeout(function()
			{
				correctText.createText.text = "Nivel"; // Change displayText
				correctText.createText.color = "darkorange"; // Change displayText color
				correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2); // Update position
				correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height) // Update position

				frequencyText.text = "Avanzado";
				frequencyText.color = "darkorange";
				frequencyText.x = (stage.canvas.width / 2) - (frequencyText.getBounds().width / 2);
				frequencyText.y = ((225 / 2) + 75) - (frequencyText.getBounds().height/1.2);
			}, 250)
		}

		stage.update();
	}

	function updateTimeText()
	{
		timeText.createText.text = "Tiempo: " + time;
		stage.update();
	}

	function compareFrequency(newValue)
	{	
		var color
		if (newValue == gameControl.toneGuess) // If right answer
		{	
			newPlayer.rightAnswer();
			pause = false;
			stopPlaying();

			soundOne.startSound(url2); // Play beep sound
			beep = true; // Beep is playing
			setTimeout (function(){if(beep){soundOne.stopSound()} beep = false;}, 750); // Stop beep

			correctText.createText.text = "¡Correcto!"; // Change displayText
			correctText.createText.color = "darkorange"; // Change displayText color
			correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2); // Update position
			correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height) // Update position

			rightStop = true; // Stop timer because of a right answer

			rightText.createText.text = "Aciertos: " + newPlayer.Correct.toString();
			levelText.createText.text = "Nivel: " + newPlayer.level;
			gameControl.generateIconigta(newPlayer.level)
			gameOscillator.frequency.value = gameControl.toneGuess;

			time = newPlayer.timer; // Reset Timer
			updateTimeText(); // Update timer text
			original = false; // Reset comparison button flag
			return color = "darkorange"
		}
		else
		{	
			newPlayer.wrongAnswer();

			correctText.createText.text = "Incorrecto";
			correctText.createText.color = "red";
			correctText.createText.x = (stage.canvas.width / 2) - (correctText.createText.getBounds().width / 2);
			correctText.createText.y = ((225 / 2) + 10) - (correctText.createText.getBounds().height)

			wrongText.createText.text = "Errores: " + newPlayer.Wrong.toString();
			levelText.createText.text = "Nivel: " + newPlayer.level;
			return color = "red"
		}
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
				frequencyText.text = "R. " + gameControl.toneGuess.toString() + " Hz";
				frequencyText.color = "red";
				frequencyText.x = (stage.canvas.width / 2) - (frequencyText.getBounds().width / 2);
				frequencyText.y = ((225 / 2) + 75) - (frequencyText.getBounds().height/1.2);
				pause = false;
				rightStop = true;
				gameControl.generateIconigta(newPlayer.level); 
				stopPlaying();
				gameOscillator.frequency.value = gameControl.toneGuess;
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