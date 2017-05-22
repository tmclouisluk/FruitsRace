	/*
	A Game Engine Written for CS4386 - Joe Yuen

	*/

	function SystemSetup(canvasID,audioID,paint,mouseHandler,keyHandler){
		systemData=new SystemData(paint,mouseHandler,keyHandler);
		systemData.canvas=document.getElementById(canvasID);
		if (systemData.canvas==null){
			alert("Canvas not found");
			return;
		}
		systemData.canvas.addEventListener('mousedown',mouseHandler,false);
		window.addEventListener('keypress',keyPressHandler,false);
		if (audioID!=null){
			//alert("load Audio");
			systemData.audio=document.getElementById(audioID);
		}
		systemData.ctx=systemData.canvas.getContext && systemData.canvas.getContext('2d');
		if (systemData.ctx){

		}
	}
	function SystemData(canvas,paint,mouseHandler,keyHandler){
		this.canvas=null;
		this.audio=null;
		this.paint=paint;
		this.mHandler=mouseHandler;
		this.kHandler=keyHandler;
		this.gameImage=null;
		this.ctx=null;

	}

	function Rect(x,y,w,h){
		this.x=x;
		this.y=y;
		this.w=w;
		this.h=h;
	}
	function ASObject(){
		this.pos=new Rect(0,0,0,0);		//the position and dimension of the sprite
		this.aFrames=new Array();		//array of image frames used in this sprite
		this.sx=0;						//start (x,y) of animation
		this.sy=0;
		this.ex=0;						//ending (x,y) of animation
		this.ey=0;
		this.aSTime=0;					//starting time of animation
		this.aETime=0;					//ending time of animation
		this.inAnimation=false;			//flag indicates the animation is active or not.  
		this.aIndex=new Array();		//Array holding the aFrames index for image animation
		this.aCIndex=0;					//current Index for image animation
		this.frameRate=5.0;				//frame rate of image animation
		this.frameCount=0;				//total number of frame in aFrames array
		this.aIndexCount=0;				
		this.aCallback=null;
		this.step=function(cTime){
			// cTime in milliseconds

			var newX,newY;
			var finish=false;
			if (!this.inAnimation)
				return;
			if (cTime>=this.aETime){
				cTime=this.aETime;
				finish=true;
			}
			var age=cTime-this.aSTime;
			var aFactor=(age)/(this.aETime-this.aSTime);
			
			newX=this.sx+(this.ex-this.sx)*aFactor;
			newY=this.sy+(this.ey-this.sy)*aFactor;
			this.pos.x=newX|0;
			this.pos.y=newY|0;
			//console.log("aCIndex:"+this.aCIndex+" age:"+age+" frameRate:"+this.frameRate);
			if (this.aIndexCount>0){
				//this.aCIndex++;
				this.aCIndex=(this.frameRate*age)|0;
				this.aCIndex%=this.aIndexCount;
			}
			//console.log("aCIndex:"+this.aCIndex+" age:"+age+" frameRate:"+this.frameRate);

			if (finish){
				this.endAnimate(cTime);
			}
		}
		this.startAnimate=function(cTime){
			this.inAnimation=true;
		}
		this.endAnimate=function(cTime){
			this.inAnimation=false;
			if (this.aCallback!=null)
				this.aCallback();
		}
		this.draw=function(graphics){
			//console.log("sprite draw");
			var currentIndex;
			if (this.aIndexCount>0)			
				currentIndex=this.aIndex[this.aCIndex]; //retrieve the frameIndex from aIndex array
			else
				currentIndex=this.aCIndex;				//if aIndex not set, use the aCIndex directl

			var r=this.aFrames[currentIndex];
			//console.log(r);
			//console.log(this.pos);
			//console.log(systemData.gameImage);
			graphics.drawImage(systemData.gameImage,r.x,r.y,r.w,r.h,this.pos.x,this.pos.y,this.pos.w,this.pos.h);
		}
		this.addImage=function(r){
			this.aFrames[this.frameCount]=r;
			this.frameCount++;

		}
		this.move=function(sx,sy,ex,ey,duration,callback){
			this.sx=sx;
			this.sy=sy;
			this.ex=ex;
			this.ey=ey;
			var d=new Date();
			var t=d.getTime();
			this.aSTime=t;
			this.aETime=t+duration;
			this.startAnimate(t);
			this.aCallback=callback;

		}
		this.amove=function(sx,sy,ex,ey,duration,callback,frameList,frameCount,fr){
			this.sx=sx;
			this.sy=sy;
			this.ex=ex;
			this.ey=ey;
			var d=new Date();
			var t=d.getTime();
			this.aSTime=t;
			this.aETime=t+duration;
			this.aIndex=frameList;
			this.aIndexCount=frameCount;
			this.frameRate=fr;
			this.startAnimate(t);
			this.aCallback=callback;

		}
	

	}
	function loadImage(imgSheet,imgCallback){

		systemData.gameImage=new Image();
		systemData.gameImage.src=imgSheet;
		systemData.gameImage.onload=imgCallback;
	}

	function loadAudio(audioCallback){
		
		aCallback=function(){
			audioReady(audioCallback);
		}
		systemData.audio.addEventListener('canplaythrough',aCallback,false);
	
	
  	}
  	function audioReady(audioCallback){
  		systemData.audio.removeEventListener('canplaythrough',aCallback);
  		audioCallback();
  	}
	function playAudio(start,end){
  	//function play(start,end){
  	
  		
		
		//start and end in sec.
		systemData.audio.currentTime=start;
		systemData.audio.play();
		
		setTimeout(function(){
			pause();
		},(end-start)*1000);
		
  	}
  	function pause(){
		systemData.audio.pause();
  	}



	
	function aLoop(){
		var d=new Date();
		t=d.getTime();
		sprite.step(t);
		paint();
		setTimeout(aLoop,1);

	}

