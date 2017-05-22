
	function SetupBackground(sources, callback){
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for(var src in sources) {
          numImages++;
        }
        for(var src in sources) {
          images[src] = new Image();
          images[src].onload = function() {
            if(++loadedImages >= numImages) {
              callback(images);
            }
          };
          images[src].src = sources[src];
        }
	}
	
	function DrawBackground(img){
	  
		var canvas = document.getElementById('display');
		var context = canvas.getContext('2d');

		  var queenwidth=160;
		  var queenheight=100;
		  var titlewidth=450;
		  var titleheight=125;
		  var startwidth=120;
		  var startheight=42;
		  
		  canvas.addEventListener('mousedown',mouseDownHandler,false);
		  context.fillStyle = "#F2B1B7";
      context.fillRect(0,0,ScreenWidth,ScreenHeight);
      context.drawImage(img.title, 100, 80, titlewidth, titleheight);
      context.drawImage(img.queen, 250, 420, queenwidth, queenheight);
      context.drawImage(img.start, 265, 620, startwidth, startheight);
	
	}
	
	function startGame(img)
	{
	  var startdisplay = document.getElementById('background');
		var startdisplaycontext = startdisplay.getContext('2d');
		startdisplaycontext.clearRect(0,0,ScreenWidth,ScreenHeight);
	  var canvas = document.getElementById('background');
		var context = canvas.getContext('2d');
  		var framewidth = 325;
  		var frameheight = 70;
  		var boardwidth = 650;
  		var boardheight = 650;
  		context.drawImage(img.board, 0, 70, boardwidth, boardheight);
      context.drawImage(img.frame, 0, 0, framewidth, frameheight);
  		context.drawImage(img.frame, framewidth, 0, framewidth, frameheight);
  		context.drawImage(img.frame, 0, frameheight+boardheight, framewidth, frameheight);
  		context.drawImage(img.frame, framewidth, frameheight+boardheight, framewidth, frameheight);
  		StartGame=true;
  		
	}
	
	