const collapse = new class Collapse {
	constructor () {
		let $doc = $(document);

		$doc.on('click', '[data-collapse-key]', e => this.toogle(e));

		this.convertHidden();
	}

	convertHidden () {
		$('[data-collapse-target]').each(function(index, el) {
			let $el = $(el);

			if ($el.hasClass('hidden')) {
				$el.css({ 'display' : 'none' }).removeClass('hidden');
			}
		});
	}

	toogle (e) {
		let key = $(e.target).attr('data-collapse-key');
		let $target = $('[data-collapse-target='+key+']');

		if ($target.is(':visible')) {
			this.retract(key);
		} else {
			this.expand(key);
		}
	}

	expand (key) {
		let $target = $('[data-collapse-target='+key+']:not(.active)');

		$target.addClass('active');
		$target.animate({ height: 'toggle' });
	}

	retract (key) {
		let $target = $('[data-collapse-target='+key+'].active');

		$target.removeClass('active');
		$target.animate({ height: 'toggle' });
	}
}();