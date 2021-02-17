const formValidatorMessages = {
	requiredField: 'O campo é obrigatório',
	invalidEmail: 'Este não é um e-mail valido',
	invalidDate: 'Esta não é uma data valida',
	invalidCPF_CNPJ: 'Este não é um $1 válido',
	minChar: 'O campo deve ter no mínimo $1 caracteres',
	pwNotMatch: 'As senhas não conferem',
};

const formValidatorConfigs = {
	validateEmptyFields: true,
	validateMinLength: true,
	validateCPF: true,
	validateCNPJ: true,
	validateEmail: true,
	validateDate: true,
	validateCheckBox: true,
	validateRadioBox: true,
	validatePW: true,
	callback: () => { return true; },
	scrollToErros: {
		active: false,
		spaceDiff: 0,
		speed: 200
	}
};

const clearFormConfig = {
	callback: false,
	reset: false
};

const formValidator = new class FormValidator {
	constructor () {
		const _this = this;
		const $doc = $(document);

		$(document).on('click', 'form [type="reset"]', e => this.clearForm(e));
	}

	init ( selector, config = formValidatorConfigs) {
		const _this = this;

		const settings = {...formValidatorConfigs, ...config,
			scrollToErros: {
				...formValidatorConfigs.scrollToErros, ...config.scrollToErros
			}
		};

		$(selector).attr('novalidate', 'true');

		$(document).on('submit', selector, e => {
			if ( !this.checkFields(selector, settings) ) {
				return false;
			}
		});
	}

	getEnter(selector, callback) {
		$(document).on('keyup', selector + ' input', e => {
			if (e.keyCode == 13) {
				callback();
			}
		});
    }

	checkFields (selector, config = formValidatorConfigs) {
		const _this = this;
		let isOk = true;
		
		const settings = {...formValidatorConfigs, ...config,
			scrollToErros: {
				...formValidatorConfigs.scrollToErros, ...config.scrollToErros
			}
		};

		_this.clearForm(selector);

		if ( settings.validateEmptyFields && !_this.checkAllEmptyFields(selector) )  { isOk = false; }
		if ( settings.validateMinLength && !_this.checkAllMinLength(selector) )      { isOk = false; }
		if ( settings.validateCPF && !_this.checkAllCPF(selector) )                  { isOk = false; }
		if ( settings.validateCNPJ && !_this.checkAllCNPJ(selector) )                { isOk = false; }
		if ( settings.validateEmail && !_this.checkAllEmail(selector) )              { isOk = false; }
		if ( settings.validateDate && !_this.checkAllDate(selector) )                { isOk = false; }
		if ( settings.validateCheckBox && !_this.checkAllCheckBox(selector) )        { isOk = false; }
		if ( settings.validateRadioBox && !_this.checkAllRadioBox(selector) )        { isOk = false; }
		if ( settings.validatePW && !_this.checkPw(selector) )                       { isOk = false; }
		if ( settings.callback && !settings.callback( {$form: $(selector), isOk} ))  { isOk = false; }

		_this.checkModalForm(selector);
		_this.checkScroller(selector, settings);

		return isOk;
	}

	checkModalForm (selector) {
		if ( $(selector).parents('#cboxContent').length > 0 ) {
			alert('Descomentar esse trecho: formValidator.js -> checkModalForm');
			// ACC.colorbox.resize();
		}
	}

	checkScroller (selector, settings) {
		if (settings.scrollToErros.active && $(`${selector} .has-error`).length >= 1) {
			scroller.goTo( $(`${selector} .has-error`).first(), settings.scrollToErros.spaceDiff, settings.scrollToErros.speed);
		}
	}

	checkAllEmptyFields ( selector ) {
		const _this = this;
		const selectors = `${selector} input[required='true']` + `, ${selector} select[required='true']` + `, ${selector} textarea[required='true']`;


		$(selectors).each(function(index, el){
			const $el = $(el);
			const value = $el.val();
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");

			if ( mustToCheck && _this.removeWhiteSpace(value) == '') {
				_this.inValidInput($(el));
			}
		});


		return $(`${selector} .has-error`).length == 0;
	}

	checkAllMinLength ( selector ) {
		const _this = this;

		$(`${selector} input[minlength], ${selector} textarea[minlength]`).each(function(index, el){
			const $el = $(el);
			const isRequired = $el.is(':required');
			const value = _this.removeWhiteSpace($el.val());
			const lengthValue = value.length;
			const minLength = parseInt($el.attr('minlength') || 0);
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");

			if ( mustToCheck && _this.removeWhiteSpace(value) != '' && lengthValue < minLength || isRequired && mustToCheck && lengthValue < minLength) {
				_this.inValidInput($el, formValidatorMessages.minChar.replace('$1', minLength));
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkAllCPF ( selector ) {
		const _this = this;

		$(`${selector} .js-cpf`).each(function(index, el){
			const $el = $(el);
			const isRequired = $el.is(':required');
			const value = $el.val();
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");

			if ( mustToCheck && _this.removeWhiteSpace(value) != '' && !_this.isCPF(value) || isRequired && mustToCheck && !_this.isCPF(value)) {
				const message = formValidatorMessages.invalidCPF_CNPJ.replace('$1', 'cpf');
				_this.inValidInput($el, message);
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkAllCNPJ ( selector ) {
		const _this = this;

		$(`${selector} .js-cnpj`).each(function(index, el){
			const $el = $(el);
			const value = $el.val();
			const isRequired = $el.is(':required');
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");

			if ( mustToCheck && _this.removeWhiteSpace(value) != '' && !_this.isCNPJ(value) || isRequired && mustToCheck && !_this.isCNPJ(value)) {
				const message = formValidatorMessages.invalidCPF_CNPJ.replace('$1', 'cnpj');
				_this.inValidInput($el, message);
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkAllEmail ( selector ) {
		const _this = this;

		$(`${selector} .js-email`).each(function(index, el){
			const $el = $(el);
			const value = $el.val();
			const isRequired = $el.is(':required');
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");

			if ( mustToCheck && _this.removeWhiteSpace(value) != '' && !_this.isEmail(value) || mustToCheck && isRequired && !_this.isEmail(value)) {
				_this.inValidInput($el, formValidatorMessages.invalidEmail);
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkAllDate ( selector ) {
		const _this = this;

		$(`${selector} .js-date`).each(function(index, el){
			const $el = $(el);
			const value = $el.val();
			const isRequired = $el.is(':required');
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");
			const format = $el.attr('data-format') || 'pt-br';

			if ( mustToCheck && _this.removeWhiteSpace(value) != '' && !_this.isDate(value, format) || mustToCheck && isRequired && !_this.isDate(value, format)) {
				_this.inValidInput($el, formValidatorMessages.invalidDate);
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkAllCheckBox ( selector ) {
		const _this = this;
		const selectors = `${selector} input[type='checkbox'][required='true']`;

		$(selectors).each(function(index, el){
			const $el = $(el);
			const value = $el.val();
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");

			if ( mustToCheck && !$el.prop('checked')) {
				_this.inValidInput($(el));
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkAllRadioBox ( selector ) {
		const _this = this;
		const selectors = `${selector} input[type='radio'][required='true']`;

		$(selectors).each(function(index, el){
			const $el = $(el);
			const value = $el.val();
			const name = $el.attr('name');
			const mustToCheck = $el.is(":visible") && !$el.is(":disabled");
			let isChecked = false;

			$(`input[type='radio'][name='${name}']`).each(function(index, radio) {
				if ( $(radio).prop('checked') ) {
					isChecked = true;
				} 
			});

			if ( mustToCheck && !isChecked ) {
				_this.inValidInput($(el));
			}
		});

		return $(`${selector} .has-error`).length == 0;
	}

	checkPw ( selector ) {
		const _this = this;
		const $pw = $(`${selector} .js-pw`);
		const $pwConfirm = $(`${selector} .js-pw-confirm`);
		const mustToCheck = $pw.is(":visible") && !$pw.is(":disabled") && $pwConfirm.is(":visible") && !$pwConfirm.is(":disabled");

		const valPw = $pw.val();
		const valPwConfirm = $pwConfirm.val();

		if (valPw != valPwConfirm) {
			return _this.inValidInput($pwConfirm, formValidatorMessages.pwNotMatch);
		}

		return true;
	}

	checkEmail ( $input ) {
		const _this = this;
		let email = $input.val();
		
		if (email != '') {
			$input.val( email.replace(/\s/g, '') );
		}

		if (!_this.isEmail( email )) {
			return _this.inValidInput($input, formValidatorMessages.invalidEmail);
		}

		_this.validInput( $input );

		return true;
	}

	checkDate ( $input ) {
		const _this = this;

		if (!_this.isDate( $input.val() )) {
			return _this.inValidInput($input, formValidatorMessages.invalidDate);
		}

		_this.validInput( $input );

		return true;
	}

	checkCpfCnpj ($input, tpValidation) {
		const _this = this;
		const value = $input.val();
		const message = formValidatorMessages.invalidCPF_CNPJ.replace('$1', tpValidation);

		switch (true) {
			case (tpValidation == 'cpf'):
			if (!_this.isCPF( value )) {
				return _this.inValidInput($input, message);
			}
			break;

			case (tpValidation == 'cnpj'):
			if (!_this.isCNPJ( value )) {
				return _this.inValidInput($input, message);
			}
			break;
		}


		_this.validInput( $input );

		return true;
	}

	removeWhiteSpace (string) {
		return string.replace(/ /g, '');
	}

	removeSimbols (string, removeWhiteSpace) {
		const _this = this;
		removeWhiteSpace = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		if (!removeWhiteSpace) {
			return string.replace(/[^\w\s]/gi, '');
		}

		return _this.removeWhiteSpace(string.replace(/[^\w\s]/gi, ''));
	}

	replace (string, from, to) {
		return string.replace(new RegExp(from, 'g'), to);
	}

	isEmail (email) {
		return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) ? !0 : !1;
	}

	isDate (date, format = 'pt-br') {
		if (format == 'pt-br') {
			return moment(date, 'DD/MM/YYYY', true).isValid();
		} else {
			return moment(date, 'MM/DD/YYYY', true).isValid();
		}
	}

	isCPF (cpf) {
		const _this = this;
		cpf = _this.removeSimbols(cpf);

		if ( !cpf || cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222"  || cpf == "33333333333"  || cpf == "44444444444"  || cpf == "55555555555"  || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888"  || cpf == "99999999999" ) {
			return false;
		}

		var soma = 0;
		var resto;

		for (var i = 1; i <= 9; i++) {
			soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
		}

		resto = (soma * 10) % 11;

		if ((resto == 10) || (resto == 11)) {
			resto = 0;
		}

		if (resto != parseInt(cpf.substring(9, 10)) ) {
			return false;
		}

		soma = 0;

		for (var a = 1; a <= 10; a++) {
			soma = soma + parseInt(cpf.substring(a-1, a)) * (12 - a);
		}

		resto = (soma * 10) % 11;

		if ((resto == 10) || (resto == 11)) {
			resto = 0;
		}

		if (resto != parseInt(cpf.substring(10, 11) ) ) {
			return false;
		}

		return true;
	}

	isCNPJ (cnpj) {
		const _this = this;
		cnpj = _this.removeSimbols(cnpj);

		if ( !cnpj || cnpj.length != 14 || cnpj == "00000000000000"  || cnpj == "11111111111111"  || cnpj == "22222222222222"  || cnpj == "33333333333333"  || cnpj == "44444444444444"  || cnpj == "55555555555555"  || cnpj == "66666666666666"  || cnpj == "77777777777777"  || cnpj == "88888888888888"  || cnpj == "99999999999999") {
			return false;
		}

		var tamanho = cnpj.length - 2;
		var numeros = cnpj.substring(0,tamanho);
		var digitos = cnpj.substring(tamanho);
		var soma = 0;
		var pos = tamanho - 7;
		for (var i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2) {
				pos = 9;
			}
		}
		var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

		if (resultado != digitos.charAt(0)) {
			return false;
		}

		tamanho = tamanho + 1;
		numeros = cnpj.substring(0,tamanho);
		soma = 0;
		pos = tamanho - 7;

		for (var a = tamanho; a >= 1; a--) {
			soma += numeros.charAt(tamanho - a) * pos--;
			if (pos < 2) {
				pos = 9;
			}
		}

		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

		if (resultado != digitos.charAt(1)) {
			return false;
		}

		return true;
	}

	clearForm (e, config = clearFormConfig) {
		const $form = typeof e == 'object' ? $(e.currentTarget).parents('form').first() : $(e);
		const settings = {...clearFormConfig, ...config};

		$form.find('.inpt_error').removeClass('inpt_error');
		$form.find('.help-block').remove();
		$form.find('.has-error').removeClass('has-error');

		if (settings.reset) {
			$form[0].reset();
		}

		if (settings.callback) {
			settings.callback();
		}
	}

	inValidInput ($input, message = formValidatorMessages.requiredField) {
		const $groupForm = $input.parents('.form-group');
		const $groupFormCheckbox = $input.parents('.checkbox');
		const $groupFormRadio = $input.parents('.radio-container');

		$groupForm.addClass('has-error');
		$groupFormCheckbox.addClass('has-error');
		$groupFormRadio.addClass('has-error');

		const dataLabel = $input.attr('data-label-error-email');
		message = dataLabel != undefined && dataLabel != '' ? dataLabel : message;
		const $errorMessage = `<div class='help-block'> <span class="text-danger"> ${message} <span> <div>`;

		if ($groupForm.length >= 1) {
			if ($groupForm.find('.help-block').length >= 1) {
				$groupForm.find('.help-block').html(message);
			} else {
				$input.after( $errorMessage );
			}
		}

		if ($groupFormCheckbox.length >= 1) {
			if ($groupFormCheckbox.find('.help-block').length >= 1) {
				$groupFormCheckbox.find('.help-block').html(message);
			} else {
				$groupFormCheckbox.find('label').after( $errorMessage );
			}
		}

		if ($groupFormRadio.length >= 1) {
			if ($groupFormRadio.siblings('.help-block').length >= 1) {
				$groupFormRadio.siblings('.help-block').html( $errorMessage );
			} else {
				$groupFormRadio.after( $errorMessage );
			}
		}

		return false;
	}

	validInput ( $input ) {
		var $groupForm = $input.parents('.form-group');
		$groupForm.removeClass('has-error');
		$groupForm.find('.help-block').remove();
	}
}();