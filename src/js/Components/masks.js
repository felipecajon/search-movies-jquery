const masks = new class Masks {
	constructor () {
		const _this = this;
		const $doc = $(document);

		$doc.on('keypress', '.js-only-number',          e => _this.checkIsNumber(e));
		$doc.on("keydown", ".js-only-number-comma-dot", e => _this.checkIsNumberDotOrComma(e));


		_this.init();
	}

	checkIsNumberDotOrComma (e) {
		const _this = this;

		if (!_this.isNumbeDorOrComma(e)) {
			event.preventDefault();
		}
	}

	checkIsNumber(e){
		const _this = this;
		
		if(!_this.isNumberKey(e)){
			e.preventDefault();
			return false;
		}
	}

	isNumbeDorOrComma (e) {
		const validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', 'ArrowUp', 'ArrowDown','ArrowRight', 'ArrowLeft', 'Backspace', 'Tab', 'Delete'];

		if (!validChars.includes(e.key) || e.key == 'Unidentified') {
			return false;
		}

		return true;
	}

	isNumberKey (e) {
		var charCode = (e.which) ? e.which : e.keyCode;

		if (charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		
		return true;
	}

	init() {
		$(".js-mask-phone").mask('0000-0000');
		$(".js-mask-ddd").mask('(00)');
		$(".js-mask-celphone").mask('00000-0000');
		$('.js-mask-phone-widthddd').mask('(00) 0000-0000');
		$('.js-mask-celphone-widthddd').mask('(00) 00000-0000');
		$('.js-mask-datedefault').mask('00/00/0000');
		$('.js-mask-cpf').mask('000.000.000-00', {reverse: true});
		$('.js-mask-cep').mask('00000-000');
		$('.js-mask-cnpj').mask('00.000.000/0000-00', {reverse: true});
		$('.js-mask-cardnumber').mask("0000 0000 0000 0000");
		$('.js-mask-cardcvv').mask("0000");
		$('.js-mask-time').mask("00:00");
		$('.js-mask-currency').mask("#.##0,00", {reverse: true});
		$(".js-mask-rg").mask('00.000.000-A');

		$('.js-mask-ie-ac').mask('99.999.999/999-99');
		$('.js-mask-ie-al').mask('999999999');
		$('.js-mask-ie-ap').mask('999999999');
		$('.js-mask-ie-am').mask('99.999.999-9');
		$('.js-mask-ie-ba').mask('999999-99');
		$('.js-mask-ie-ce').mask('99999999-9');
		$('.js-mask-ie-df').mask('99999999999-99');
		$('.js-mask-ie-es').mask('999999999');
		$('.js-mask-ie-go').mask('99.999.999-9');
		$('.js-mask-ie-ma').mask('999999999');
		$('.js-mask-ie-mt').mask('99﻿99999999-9');
		$('.js-mask-ie-ms').mask('999999999');
		$('.js-mask-ie-mg').mask('999.999.999/9999');
		$('.js-mask-ie-pa').mask('99-999999-9');
		$('.js-mask-ie-pb').mask('99999999-9');
		$('.js-mask-ie-pr').mask('99999999-99');
		$('.js-mask-ie-pe').mask('99.9.999.9999999-9');
		$('.js-mask-ie-pi').mask('999999999');
		$('.js-mask-ie-rj').mask('99.999.99-9');
		$('.js-mask-ie-rn').mask('99.999.999-9');
		$('.js-mask-ie-rs').mask('999/9999999');
		$('.js-mask-ie-ro').mask('999.99999-9');
		$('.js-mask-ie-rr').mask('99999999-9');
		$('.js-mask-ie-sc').mask('999.999.999');
		$('.js-mask-ie-sp').mask('999.999.999.999');
		$('.js-mask-ie-se').mask('999999999-9');
		$('.js-mask-ie-to').mask('99999999999');
	}

	afterPaste () {
		$(".js-mask-phone").mask('0000-0000', {placeholder:""});
		$(".js-mask-ddd").mask('(00)', {placeholder:""});
		$(".js-mask-celphone").mask('00000-0000', {placeholder:""});
		$('.js-mask-phone-widthddd').mask('(00) 0000-0000', {placeholder:""});
		$('.js-mask-celphone-widthddd').mask('(00) 00000-0000', {placeholder:""});
		$('.js-mask-datedefault').mask('00/00/0000', {placeholder:""});
		$('.js-mask-cep').mask('00000-000', {placeholder:""});
		$('.js-mask-cardnumber').mask("0000 0000 0000 0000", {placeholder:""});
		$('.js-mask-cardcvv').mask("0000", {placeholder:""});
		$('.js-mask-time').mask("00:00", {placeholder:""});
		$(".js-mask-rg").mask('00.000.000-A', {placeholder:""});
	}

	getCreditCardLabel (cardNumber, validate_type = 'regexpFull') {
		cardNumber = cardNumber.replace(/\D/g,'');
        //https://gist.github.com/erikhenrique/5931368
        //https://forum.imasters.com.br/topic/542906-c%C3%B3digo-para-mudan%C3%A7a-de-bandeira-do-cart%C3%A3o-ao-digitar-n%C3%BAmero/
        //https://gist.github.com/erikhenrique/5931368

        // Visa: ^4[0-9]{12}(?:[0-9]{3})?$ All Visa card numbers start with a 4. New cards have 16 digits. Old cards have 13.
        // MasterCard: ^5[1-5][0-9]{14}$ All MasterCard numbers start with the numbers 51 through 55. All have 16 digits.
        // American Express: ^3[47][0-9]{13}$ American Express card numbers start with 34 or 37 and have 15 digits.
        // Diners Club: ^3(?:0[0-5]|[68][0-9])[0-9]{11}$ Diners Club card numbers begin with 300 through 305, 36 or 38. All have 14 digits. There are Diners Club cards that begin with 5 and have 16 digits. These are a joint venture between Diners Club and MasterCard, and should be processed like a MasterCard.
        // Discover: ^6(?:011|5[0-9]{2})[0-9]{12}$ Discover card numbers begin with 6011 or 65. All have 16 digits.
        // JCB: ^(?:2131|1800|35\d{3})\d{11}$ JCB cards beginning with 2131 or 1800 have 15 digits. JCB cards beginning with 35 have 16 digits.
        // http://www.regular-expressions.info/creditcard.html

        var regexVisa = {
        	regexpBin: /^4[0-9](?:[0-9])?/,
        	regexpFull: /^4[0-9]{12}(?:[0-9]{3})?/
        };

        var regexMaster = {
        	regexpBin: /^5[1-5][0-9]/,
        	regexpFull: /^5[1-5][0-9]{14}/
        };

        var regexAmex = {
        	regexpBin: /^3[47][0-9]/,
        	regexpFull: /^3[47][0-9]{13}/
        };

        var regexDiners = {
        	regexpBin: /^3(?:0[0-5]|[68][0-9])[0-9]/,
        	regexpFull: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/
        };

        var regexDiscover = {
        	regexpBin: /^6(?:011|5[0-9])[0-9]/,
        	regexpFull: /^6(?:011|5[0-9]{2})[0-9]{12}/
        };

        var regexJCB = {
        	regexpBin: /^(?:2131|1800|35\d)\d/,
        	regexpFull: /^(?:2131|1800|35\d{3})\d{11}/
        };

        var regexElo = {
        	regexpBin: /^((636368)|(438935)|(504175)|(451416)|(636297)|(5067)|(4576)|(4011)|(509048)|(509067)|(509049)|(509069)|(509050)|(509074)|(509068)|(509040)|(509045)|(509051)|(509046)|(509066)|(509047)|(509042)|(509052)|(509043)|(509064)|(509040)|(36297) \d)/,
        	regexpFull: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/
        };

        var regexHiper = {
        	regexpBin: /^(606282\d(\d)?)|(3841\d)$/,
        	regexpFull: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/
        };

        var regexAura = {
        	regexpBin: /^50[0-9]$/,
        	regexpFull: /^50[0-9]{14,17}$/
        };

        var regexDankort = {
        	regexpBin: /^(5019)\d+$/,
        	regexpFull: /^(5019)\d+$/
        };

        var regexInterpayment = {
        	regexpBin: /^(636)\d+$/,
        	regexpFull: /^(636)\d+$/
        };

        var regexUnionpay = {
        	regexpBin: /^(62|88)\d+$/,
        	regexpFull: /^(62|88)\d+$/
        };

        if(regexAura[validate_type].test(cardNumber)){
        	return 'aura';
        }

        if(regexHiper[validate_type].test(cardNumber)){
        	return 'hiper';
        }
        
        if(regexElo[validate_type].test(cardNumber)){
        	return 'elo';
        }
        
        if(regexAmex[validate_type].test(cardNumber)){
        	return 'amex';
        }
        
        if(regexDiners[validate_type].test(cardNumber)){
        	return 'diners';
        }
        
        if(regexDiscover[validate_type].test(cardNumber)){
        	return 'discover';
        }
        
        if(regexJCB[validate_type].test(cardNumber)){
        	return 'jcb';
        }
        
        if(regexVisa[validate_type].test(cardNumber)){
        	return 'visa';
        }
        
        if(regexMaster[validate_type].test(cardNumber)){
        	return 'master';
        }

        return '';
    }
}();