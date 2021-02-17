const datepickerConfig = {
	dateFormat:'dd/mm/yy',
	monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
	monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
	dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
	dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
	dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
	closeText: 'Pronto',
	prevText: '',
	nextText: ''
};

const customDatepicker = new class CustomDatepicker {
	constructor () {
		let $doc = $(document);
		let _this = this;
	}

	init (selector, config = datepickerConfig) {
		const settings = {...datepickerConfig, ...config};

		$(selector).attr('autocomplete', 'off');
		$(selector).datepicker(settings);
	}
}();