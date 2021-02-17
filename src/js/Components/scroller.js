const scroller = new class Scroller {
	constructor () {
		const _this = this;
		const $doc = $(document);

		$doc.on('click', '[data-scroller-key]', e => _this.prepareToGo(e));
	}

	prepareToGo (e) {
		const _this = this;
		e.preventDefault();

		const $el = $(e.target);
		const key = $el.attr('data-scroller-key');  

		_this.goTo(`[data-scroller-target=${key}]`);
	}

	goTo (key, spaceDiff = 0, speed = 2000) {
		let $el = '';
		
		if (typeof key == 'object') {
			$el = key;
		} else {
			$el = $(key);
		}

		$([document.documentElement, document.body]).animate({
			scrollTop: $el.offset().top + spaceDiff
		}, speed);
	}
}();