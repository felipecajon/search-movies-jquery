const typingCounter = new class TypingCounter {

	// Exemple
	//
	// <input type="text" class="js-typing-counter" maxlength="30" />
	// 
	// class 'js-typing-counter' to execute the element
	// maxlength attribute to get the max typing 
	//
	//
	// Call:
	// typingCounter.init('.container-query');
	
	constructor () {

		this.element = '.js-typing-counter';
		this.maxDefault = 30;
		this.$container = null;
	}

	init (container) {

		this.$container = $(container);

		this.$container.find(this.element).each( (i, element) => {
			this.create( $(element) );
		});
	}

	create ($element) {

		this.destroy($element);
		$element.after( this.template($element) );
		this.triggers($element);
	}

	template ($element) {

		const maxlength = $element.attr('maxlength') || this.maxDefault, 
			  currentValue = $element.val().length || 0;

		return `
			<div class="js-counter-container text-muted">
				<span>${currentValue}</span> / ${maxlength}
			</div>
		`;
	}

	triggers ($element) {

		$element.off('input').on('input', (e) => {
            this.updateCounter(e);
        });
	}

	updateCounter (e) {

		const $element = $(e.currentTarget),
			  maxlength = $element.attr('maxlength'),
			  value = $element.val().length;

		$element.parent().find('.js-counter-container span').text(value);
	}

	destroy ($element) {

		$element.parent().find('.js-counter-container').remove();
	}
	
	destroyAll () {

		this.$container.find('.js-counter-container').remove();
	}
}();