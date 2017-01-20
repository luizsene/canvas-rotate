/**
 * @ngdoc overview
 * @name br.com.canvasRotate:canvasRotate
 * @author Fábio Pereira <fabio.pereira.gti@gmail.com>
 * @version 0.0.1
 * @description
 * Os serviço presentes em **`br.com.canvasRotate`**  são responsáveis por gerir a manipulação de imagens dentro do canvas
 *
 *
 *
 *
 *
 * @ngdoc directive
 * @name br.com.canvasRotate:canvasRotate
 * @author Fábio Pereira <fabio.pereira.gti@gmail.com>
 * @restrict A
 * @scope
 * @element any
 * @requires $ionicGesture
 * @description
 * Diretiva que fornece a possibilidade de rotacionar imagens para edição
 */
(function () {
  angular.module('br.com.canvasRotate', [])

    .run(['$templateCache', function ($temaplateCache) {

      var canvasRotateSalvar = ".canvas-rotate-salvar {" +
          "color: #fff !important;" +
          " border: 2px solid;" +
          " padding: 6px 20px;" +
          " position: fixed;" +
          " border-radius: 50px;" +
          " left: calc(50% - 41px);" +
          " background-color: rgba(255,255,255,.4);" +
        "}";

      var canvasRotateLeft = ".canvas-rotate-left {" +
          "color: #fff !important;" +
          "transform: scale(-1,1) !important;" +
        "}";

      var canvasRotateRight = ".canvas-rotate-right{" +
          "color: #fff !important;" +
          "right: 0;" +
          " position: fixed;" +
        "}";

      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = canvasRotateSalvar + canvasRotateLeft + canvasRotateRight;
      document.getElementsByTagName('head')[0].appendChild(style);

      var template = '<section style="position: absolute; bottom: 0;">' +
                        '<div>' +
                          '<a class="canvas-rotate-left button button-icon icon ion-refresh" id="rotate-left"></a>' +
                          '<a class="canvas-rotate-salvar">Salvar</a>' +
                          '<a class="canvas-rotate-right button button-icon icon ion-refresh" id="rotate-right"></a>' +
                        '</div>' +
                      '</section>';

      $temaplateCache.put('canvasRotateTemplate', template);
    }])

    .directive('canvasRotate',
      ['$ionicGesture',function($ionicGesture){

        //noinspection JSUnusedLocalSymbols
          var _link = function (scope, elem, attrs) {

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#RADIANS
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Radiano do arco
             */
            var RADIANS = Math.PI/180;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#ANGULO
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Ângulo de rotação
             */
            var ANGULO = 90;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#counter
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Contador do ângulo atual
             */
            var counter = 90;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#obj
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Objeto de configuração da directiva
             */
            var obj;

            /* ==================== Horizontal ================ */

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#X
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Largura total da imagem
             */
            var X = 0;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#x1
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Tamanho da caixa de exibição
             */
            var x1 = 0;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#x0
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Tamanho do lado esquerdo da imagem que não está contido dentro da caixa de exibição
             */
            var x0 = 0;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#x2
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Tamanho do lado direito da imagem que não está contido dentro da caixa de exibição
             */
            var x2 = 0;

            /* ==================== Vertical ================ */

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#Y
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Altura total da imagem
             */
            var Y = 0;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#y1
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Altura da caixa de exibição
             */
            var y1 = 0;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#y0
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Tamanho na parte superior da imagem que não está contido dentro da caixa de exibição
             */
            var y0 = 0;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#y2
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Tamanho na parte inferior da imagem que não está contido dentro da caixa de exibição
             */
            var y2 = 0;


            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc method
             * @name br.com.canvasRotate:canvasRotate#coords
             * @methodOf br.com.canvasRotate:canvasRotate
             * @description
             * Retorna um objeto contendo todas as coordenadas de uma imagem
             * <pre>
               options: {
                  X:1800,
                  x0:-91,
                  x1:660,
                  x2:569,
                  Y:2880,
                  y0:-333,
                  y1:412,
                  y2:79,
                  positionY:-144,
                  positionX:242,
                  angle:90,
                  url:"http://localhost:8100/img/mh3yxiJ.jpg"
                }
             * </pre>
             * @return {Object} coordenadas - Coordenadas da imagem
             */
            var coords = function () {
              return {
                X: X,
                x0: x0,
                x1: x1,
                x2: x2,
                Y: Y,
                y0: y0,
                y1: y1,
                y2: y2,
                positionY: positionY,
                positionX: positionX,
                angle: counter,
                url: imageWrapper.src
              }
            };

            /**
             * @ngdoc method
             * @name br.com.canvasRotate:canvasRotate#initVars
             * @methodOf br.com.canvasRotate:canvasRotate
             * @description
             * Função que inicializa a directiva após a imagem ser carregada
             */
            var initVars = function () {
              X  = obj.X  || imageWrapper.naturalWidth;
              x1 = obj.x1 || window.outerWidth;
              x0 = obj.x0 || (X - x1)/2;
              x2 = obj.x2 || (X - x1)/2;

              Y  = obj.Y  || imageWrapper.naturalHeight;
              y1 = obj.y1 || window.outerHeight;
              y0 = obj.y0 || (Y - y1)/2;
              y2 = obj.y2 || (Y - y1)/2;

              positionX = obj.positionX || (window.outerWidth/2);
              positionY = obj.positionY || (window.outerHeight/2);

              counter = obj.angle || 0;
              drawRotatedImage(imageWrapper, positionX, positionY, counter);
            };


            /**
             * @ngdoc method
             * @name br.com.canvasRotate:canvasRotate#calcAngular
             * @methodOf br.com.canvasRotate:canvasRotate
             * @description
             * Função disparada quando uma rotação é detectada na imagem
             */
            var calcAngular = function () {
              var tempY = Y;
              var tempY0 = y0;
              var tempY1 = y1;
              var tempY2 = y2;
              //noinspection JSSuspiciousNameCombination
              Y = X;
              //noinspection JSSuspiciousNameCombination
              y0 = x0;
              //noinspection JSSuspiciousNameCombination
              y1 = x1;
              //noinspection JSSuspiciousNameCombination
              y2 = x2;
              //noinspection JSSuspiciousNameCombination
              X = tempY;
              //noinspection JSSuspiciousNameCombination
              x0 = tempY0;
              //noinspection JSSuspiciousNameCombination
              x1 = tempY1;
              //noinspection JSSuspiciousNameCombination
              x2 = tempY2;
              positionX = (canvas.width/2);
              positionY = (canvas.height/2);
              drawRotatedImage(imageWrapper, positionX, positionY, counter);
            };

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#imageWrapper
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Wrapper para imagem que será carregada
             */
            var imageWrapper = new Image();

            // Chama a função initVars como callback
            imageWrapper.onload = initVars;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#canvas
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Instância do canvas onde a imagem sera escrita e manipulada
             */
            var canvas = document.createElement('canvas');

            // Configura as dimensões do canvas
            canvas.width = window.outerWidth;
            canvas.height = window.outerHeight;

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#context
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Pega o contexto do canvas para a manipulação
             */
            var context = canvas.getContext('2d');

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#positionX
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Ponto central da imagem em relação ao eixo das Abscissas
             */
            var positionX = (canvas.width/2);

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#positionY
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Ponto central da imagem em relação ao eixo das Ordenadas
             */
            var positionY = (canvas.height/2);

            //Ecreve o canvas na tela
            elem.append(canvas);

            /**
             * @ngdoc property
             * @name br.com.canvasRotate:canvasRotate#seletor
             * @param {String} seletor - Seletor HTML (`.class-name`, `#element-id`)
             * @propertyOf br.com.canvasRotate:canvasRotate
             * @description
             * Função que auxilia a seleção de elementos HTML
             * @return {Object} elem - Elemento HTML
             */
            function seletor(seletor) {
              return angular.element(document.querySelector(seletor));
            }

            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc event
             * @name br.com.canvasRotate:canvasRotate#rotate-left
             * @param {Object} e - Evento do click
             * @eventOf br.com.canvasRotate:canvasRotate
             * @description
             * Detecta o click no botão de rotação para esquerda
             */
            seletor("#rotate-left").on('click', function (e) {
              rotate(false);
            });

            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc event
             * @name br.com.canvasRotate:canvasRotate#rotate-right
             * @param {Object} e - Evento do click
             * @eventOf br.com.canvasRotate:canvasRotate
             * @description
             * Detecta o click no botão de rotação para direita
             */
            seletor("#rotate-right").on('click', function (e) {
              rotate(true);
            });

            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc event
             * @name br.com.canvasRotate:canvasRotate#dragleft
             * @param {Object} e - Evento do arrasto
             * @eventOf br.com.canvasRotate:canvasRotate
             * @description
             * Detecta o arrasto da imagem para a esquerda
             */
            $ionicGesture.on('dragleft', function (e) {
              x0 = positionX - (x1/2);
              x2 = positionX + (x1/2);
              if((x0+x2) >= (-X + (x1*2))){
                positionX -= 3;
                context.clearRect(0,0,canvas.width, canvas.height);
                drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
              }
            }, elem);

            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc event
             * @name br.com.canvasRotate:canvasRotate#dragright
             * @param {Object} e - Evento do arrasto
             * @eventOf br.com.canvasRotate:canvasRotate
             * @description
             * Detecta o arrasto da imagem para a direta
             */
            $ionicGesture.on('dragright', function (e) {
              x0 = positionX - (x1/2);
              x2 = positionX + (x1/2);
              if((x0+x2) <= X){
                positionX += 3;
                context.clearRect(0,0,canvas.width, canvas.height);
                drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
              }
            }, elem);


            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc event
             * @name br.com.canvasRotate:canvasRotate#dragup
             * @param {Object} e - Evento do arrasto
             * @eventOf br.com.canvasRotate:canvasRotate
             * @description
             * Detecta o arrasto da imagem para cima
             */
            $ionicGesture.on('dragup', function (e) {
              context.clearRect(0,0,canvas.width, canvas.height);
              positionY -= 3;
              drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
            }, elem);

            //noinspection JSUnusedLocalSymbols
            /**
             * @ngdoc event
             * @name br.com.canvasRotate:canvasRotate#dragup
             * @param {Object} e - Evento do arrasto
             * @eventOf br.com.canvasRotate:canvasRotate
             * @description
             * Detecta o arrasto da imagem para baixo
             */
            $ionicGesture.on('dragdown', function (e) {
              context.clearRect(0,0,canvas.width, canvas.height);
              positionY += 3;
              drawRotatedImage(imageWrapper, positionX, positionY, (counter || 0));
            }, elem);


            /**
             * @ngdoc method
             * @name br.com.canvasRotate:canvasRotate#rotate
             * @param {Boolean} rigth - True se a rotação deve ser para a direita
             * @methodOf br.com.canvasRotate:canvasRotate
             * @description
             * Função que aplica a rotação na imagem
             */
            function rotate(rigth) {
              context.clearRect(0,0,canvas.width, canvas.height);
              calcAngular();
              if(rigth){
                drawRotatedImage(imageWrapper, positionX, positionY, counter+ANGULO);
                counter+=ANGULO;
              }else{
                drawRotatedImage(imageWrapper, positionX, positionY, counter-ANGULO);
                counter-=ANGULO;
              }
            }

            /**
             * @ngdoc method
             * @name br.com.canvasRotate:canvasRotate#drawRotatedImage
             * @param {Object} image - Instância da imagem
             * @param {Number} x - Posição em relação ao eixo das abscissas
             * @param {Number} y - Posição em relação ao eixo das ordenadas
             * @param {Number} angle - Ângulo de rotação da imagem
             * @methodOf br.com.canvasRotate:canvasRotate
             * @description
             * Desenha a imagem dentro do canvas
             */
            function drawRotatedImage(image, x, y, angle) {
              context.save();
              context.translate(x, y);
              context.rotate(angle * RADIANS);
              //noinspection JSCheckFunctionSignatures
              context.drawImage(image, -(image.width/2), -(image.height/2));
              context.restore();
            }

            /**
             * @ngdoc method
             * @name br.com.canvasRotate:canvasRotate#init
             * @param {Object} config - Parâmetros de inicialização da directiva
             * @methodOf br.com.canvasRotate:canvasRotate
             * @description
             * Efetua a configuração inicial da directiva
             */
            function init(config){
              obj = config;
              imageWrapper.src = config.url || "http://localhost:8100/img/mh3yxiJ.jpg";
            }

            // Aciona a inicialização da directiva
            init({}); //{"X":1800,"x0":-91,"x1":660,"x2":569,"Y":2880,"y0":-333,"y1":412,"y2":79,"positionY":-144,"positionX":242,"angle":90,"url":"http://localhost:8100/img/mh3yxiJ.jpg"}
          };

          return{
            strict: 'A',
            link: _link,
            scope: true,
            templateUrl: 'canvasRotateTemplate'
          }
        }
      ]);
})();
