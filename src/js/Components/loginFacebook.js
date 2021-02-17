function getParameterFromURL (name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const faceFHbook = new class FaceFHbook {
	constructor () {
		// README!!!
		// Carregar o seguinte Script antes:

		// <script id="facebook-jssdk" src="https://connect.facebook.net/en_US/sdk.js"></script>

		// Configurar dados de entrega pelo facebook neste link
		// https://developers.facebook.com/tools/explorer/?method=GET&path=me%2F&version=v3.2
		// Escolher opção 'Obter Token de acesso do usúario' para testar

		// Antes de ativar o app no facebook
		// Verifique se não está pedindo informações que requerem permissão pelo facebook como: gender, age, posts

		this.listnerFaceBook();
	}

	init (apiKey, fields, callback, origin) {
		let _this = this;

		FB.init({
			appId      : apiKey,
			xfbml      : true,
			version    : 'v3.2'
		});

		FB.AppEvents.logPageView();

		FB.login(function (response) {
			_this.getInfo(fields, response, callback, origin);
		});
	}

	getInfo (fields, response, callback, origin) {
		FB.api('/me/','GET', {"fields":fields}, function (data) {
			callback(data, response, origin);
		});
	}

	listnerFaceBook () {
		let apiKey = ACC.config.facebook;
		let fields = "birthday,email,last_name,first_name,gender";

		if (getParameterFromURL('facebookRegister')) {
			this.init(apiKey, fields, this.getFaceBookData);
		}

		if (getParameterFromURL('facebookLogin')) {
			let origin = getParameterFromURL('checkout') ? 'checkout' : false;
			this.init(apiKey, fields, this.getLogin, origin);
		}
	}

	getFaceBookData (data) {
		let userID = getParameterFromURL('userID');

		if (userID) {
			// o back deve ter criado um campo de com o path 'facebookId', não required, deixe-o oculto,
			// ele só será preenchido em cadastros realizados com o acellerador
			$('.js-facebookId').val( userID );
		}

		// Aqui você deve usar os dados recebidos em DATA para popular o seu FORM de register.tag

		if (getParameterFromURL('newUser')) {
			let errorMsg = 'Ops! Houve uma falha na autenticação com o Facebook, por favor, cadastra-se novamente.';
			let $errorDiv = $('<div>').addClass('js-error-message alert alert-info mt30').attr('role', 'alert').html(errorMsg);
			$('.main__inner-wrapper').before( $errorDiv );
		}
	}

	getLogin (data, auth, origin) {

		loader.init();

		setTimeout( () => {
			let userID = data.id;
			let url = '/facebook/authenticate?userId='+userID+'&token='+auth.authResponse.accessToken+'&email='+data.email;

			$.ajax({
				url: url,
				type: 'GET'
			})
			.done(function(data) {
				switch (data) {
					case 'OK':
					let basePath = '/';

					if (origin) {
						basePath = '/checkout';
					}

					window.location.href = basePath;
					break;
					case 'USER_NOT_REGISTERED':

					window.location.href = '/register?facebookRegister=true&userID='+userID;
					break;
					case 'INVALID_TOKEN':

					window.location.href = '/register?facebookRegister=true&newUser=true&userID='+userID;
					break;
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				loader.close();
			});
		}, 500 );
	}
}();