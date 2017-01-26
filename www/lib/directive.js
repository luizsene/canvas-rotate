/**
* @ngdoc overview
* @name br.com.canvasRotate:canvasRotate
* @author Luiz Sene <nandosene@gmail.com>
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
* @author Luiz Sene <nandosene@gmail.com>
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

    var btnRotate = ".btn_rotate{" +
    "background: #444 !important;" +
    "border-radius: 13px;" +
    " margin: 6px;" +
    "}";

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = canvasRotateSalvar + canvasRotateLeft + canvasRotateRight + btnRotate;
    document.getElementsByTagName('head')[0].appendChild(style);

    var template = '<section style="position: fixed; height: 30px; bottom: 98px;">' +
    '<div>' +
    '<a class="canvas-rotate-left button button-icon icon ion-refresh" id="rotate-left"></a>' +
    '<a class="canvas-rotate-salvar" id="salvar">Salvar</a>' +
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
      * @name br.com.canvasRotate:canvasRotate#debug
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * Objeto de configuração de debug
      */
      var debug = 1;
      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#obj
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * Objeto de configuração da directiva
      */
      var obj;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#escala
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * Escala d imagem em relação a real
      */
      var escala = 1;

      /* ==================== Horizontal ================ */

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#new_window_height
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      *Nova Altura do canvas
      */
      var new_window_height = window.outerHeight;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#dstX
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      *Distancia da reta X referente ao começo da imagem até o centro do canvas
      */
      var dstX;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#dstY
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      *Distancia da reta Y referente ao começo da imagem até o centro do canvas
      */
      var dstY;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#dstWidth
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      *largura da imagem
      */
      var dstWidth;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#dstHeight
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      *altura da imagem
      */
      var dstHeight;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#rotate
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      *ANGULO de rotação
      */
      var rotate = 0;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#scaleX
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * escala da imagem
      */
      var scaleX;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#scaleY
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * escala da imagem
      */
      var scaleY;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#scalable
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * controle true/false para deixar a imagem escalavel
      */
      var scalable;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#rotatable
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * controle true/false para deixar a imagem rotacionavel
      */
      var rotatable;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#advanced
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * controle true/false para deixar a imagem centralizada
      */
      var advanced;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#canvasWidth
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * largura do canvas
      */
      var canvasWidth;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#canvasHeight
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * altura do canvas
      */
      var canvasHeight;

      var translateX;
      var translateY;
      var rotated;
      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#topo
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * altura do topo a ser removida
      */
      var topo;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#bottom
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * altura do bottom a ser removida
      */
      var bottom;

      /**
      * @ngdoc property
      * @name br.com.canvasRotate:canvasRotate#imagemQuadrada
      * @propertyOf br.com.canvasRotate:canvasRotate
      * @description
      * identificação da imagem quadrada ou retangular
      */
      var imagemQuadrada = 0;

      /**
      * @ngdoc method
      * @name br.com.canvasRotate:canvasRotate#initVars
      * @methodOf br.com.canvasRotate:canvasRotate
      * @description
      * Função que inicializa a directiva após a imagem ser carregada
      */
      var initVars = function () {
        /*Ajuste tamanho da tela remove topo e bottom do calculo*/
        topo = angular.element(document.getElementsByTagName('ion-header-bar')[0]);
        bottom = angular.element(document.getElementsByClassName('tab-nav'));
        topo = topo.prop('clientHeight');
        bottom = bottom.prop('clientHeight');
        new_window_height = window.outerHeight - (topo + bottom);

        calcEscala();
        calcDimensoes();
        if(!obj == 'null'){
          console.log('obj',obj);
          if(obj.escala) escala = obj.escala;
          if(obj.dstWidth)  dstWidth = obj.dstWidth;
          if(obj.dstHeight)  dstHeight = obj.dstHeight;
          if(obj.canvasWidth)  canvasWidth = obj.canvasWidth;
          if(obj.canvasHeight)  canvasHeight = obj.canvasHeight;
          if(obj.rotate)  rotate = obj.rotate;
          if(obj.dstX)  dstX = obj.dstX;
          if(obj.dstY)  dstY = obj.dstY;
        }
        drawCanvas();
        seletor("#salvar").addClass('hide');
      };


      /**
      * @ngdoc method
      * @name br.com.canvasRotate:canvasRotate#calcEscala
      * @methodOf br.com.canvasRotate:canvasRotate
      * @description
      * calcula a escala da imagem
      */
      function calcEscala(){
        // Verifica se a imagem está na horizontal ou vertical
        if(imageWrapper.height < imageWrapper.width){
          if (rotate % 180) {
            escala  = ((((window.outerWidth) * 100)/ imageWrapper.naturalHeight)/100);
          }else{
            escala  = ((((new_window_height) * 100)/ imageWrapper.naturalHeight)/100);
          }
          imagemQuadrada = 0;
        }
        else if(imageWrapper.height > imageWrapper.width){
          if (rotate % 180) {
            escala = (((new_window_height * 100)/ imageWrapper.naturalWidth)/100);
          }else{
            escala = (((window.outerWidth * 100)/ imageWrapper.naturalWidth)/100);
          }
          imagemQuadrada= 0;
        }
        else if(imageWrapper.height === imageWrapper.width){
          escala  = ((((new_window_height) * 100)/ imageWrapper.naturalHeight)/100);
          imagemQuadrada= 1;
        }
      }


      /**
      * @ngdoc method
      * @name br.com.canvasRotate:canvasRotate#calcEscala
      * @methodOf br.com.canvasRotate:canvasRotate
      * @description
      * calcula a dimensção da imagem
      */
      function calcDimensoes(){

        dstWidth = imageWrapper.naturalWidth * escala;
        dstHeight = imageWrapper.naturalHeight * escala;
        scaleX = imageWrapper.scaleX;
        scaleY = imageWrapper.scaleY;
        scalable = true;
        rotatable = true;
        advanced = rotatable || scalable;
        canvasWidth = window.outerWidth;
        canvasHeight = new_window_height;
        /*centralizar*/
        dstX = -dstWidth / 2;
        dstY = -dstHeight / 2;
      };


      /**
      * @ngdoc method
      * @name br.com.canvasRotate:canvasRotate#calcAngular
      * @methodOf br.com.canvasRotate:canvasRotate
      * @description
      * Função disparada quando uma rotação é detectada na imagem
      */
      function getRotatedSizes(data) {
        var deg = Math.abs(data.degree) % 180;
        var arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;
        var sinArc = Math.sin(arc);
        var cosArc = Math.cos(arc);
        var width = data.width;
        var height = data.height;
        var aspectRatio = data.aspectRatio;
        var newWidth;
        var newHeight;

        newWidth = width * cosArc + height * sinArc;
        newHeight = width * sinArc + height * cosArc;

        return {
          width: newWidth,
          height: newHeight
        };
      }


      /**
      * @ngdoc method
      * @name br.com.canvasRotate:canvasRotate#drawCanvas
      * @methodOf br.com.canvasRotate:canvasRotate
      * @description
      * Desenha a imagem dentro do canvas
      */
      function drawCanvas() {
        if (rotatable) {
          rotated = getRotatedSizes({
            width: canvasWidth,
            height: canvasHeight,
            degree: rotate
          });

          canvasWidth = window.outerWidth;
          canvasHeight = new_window_height;
          translateX = canvasWidth / 2;
          translateY = canvasHeight / 2;
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        if (advanced) {
          context.save();
          context.translate(translateX, translateY);
        }

        if (rotatable) {
          context.rotate(rotate * Math.PI / 180);
        }
        context.scale(scaleX,scaleY);


        //context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageWrapper, Math.floor(dstX), Math.floor(dstY), Math.floor(dstWidth), Math.floor(dstHeight));
        //  context.restore();

        if(debug){
          console.log('escala',escala);
          console.log('dstX',dstX);
          console.log('dstY',dstY);
          console.log('dstWidth',dstWidth);
          console.log('dstHeight',dstHeight);
          console.log('canvasWidth',canvasWidth);
          console.log('canvasHeight',canvasHeight);
          console.log('rotate',rotate);
          console.log('===========================================================');
        }
          seletor("#salvar").removeClass('hide');
      }


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
      canvas.height = (new_window_height);

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
      * @name br.com.canvasRotate:canvasRotate#salvar
      * @param {Object} e - Evento do click
      * @eventOf br.com.canvasRotate:canvasRotate
      * @description
      * Detecta o click no botão de rotação para esquerda
      */
      seletor("#salvar").on('click', function (e) {

        var valores={
        escala: escala,
        dstX:dstX ,
        dstY:dstY ,
        dstWidth:dstWidth,
        dstHeight:dstHeight ,
        canvasWidth:canvasWidth,
        canvasHeight:canvasHeight,
        rotate:rotate,
        url:url
      };
        localStorage.setItem("canvasRotateSalvo",JSON.stringify(valores));
        console.log('salvando');
        seletor("#salvar").addClass('hide');
      });

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
        rotate = ((rotate > 0) ?  (rotate - 90) : 270);
        calcEscala();
        calcDimensoes();
        drawCanvas();
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
        rotate = ((rotate < 270) ?  (rotate + 90) : 0);
        calcEscala();
        calcDimensoes();
        drawCanvas();
      });


      /**
      * @ngdoc event
      * @name br.com.canvasRotate:canvasRotate#moveImage
      * @param {String} direcao - Direção a ser movida imagem
      * @eventOf br.com.canvasRotate:canvasRotate
      * @description
      * move imagem de acordo com a direção
      */
      function moveImage(direcao){
        if(Math.abs(rotate) == 180){
          (direcao === 'up') ?  moveDown() : null;
          (direcao === 'left') ?  moveRight() : null;
          (direcao === 'right') ?  moveLeft() : null;
          (direcao === 'down') ?  moveUp() : null;
        }else if(Math.abs(rotate) % 180 && Math.abs(rotate) == 90){
          (direcao === 'up') ?  moveLeft() : null;
          (direcao === 'left') ?  moveDown() : null;
          (direcao === 'right') ?  moveUp() : null;
          (direcao === 'down') ?  moveRight() : null;
        }else if(Math.abs(rotate) % 180 && Math.abs(rotate) == 270){
          (direcao === 'up') ?  moveRight() : null;
          (direcao === 'left') ?  moveUp() : null;
          (direcao === 'right') ?  moveDown() : null;
          (direcao === 'down') ?  moveLeft() : null;
        }else{
          (direcao === 'up') ?  moveUp() : null;
          (direcao === 'left') ?  moveLeft() : null;
          (direcao === 'right') ?  moveRight() : null;
          (direcao === 'down') ?  moveDown() : null;
        }
      }

      /**
      * @ngdoc event
      * @name br.com.canvasRotate:canvasRotate#moveUp
      * @eventOf br.com.canvasRotate:canvasRotate
      * @description
      * move imagem para cima
      */
      function moveUp(){
        var comparador = (rotate % 180)  ? (Math.abs(dstY) <= Math.abs(dstHeight - (canvasWidth /2))) : (Math.abs(dstY) <= Math.abs(dstHeight - (canvasHeight /2)));
        if(comparador){
          dstY = dstY -1;
          drawCanvas();
        }
      }

      /**
      * @ngdoc event
      * @name br.com.canvasRotate:canvasRotate#moveLeft
      * @eventOf br.com.canvasRotate:canvasRotate
      * @description
      * move imagem para esquerda
      */
      function moveLeft(){
        var comparador = (rotate % 180)  ? (Math.abs(dstX) <= (dstWidth - (canvasHeight /2))) : (Math.abs(dstX) <= (dstWidth - (canvasWidth /2)));
        if(comparador){
          dstX = dstX -1;
          drawCanvas();
        }
      }

      /**
      * @ngdoc event
      * @name br.com.canvasRotate:canvasRotate#moveDown
      * @eventOf br.com.canvasRotate:canvasRotate
      * @description
      * move imagem para baixo
      */
      function moveDown(){
        var comparador = (rotate % 180)  ? (Math.abs(dstY) > (canvasWidth  / 2 )) : (Math.abs(dstY) > (canvasHeight  / 2 ));
        if(comparador){
          dstY = dstY +1;
          drawCanvas();
        }
      }

      /**
      * @ngdoc event
      * @name br.com.canvasRotate:canvasRotate#moveRight
      * @eventOf br.com.canvasRotate:canvasRotate
      * @description
      * move imagem para direita
      */
      function moveRight(){
        var comparador = (rotate % 180) ? (Math.abs(dstX) > (canvasHeight / 2 )) : (Math.abs(dstX) > (canvasWidth / 2 ));
        if(comparador){
          dstX = dstX +1;
          drawCanvas();
        }
      }


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
        moveImage('left');
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
        moveImage('right');
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
        moveImage('up');
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
        moveImage('down');
      }, elem);



      /**
      * @ngdoc method
      * @name br.com.canvasRotate:canvasRotate#init
      * @param {Object} config - Parâmetros de inicialização da directiva
      * @methodOf br.com.canvasRotate:canvasRotate
      * @description
      * Efetua a configuração inicial da directiva
      */
     var url = 'http://192.168.1.15:8100/img/mh3yxiJ.jpg'; //retangular paisagem
    //var url = 'https://s-media-cache-ak0.pinimg.com/564x/ee/47/67/ee476779c78962fb5856be86ac9ea174.jpg'; //retangular paisagem
    //var url = 'http://g02.a.alicdn.com/kf/HTB1AiCILXXXXXX2XpXXq6xXFXXXJ/Moda-Azul-colar-Cabochon-Vidro-Pingente-Imagem-Lobo-lua-wiccan-Half-Moon-Colar-para-Mulheres-Colares.jpg'; //quadrada

      function init(config){
        console.log('scope.image',attrs.canvasRotate);
        obj = config;
        imageWrapper.src = obj && obj.url ? obj.url : url;
      }

      scope.$watch('image', function (newValue) {
        if(newValue) init({})
      });


      // Aciona a inicialização da directiva
      var variavelInicial = localStorage.getItem('canvasRotateSalvo');
      variavelInicial = JSON.parse(variavelInicial);
       console.log('variavelInicial', variavelInicial);

      init(variavelInicial);
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
