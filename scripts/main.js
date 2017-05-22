	SpriteWidth=60;
	SpriteHeight=60;
	ScreenWidth=650;
	ScreenHeight=790;
	ImageWidth=60;
	ImageHeight=60;

	pathIndex=0;
	playersStaticMovementIndex=0;
	frameArray=[0,1,2,3,4,5,6,7,8,9];
	gameSprites=new Array();
	
	//0=land, 1=owned, 2=chancecard, 3=chest, 4=badevent, 5=start, 6=jail, 7=hightea, 8=special land
	boardroad = [
		5,0,3,0,4,8,0,2,0,0,6,
		0,4,0,0,8,0,3,0,0,7,
		0,2,0,0,8,0,0,4,0,6,
		0,0,3,0,8,2,0,4,0
		];
	
	playersPosition=[0,0,0,0];
	usingPlayer=null;
	totalroad=40;
	RoadDistance=50;
	round=0;
	
	function initplayers(){	
		sprite=new ASObject();
		sprite.pos.x=540;
		sprite.pos.y=600;
		sprite.pos.w=SpriteWidth;
		sprite.pos.h=SpriteHeight;
		sprite.dx=2;
		sprite.dy=2;
		sprite.aFrame=frameArray;
		for (var i=0;i<10;i++)
			sprite.addImage(new Rect(i*ImageWidth,0,ImageWidth,ImageHeight));
		
		gameSprites[0] = sprite;
		
		sprite=new ASObject();
		sprite.pos.x=590;
		sprite.pos.y=650;
		sprite.pos.w=SpriteWidth;
		sprite.pos.h=SpriteHeight;
		sprite.dx=2;
		sprite.dy=2;
		sprite.aFrame=frameArray;
		for (var i=0;i<10;i++)
			sprite.addImage(new Rect(i*ImageWidth,60,ImageWidth,ImageHeight));
		
		gameSprites[1] = sprite;
		
		sprite=new ASObject();
		sprite.pos.x=590;
		sprite.pos.y=600;
		sprite.pos.w=SpriteWidth;
		sprite.pos.h=SpriteHeight;
		sprite.dx=2;
		sprite.dy=2;
		sprite.aFrame=frameArray;
		for (var i=0;i<10;i++)
			sprite.addImage(new Rect(i*ImageWidth,60*2,ImageWidth,ImageHeight));
		
		gameSprites[2] = sprite;
		
		sprite=new ASObject();
		sprite.pos.x=540;
		sprite.pos.y=650;
		sprite.pos.w=SpriteWidth;
		sprite.pos.h=SpriteHeight;
		sprite.dx=2;
		sprite.dy=2;
		sprite.aFrame=frameArray;
		for (var i=0;i<10;i++)
			sprite.addImage(new Rect(i*ImageWidth,60*3,ImageWidth,ImageHeight));
		
		gameSprites[3] = sprite;
	}
	
	function init(){
		initplayers();
		
		usingPlayer=0;
		pathIndex=3;
		//nextPath();
		setInterval(playersStaticMovement,100);
		setInterval(gloop,1);
	}

	function playersStaticMovement()
	{	
		for(var i=0;i<4;i++){
			//gameSprites[i].aIndex=frameArray;
			gameSprites[i].aCIndex=playersStaticMovementIndex;
		}
		playersStaticMovementIndex++;
		playersStaticMovementIndex%=2;
		
	}
	
	function RollDice(user){
		var step=Math.round(Math.random()*5+1);
		Move(user, step);
		playersPosition[user]+=step;
	}
	
	function Move(user, step){
		var initx=gameSprites[user].pos.x;
		var inity=gameSprites[user].pos.y;
		var aRate=0.01;
		var frameArray2 = [2,3]
		
		gameSprites[user].amove(initx,inity,initx-RoadDistance*step,inity,2000,function(){gameSprites[user].aIndex=frameArray;},frameArray2,2,aRate);
	}
	function nextPath(){
		var x1=0;
		var y1=70;
		var x2=590;
		var y2=650;
		var aRate=0.01;
		var frameArray2 = [2,3]
		switch(pathIndex){
			case 0:
				gameSprites[0].amove(x2,y1,x2,y2,2000,nextPath,frameArray2,2,aRate);
			break;
			case 1:
				gameSprites[0].amove(x2,y2,x1,y2,2000,nextPath,frameArray2,2,aRate);
			break;
			case 2:
				gameSprites[0].amove(x1,y2,x1,y1,2000,nextPath,frameArray2,2,aRate);
			break;
			case 3:
				gameSprites[0].amove(x1,y1,x2,y1,2000,nextPath,frameArray2,2,aRate);
			break;
		}
		pathIndex++;
		pathIndex%=4;
		

	}
	function gloop(){
		var d=new Date();
		var t=d.getTime();
		gameSprites[0].step(t);
		paint();
	}
	function paint(){
		systemData.ctx.clearRect(0,0,ScreenWidth,ScreenHeight);
    	//systemData.ctx.fillRect(0,0,ScreenWidth,ScreenHeight);
		for(var i=0; i<gameSprites.length; i++){
			gameSprites[i].draw(systemData.ctx);
		}

					
	}		
	function mouseDownHandler(){

	}
	function keyPressHandler(){

	}
