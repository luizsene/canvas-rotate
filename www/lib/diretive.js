(function () {
	angular.module('br.com.canvas-rotate', [])
	.directive('canvasRotate', ['$timeout','$window', function($timeout,$window){

		var _link = function (scope, elem, attrs) {

			// Element selector wrapper
			var _$ = function (elemFind) {
				return angular.element(document.querySelector(elemFind));
			};

			var _canvas = _$("#canvas-rotate");
			var _ctx = _canvas[0].getContext('2d');
			var _height;
			var _width;

			var _image = new Image();
			_image.src = 'img/mh3yxiJ.jpg';
			_image.onload = function () {
				_height = _image.naturalHeight;
				_width = _image.naturalWidth;
			}

			var _drawImage = function(){
				
				_canvas[0].height = parseInt(_height/3);
				_canvas[0].width = parseInt(_width/3);
				
				_ctx.drawImage(_image, 0,0);

				var imgData = _canvas[0].toDataURL();
				//_image.src = imgData;
				elem.css("background-image", "url("+ imgData +")");
			}

			//console.log(_canvas,'\n',_height,'\n',_width,'\n',_ctx);


			_$("#rotate-90-right").on('click', function (e) {
				console.info(e);
				_ctx.rotate(0.5 * Math.PI);
                _ctx.translate(0, -_height);
                _drawImage();
			});

			_$("#rotate-90-left").on('click', function (e) {
				console.warn(e);
				_ctx.rotate(-0.5 * Math.PI);
                _ctx.translate(-_width, 0);
                _drawImage();
			});


		}

		return{
			strict: 'A',
			link: _link,
			scope: true
		}
	}
	]);
})()