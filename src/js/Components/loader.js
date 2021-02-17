const loader = new class Loader {
  constructor () {
    // this.init(2);
    // this.calcProgress(100,50);

    // Para usar basta chamar loader.init(),  caso queira chamar o progress bar passe o numeral 2 como 1º parametro
    // o componente ainda aceita um texto como 2º parametro
    // para carregar o progress bar chame a função loader.calcProgress(50, 100) o primeiro parametro eh o avanço e o segundo eh o 100%
  }

  static get loaderName () {
    return 'js-loader';
  }

  static get $loaderName () {
    return $(`.${Loader.loaderName}`);
  }

  static get bodyFixed () {
    return 'no-overflow';
  }

  loaderProgressBar (text) {
    return (`
      <div class="container-loader ${Loader.loaderName}" style="display: none;" >
        <div class="loader-bar">
          <div class="bar js-loader-progress"></div>
        </div>
        <div class="js-lds-ellipsis-text lds-ellipsis-text">
          ${text}
        </div>
      </div>
      `);
  }

  loader (text) {
    return (`
      <div class="container-loader ${Loader.loaderName}" style="display: none;" >
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="js-lds-ellipsis-text lds-ellipsis-text">
          ${text}
        </div>
      </div>
      `);
  }

  calcProgress (index, total = 100) {
    let atualStatus = (100 / total) * index;
    $('.js-loader-progress').css('width', atualStatus + "%");
  }


  init (type = '1', text = 'Carregando...') {
    if (Loader.$loaderName.length === 0) {

      $('body').addClass(Loader.bodyFixed).addClass("is-loading");

      if (type == '1') {
        $('body').addClass(Loader.bodyFixed).append(this.loader(text));
      } else {
        $('body').addClass(Loader.bodyFixed).append(this.loaderProgressBar(text));
      }

      Loader.$loaderName.fadeIn();
    }
  }

  close (callback) {
    $('body').removeClass(Loader.bodyFixed).removeClass("is-loading");

    Loader.$loaderName.fadeOut(400, function(){
      Loader.$loaderName.remove();
      if(callback !== undefined && callback !== null){
        callback();
      }
    });
  }

  changeText (text) {
    $('.js-lds-ellipsis-text').text(text);
  }

  local_init($container) {
    $container.addClass('loader-local');

    let $template = `
    <div class="loader-local-container ">
      <div class="loader-action lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    `;

    $container.append($template);
  }

  local_close($container) {
    $container.removeClass('loader-local');
    $container.find('.loader-local-container').remove();
  }
}();