	// UI configuration
	var SpriteWidth=60;
	var SpriteHeight=60;
	var ScreenWidth=650;
	var ScreenHeight=790;
	var ImageWidth=60;
	var ImageHeight=60;

  	var StartGame=false;
  	var isDialogOpen=0;
  	var isRandomEvent=0;
	var pathIndex=0;
	var playersStaticMovementIndex=[0,0,0,0];
	var WinplayersStaticMovementIndex=[0,0,0,0];
	var frameArray=[0,1,2,3,4,5,6,7,8,9];
	
	var gameSpritesName=["Oran", "Apple", "Pearis", "Grapeth"];
	var gameRoundDisplay=new Array();
	var gameSprites=new Array();
	var gameBigSprites=new Array();
	var gameSpritesLogo=new Array();
	var gameSpritesMark=new Array();
	var gameBuildings=new Array();
	var gamedice=new ASObject();
	
	//0=land, 1=owned, 2=chancecard, 3=chest, 4=badevent, 5=start, 6=jail, 7=hightea, 8=special land
	var boardroad = [
		5,0,3,0,4,8,0,2,0,0,6,
		0,4,0,0,8,0,3,0,0,7,
		0,2,0,0,8,0,0,4,0,6,
		0,0,3,0,8,2,0,4,0
	];
	
	// Player's attributes
	var playersPosition=[0,0,0,0];
	var playersMoney = [15000, 15000, 15000, 15000];
	var playersState=[0,0,0,0];
	
	// Game State variables
	var usingPlayer=null;
	var isJail=[0,0,0,0];
	var isGameOver=[0,0,0,0];
	var noGameOver=0;
	var isAI=[0,1,1,1];
	var oneroundmoney=2000;
	var totalroad=40;
	var RoadDistance=50;
	var roundNow=0;
	var round=0;
	
	function init(){
		StartGame=true;
		initplayers();
		initplayersLogo();
		initDice();	
		initgameRoundDisplay();
		initLandMarker();
		initPromptDialog();
		usingPlayer=0;
		isAI=[0,1,1,1];
		
		// assign postfix to computer name
		for(var i=0; i<4; i++){
			if(isAI[i]==1)
				gameSpritesName[i]+=" (COM)";
		}
		setInterval(playersStaticMovement,100);
		setInterval(gloop,1);
	}

	function Round(){
		
		if (isDialogOpen || isRandomEvent)
			return;

		if(noGameOver!=3){	
			if (playersMoney[roundNow] < 0 && isGameOver[roundNow]==0)
				gameOver(roundNow);
	
			while(isGameOver[roundNow]==1){
				roundNow++;
				roundNow%=4;
			}
			if(isJail[roundNow]==1){
				isJail[roundNow]=0;
				roundNow++;
				roundNow%=4;
				Round();
			}
			// Apply AI Contol
			console.log('roundNow', roundNow);
			if(isAI[roundNow]==1){
				RollDice(roundNow);
			}
		}
		else{
			StartGame=false;
			loadImage("images/characters_n.png", initWin);
		}
	}
	
	function playersStaticMovement()
	{	
		for(var i=0;i<4;i++){
			//gameSprites[i].aIndex=frameArray;
			if(playersState[i]==0){//noraml
				//playersStaticMovementIndex[i]=0;
				gameSprites[i].aCIndex=playersStaticMovementIndex[i];
				gameSpritesLogo[i].aCIndex=playersStaticMovementIndex[i];
				playersStaticMovementIndex[i]++;
				playersStaticMovementIndex[i]%=2;
			}
			else if(playersState[i]==1){//jail
				//playersStaticMovementIndex[i]=4;
				gameSprites[i].aCIndex=playersStaticMovementIndex[i];
				gameSpritesLogo[i].aCIndex=playersStaticMovementIndex[i];
				playersStaticMovementIndex[i]++;
				playersStaticMovementIndex[i]%=2;
				playersStaticMovementIndex[i]+=4;
			}
			else if(playersState[i]==2){//cry
				//playersStaticMovementIndex[i]=6;
				gameSprites[i].aCIndex=playersStaticMovementIndex[i];
				gameSpritesLogo[i].aCIndex=playersStaticMovementIndex[i];
				playersStaticMovementIndex[i]++;
				playersStaticMovementIndex[i]%=2;
				playersStaticMovementIndex[i]+=6;
			}
			else if(playersState[i]==3){//queen
				//playersStaticMovementIndex[i]=8;
				gameSprites[i].aCIndex=playersStaticMovementIndex[i];
				gameSpritesLogo[i].aCIndex=playersStaticMovementIndex[i];
				playersStaticMovementIndex[i]++;
				playersStaticMovementIndex[i]%=2;
				playersStaticMovementIndex[i]+=8;
			}
		}
	}
	
	function Move(user, step){
		var initx=gameSprites[user].pos.x;
		var inity=gameSprites[user].pos.y;
		var aRate=0.01;
		var frameArray2 = [2,3];
		var dx=0;
		var dy=0;
		var duration=0;
		var speed=8;
		
		var startx = 550;
		var starty = 610;

		var arealx = startx-5;
		var area1y = starty+RoadDistance-5;
		
		gameSprites[user].aCIndex=0;
		playersStaticMovementIndex[user]=0;
		playersState[user]=0;
		
		if(playersPosition[user]>=0 && playersPosition[user]<=10){
			var positionafterMove=playersPosition[user]+step;
			dx=Math.abs(initx-RoadDistance*step-initx);
			dy=Math.abs(area1y-inity);
			duration=Math.sqrt(dx*dx+dy*dy)*speed;
				
			if(initx>startx)
				initx=arealx;
			if(positionafterMove>10){
				var move1st=10-playersPosition[user];
				var movestep=positionafterMove-10;
				
				dx=Math.abs(initx-RoadDistance*move1st-initx);
				dy=Math.abs(area1y-inity);
				duration=Math.sqrt(dx*dx+dy*dy)*speed;
				
				gameSprites[user].amove(initx,inity,initx-RoadDistance*move1st,area1y,duration,function(){
					dx=Math.abs(initx-RoadDistance*move1st-RoadDistance-(initx-RoadDistance*move1st));
					dy=Math.abs(area1y-RoadDistance-RoadDistance*movestep-area1y);
					duration=Math.sqrt(dx*dx+dy*dy)*speed;
					gameSprites[user].amove(initx-RoadDistance*move1st,area1y,initx-RoadDistance*move1st-RoadDistance,area1y-RoadDistance-RoadDistance*movestep,duration,function(){endMove(user);},frameArray2,2,aRate);
				},frameArray2,2,aRate);
			}
			else{
				gameSprites[user].amove(initx,inity,initx-RoadDistance*step,area1y,duration,function(){endMove(user);},frameArray2,2,aRate);
			}
		}
		else if(playersPosition[user]>=11 && playersPosition[user]<=20){
			var positionafterMove=playersPosition[user]+step;
			dx=Math.abs(0);
			dy=Math.abs(inity-RoadDistance*step-inity);
			duration=Math.sqrt(dx*dx+dy*dy)*speed;
			
			if(positionafterMove>20){
				var move1st=20-playersPosition[user];
				var movestep=positionafterMove-20;
				
				dx=Math.abs(0);
				dy=Math.abs(inity-RoadDistance*move1st-inity);
				duration=Math.sqrt(dx*dx+dy*dy)*speed;
			
				gameSprites[user].amove(initx,inity,initx,inity-RoadDistance*move1st,duration,function(){
					dx=Math.abs(initx+RoadDistance+RoadDistance*movestep-initx);
					dy=Math.abs(inity-RoadDistance*move1st-RoadDistance-(inity-RoadDistance*move1st));
					duration=Math.sqrt(dx*dx+dy*dy)*speed;
					gameSprites[user].amove(initx,inity-RoadDistance*move1st,initx+RoadDistance+RoadDistance*movestep,inity-RoadDistance*move1st-RoadDistance,duration,function(){endMove(user);},frameArray2,2,aRate);
				},frameArray2,2,aRate);
			}
			else{
				gameSprites[user].amove(initx,inity,initx,inity-RoadDistance*step,duration,function(){endMove(user);},frameArray2,2,aRate);
			}
		}
		else if(playersPosition[user]>=21 && playersPosition[user]<=30){
			var positionafterMove=playersPosition[user]+step;
			dx=Math.abs(initx+RoadDistance*step-initx);
			dy=Math.abs(0);
			duration=Math.sqrt(dx*dx+dy*dy)*speed;
			
			if(positionafterMove>30){
				var move1st=30-playersPosition[user];
				var movestep=positionafterMove-30;
				dx=Math.abs(initx+RoadDistance*move1st-initx);
				dy=Math.abs(0);
				duration=Math.sqrt(dx*dx+dy*dy)*speed;
			
				gameSprites[user].amove(initx,inity,initx+RoadDistance*move1st,inity,duration,function(){
					dx=Math.abs(initx+RoadDistance*move1st-(initx+RoadDistance+RoadDistance*move1st));
					dy=Math.abs(inity+RoadDistance*movestep+RoadDistance-inity);
					duration=Math.sqrt(dx*dx+dy*dy)*speed;
					gameSprites[user].amove(initx+RoadDistance*move1st,inity,initx+RoadDistance+RoadDistance*move1st,inity+RoadDistance*movestep+RoadDistance,duration,function(){endMove(user);},frameArray2,2,aRate);
				},frameArray2,2,aRate);
			}
			else{
				gameSprites[user].amove(initx,inity,initx+RoadDistance*step,inity,duration,function(){endMove(user);},frameArray2,2,aRate);
			}
		}
		else if(playersPosition[user]>=31 && playersPosition[user]<=39){
			var positionafterMove=playersPosition[user]+step;
			dx=Math.abs(0);
			dy=Math.abs(inity+RoadDistance*step-inity);
			duration=Math.sqrt(dx*dx+dy*dy)*speed;
				
			if(positionafterMove>39){
				var move1st=40-playersPosition[user];
				var movestep=positionafterMove-40;
				dx=Math.abs(0);
				dy=Math.abs(inity+RoadDistance*move1st-inity);
				duration=Math.sqrt(dx*dx+dy*dy)*speed;
			
				gameSprites[user].amove(initx,inity,initx,inity+RoadDistance*move1st,duration,function(){
					dx=Math.abs(initx-RoadDistance-RoadDistance*movestep-initx);
					dy=Math.abs(inity+RoadDistance*move1st-(inity+RoadDistance*move1st+RoadDistance));
					duration=Math.sqrt(dx*dx+dy*dy)*speed;
					gameSprites[user].amove(initx,inity+RoadDistance*move1st,initx-RoadDistance-RoadDistance*movestep,inity+RoadDistance*move1st+RoadDistance,duration,function(){endMove(user);},frameArray2,2,aRate);
				},frameArray2,2,aRate);
			}
			else{
				gameSprites[user].amove(initx,inity,initx,inity+RoadDistance*step,duration,function(){endMove(user);},frameArray2,2,aRate);
			}
		}
		playersPosition[user]+=step;
		if(playersPosition[user]>39){
			playerMoneyControl(user,oneroundmoney);
			playersPosition[user]%=40;
		}
	}
	
	
	function endMove(user)
	{
		gameSprites[user].aIndex=frameArray;
		if (isRandomEvent == 1) {
			isRandomEvent = 0;
		}
		if (!isDialogOpen && isRandomEvent==0){
			$('#currentUser').val(user);
			var boardIndex = playersPosition[user];
			endMoveDoAction(user, boardIndex);
		}
	}
	
	function endMoveDoAction(user, boardIndex){
		var landType = boardroad[boardIndex];
		handleUserLanding(user, boardIndex, landType, isAI[user]);
		
		// Proceed to next round
		roundNow = (roundNow+1)%4;
		Round();
	}
	
	function gloop(){
		var d=new Date();
		var t=d.getTime();
		if(StartGame){
			for(var i=0;i<4;i++){
				gameSprites[i].step(t);	
			}
			
			gamedice.step(t);
		}
		else{
			for(var i=0;i<4;i++){
				gameBigSprites[i].step(t);	
			}
		}
		paint();
	}
	
	function paint(){
		if(StartGame){
			systemData.ctx.clearRect(0,0,ScreenWidth,ScreenHeight);
	    	//systemData.ctx.fillRect(0,0,ScreenWidth,ScreenHeight);
	    	for(var i=0; i<gameSpritesMark.length;i++){
	    		if(gameSpritesMark[i]!=null)
					gameSpritesMark[i].draw(systemData.ctx);
			}
			for(var i=0; i<gameBuildings.length;i++){
				if(gameBuildings[i]!=null)
					gameBuildings[i].draw(systemData.ctx);
			}
			for(var i=0; i<gameSprites.length; i++){
				gameSprites[i].draw(systemData.ctx);
				gameSpritesLogo[i].draw(systemData.ctx);
			}
			displayPlayersMoneyAndName();
			
			gamedice.draw(systemData.ctx);
			gameRoundDisplay[roundNow].draw(systemData.ctx);	
		}
		else{
			Winpaint();
		}
	}		
	function mouseDownHandler(e){
		console.log('Mouse click at (x, y): (' + e.clientX + ', ' + e.clientY +')');
		var winWidth=$(window).width();
		var mx=e.clientX - winWidth/2+650/2;
		var my=e.clientY;
		
		if(roundNow==usingPlayer && StartGame){
			var dicex=100;
			var dicey=100;
			var diceposx=270;
			var diceposy=475-$('body').scrollTop();
			if(mx>=diceposx && mx<=diceposx+dicex && my>=diceposy && my<=diceposy+dicey){
				RollDice(usingPlayer);

			}
		}
		if(!StartGame){
			var startwidth=120;
		  	var startheight=42;
			var startposx=265;
			var startposy=620-$('body').scrollTop();
			
			if(mx>=startposx && mx<=startposx+startwidth && my>=startposy && my<=startposy+startheight){
				var sourcess = {
					board: "images/board.png",
					frame: "images/frame.png"
				};
				SetupBackground(sourcess, startGame);
				loadImage("images/characters.png", init);
				$( "#display" ).css( "z-index", "-3" );
				console.log('GameStarts');
				
			}
		}
	}
	function keyPressHandler(e){
		var keyCode = e.keyCode;
		var keyboard = {
			'R' : 114
		}
		if (roundNow==usingPlayer && StartGame && keyboard.R === keyCode){
			RollDice(usingPlayer);
		}
	}
	
	
	
	
	
	
	
	
	
	
