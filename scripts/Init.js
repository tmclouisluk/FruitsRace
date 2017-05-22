    function createPlayersIconObject(user){
        var width=50;
        var height=50;
        var posx=0;
        var posy=241;
        
        var PlayersIconObject=new ASObject();
		PlayersIconObject.pos.w=width;
		PlayersIconObject.pos.h=height;
		PlayersIconObject.addImage(new Rect(posx+width*user,posy,width,height));
		return PlayersIconObject;
    }
    
    //level 0=pill, 1=2 pills, 2=bottle
    function createBuildingObject(level){
        var width=50;
        var height=30;
        var posx=0;
        var posy=290;
        
        var BuildingObject=new ASObject();
		BuildingObject.pos.w=width;
		BuildingObject.pos.h=height;
		BuildingObject.addImage(new Rect(posx+width*level,posy,width,height));
		return BuildingObject;
    }
    
    function initgameRoundDisplay(){
    	var framewidth=325;
		var frameheight=70;
		var boardheight=650;
		var width=50;
		var height=50;
		for (var player=0;player<4;++player){
			sprite=createPlayersIconObject(player);
			if (player == 0) {
				sprite.pos.x=framewidth-width;
				sprite.pos.y=10;
			} else if (player == 1) {
				sprite.pos.x=framewidth-width+framewidth;
				sprite.pos.y=10;
			} else if (player == 2) {
				sprite.pos.x=framewidth-width;
				sprite.pos.y=10+boardheight+frameheight;
			} else {
				sprite.pos.x=framewidth-width+framewidth;
				sprite.pos.y=10+boardheight+frameheight;
			}
			gameRoundDisplay[player] = sprite;
		}
    }
    
	function initDice(){
		var x=100;
		var y=100;
		var posx=270;
		var posy=475;
		var diceframe=[0,1,2,3,4,5];
		sprite=new ASObject();
		sprite.pos.x=posx;
		sprite.pos.y=posy;
		sprite.pos.w=x;
		sprite.pos.h=y;
		sprite.aFrame=diceframe;
		for (var i=0;i<6;i++)
			sprite.addImage(new Rect(i*x,320,x,y));
		
		gamedice=sprite;
		
	}
	
	function initplayers(){
		var startx = 550;
		var starty = 610;
		for (var player=0;player<4;++player){
			sprite=new ASObject();
			if (player == 0) {
				sprite.pos.x=startx-5;
				sprite.pos.y=starty-5;
			} else if (player == 1) {
				sprite.pos.x=startx+RoadDistance-5;
				sprite.pos.y=starty-5;
			} else if (player == 2) {
				sprite.pos.x=startx-5;
				sprite.pos.y=starty+RoadDistance-5;
			} else {
				sprite.pos.x=startx+RoadDistance-5;
				sprite.pos.y=starty+RoadDistance-5;
			}
			sprite.pos.w=SpriteWidth;
			sprite.pos.h=SpriteHeight;
			sprite.dx=2;
			sprite.dy=2;
			sprite.aFrame=frameArray;
			for (var i=0;i<10;i++)
				sprite.addImage(new Rect(i*ImageWidth,player*SpriteWidth,ImageWidth,ImageHeight));
			gameSprites[player] = sprite;
		}
	}
	
	function initBigplayers(){
		var startx = 85;
		var starty = 240;
		var BigSpriteWidth=120;
		var BigSpriteHeight=120;
		for (var player=0;player<4;++player){
			sprite=new ASObject();
			sprite.pos.y=starty;
			sprite.pos.x=startx+player*BigSpriteWidth;

			sprite.pos.w=BigSpriteWidth;
			sprite.pos.h=BigSpriteHeight;
			sprite.dx=2;
			sprite.dy=2;
			sprite.aFrame=frameArray;
			for (var i=0;i<10;i++)
				sprite.addImage(new Rect(i*BigSpriteWidth,player*BigSpriteWidth,BigSpriteWidth,BigSpriteHeight));
			gameBigSprites[player] = sprite;
		}
	}
	
	function initWin(){
		//systemData.ctx.clearRect(0,0,ScreenWidth,ScreenHeight);
		StartGame=false;
		initBigplayers();
		
		setInterval(initWinplayersStaticMovement,100);
		//setInterval(Wingloop,1);
	}
	
	function initWinplayersStaticMovement()
	{	
		for(var i=0;i<4;i++){
			if(isGameOver[i]==1){//cry
				//playersStaticMovementIndex[i]=6;
				gameBigSprites[i].aCIndex=WinplayersStaticMovementIndex[i];
				WinplayersStaticMovementIndex[i]++;
				WinplayersStaticMovementIndex[i]%=2;
				WinplayersStaticMovementIndex[i]+=6;
			}
			else{//queen
				//playersStaticMovementIndex[i]=8;
				gameBigSprites[i].aCIndex=WinplayersStaticMovementIndex[i];
				WinplayersStaticMovementIndex[i]++;
				WinplayersStaticMovementIndex[i]%=2;
				WinplayersStaticMovementIndex[i]+=8;
			}
		}
	}
	
	function Winpaint(){
		systemData.ctx.clearRect(0,0,ScreenWidth,ScreenHeight);
    	//systemData.ctx.fillRect(0,0,ScreenWidth,ScreenHeight);
    	systemData.ctx.fillStyle = "#F2B1B7";
      	systemData.ctx.fillRect(0,0,ScreenWidth,ScreenHeight);
    	for(var i=0; i<gameBigSprites.length;i++){
			gameBigSprites[i].draw(systemData.ctx);
		}
		var whoWin=0;
		for(var i=0;i<4;i++){
			if(isGameOver[i]==0)
				whoWin=i;
		}
		//console.log(whoWin);
		var strings = "" + gameSpritesName[whoWin] + " Win!"
		//console.log(strings);
		var x =175;
		var y =520;
		systemData.ctx.fillStyle = "#000000";
		systemData.ctx.font = "35px Arial";
    	systemData.ctx.fillText(strings, x, y);
    
	}
	
	function initplayersLogo(){
		var framex=0;
		var framey=0;
		var framewidth=325;
		var frameheight=70;
		var boardheight=650;
		var border=5;
		
		for (var player=0;player<4;++player){
			sprite=new ASObject();
			if (player == 0){
				sprite.pos.x=framex+border;
				sprite.pos.y=framey+border;
			}else if(player==1){
				sprite.pos.x=framex+border+framewidth;
				sprite.pos.y=framey+border;
			}else if(player==2){
				sprite.pos.x=framex+border;
				sprite.pos.y=framey+border+boardheight+frameheight;
			}else{
				sprite.pos.x=framex+border+framewidth;
				sprite.pos.y=framey+border+boardheight+frameheight;
			}
			sprite.pos.w=SpriteWidth;
			sprite.pos.h=SpriteHeight;
			sprite.aFrame=frameArray;
			for (var i=0;i<10;i++)
				sprite.addImage(new Rect(i*ImageWidth,SpriteWidth*player,ImageWidth,ImageHeight));
			gameSpritesLogo[player] = sprite;
		}

	}
	
	function initLandMarker(){
		for(var i=0;i<40;++i){
			if (boardroad[i]==0 || boardroad[i]==8){
				land.marker[i]=0;
			}else{
				land.marker[i]=-1;
			}
		}
	}