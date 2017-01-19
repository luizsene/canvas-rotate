(function () {
	angular.module('br.com.canvas-rotate', [])
	.directive('canvasRotate', ['$timeout','$ionicGesture', '$ionicScrollDelegate', function($timeout, $ionicGesture, $ionicScrollDelegate){

		var _link = function (scope, elem, attrs) {

				var RADIANS = Math.PI/180; 	
				var ANGULO = 90;	
				var counter = 90;

				//Horizontal
				var X = 0;
			    var x1 = 0;
			    var x0 = 0;
			    var x2 = 0;

			    // Vertical
			    var Y = 0;
			    var y1 = 0;
			    var y0 = 0;
			    var y2 = 0;


			    var initVars = function () {
			    	X = imageWrapper.naturalWidth;
				    x1 = window.outerWidth;
				    x0 = (X - x1)/2;
				    x2 = (X - x1)/2;

				    Y = imageWrapper.naturalHeight;
				    y1 = window.outerHeight;
				    y0 = (Y - y1)/2;
				    y2 = (Y - y1)/2;
			    }


			    var calcAngular = function () {
			    	var deg = Math.abs(counter) % 180;
					var arc = (deg > 90 ? 180 - deg : deg) * Math.PI / 180;
					var sinArc = Math.sin(arc);
					var cosArc = Math.cos(arc);
					var width = X;
					var height = Y;
					X = width * cosArc + height * sinArc;
					Y = width * sinArc + height * cosArc;

					x1 = window.outerWidth;
				    x0 = (X - x1)/2;
				    x2 = (X - x1)/2;

				    y1 = window.outerHeight;
				    y0 = (Y - y1)/2;
				    y2 = (Y - y1)/2;
			    }

			    var imageWrapper = new Image();
			    imageWrapper.src = 'img/mh3yxiJ.jpg';
			    imageWrapper.onload = initVars;

				var canvas = document.createElement('canvas'); 
				canvas.width = window.outerWidth; 
				canvas.height = window.outerHeight; 
			    var context = canvas.getContext('2d');

			    var positionX = (canvas.width/2);
			    var positionY = (canvas.height/2);

			    document.getElementById("canvas-rotate").appendChild(canvas);

			    function seletor(seletor) {
			    	return angular.element(document.querySelector(seletor));
			    }

			    seletor("#rotate-left").on('click', function (e) {
			    	rotate(0);
			    });

			    seletor("#rotate-right").on('click', function (e) {
			    	rotate(1);
			    });


			    /* event  scroll left on block */
                $ionicGesture.on('dragleft', function (e) { 
                   
                    x0 = positionX - (x1/2);
			    	x2 = positionX + (x1/2);

			    	if((x0+x2) >= (-X + (x1*2))){
						positionX -= 3;
						context.clearRect(0,0,canvas.width, canvas.height);
						drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
					}else{
						console.log("TRAVOU");
					}

                }, elem);

                /* event scroll right on block */
                $ionicGesture.on('dragright', function (e) {

                	x0 = positionX - (x1/2);
			    	x2 = positionX + (x1/2);

			    	if((x0+x2) <= X){
						positionX += 3;
						context.clearRect(0,0,canvas.width, canvas.height);
						drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
					}else{
						console.log("TRAVOU");
					}

                }, elem);


                /* event  scroll up on block */
                $ionicGesture.on('dragup', function (e) {
                    context.clearRect(0,0,canvas.width, canvas.height); 
                    positionY -= 3;
                    drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
                }, elem);

                /* event scroll down on block */
                $ionicGesture.on('dragdown', function (e) {
                	context.clearRect(0,0,canvas.width, canvas.height); 
                	positionY += 3;
                	drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
                }, elem);


			   function init(){
			  	 rotate(0);
			   }

			   function rotate(rigth) { 
			     context.clearRect(0,0,canvas.width, canvas.height); 

			     if(rigth){
			     	drawRotatedImage(imageWrapper, positionX, positionY, counter+ANGULO); 
			     	counter+=ANGULO;
			     	console.log("Angulo: ", counter);
			     }else{
			     	drawRotatedImage(imageWrapper, positionX, positionY, counter-ANGULO); 
			     	counter-=ANGULO;
			     	console.log("Angulo: ", counter);

			     } 
			     calcAngular();
			   }
			  
			  
			   function drawRotatedImage(image, x, y, angle) { 
			    context.save(); 
			    context.translate(x, y);
			    context.rotate(angle * RADIANS);
			    context.drawImage(image, -(image.width/2), -(image.height/2));
			    context.restore(); 
			   }

			   init();
		}

		return{
			strict: 'A',
			link: _link,
			scope: true
		}
	}
	]);
})()