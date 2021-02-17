let selectACSelects = [];

const selectAC = new class SelectAutoComplete {
	constructor () {
		this.doc = $(document);

		this.doc.on('click',  '.js-selectAC-container-options li', e => this.selectOption(e));
		this.doc.on('keyup',  '.js-selectAC-input',                    e => this.filterOptions(e));
		this.doc.on('focusin',  '.js-selectAC-input',                    e => this.toogleOptions(e));

		this.isInitialized = false;
	}

	init (selector, data) {
		const $select = $(selector);
		const id = $select.attr('id') || $select.attr('name');

		if (!this.isInitialized) {
			this.doc.on('click',  e => this.toogleOptions(e));
			this.isInitialized = true;
		}

		if (data && data.options) {
			let newOptions = '';

			$(data.options).each(function(index, el) {
				newOptions += `<option value="${el.code}"> ${el.value} </option>`;
			});

			$select.html(newOptions);
		}

		if (!this.isStored(id)) {
			this.storeSelect(id, {options: $select.find('option')});
			this.createOptions($select, id);
		}
	}

	isStored (id) {
		return this.getOptions(id) ? true : false;
	}

	storeSelect (id, config) {
		let options = [];

		$(config.options).each(function(index, el) {
			options.push({code: $(el).attr('value'), value: $(el).html()});
		});

		selectACSelects.push({code: id, options});

		return this.getOptions(id);
	}

	getOptions (id) {
		return selectACSelects.find(e => e.code == id);
	}

	createOptions ($select, id) {
		$select.addClass('hidden');
		let newOptionsList = '';

		$(this.getOptions(id).options).each((index, el) => {
			newOptionsList += `<li class="js-selectAc-option" value="${el.code}"> ${el.value} </li>`;
		});

		const newHTML = `
			<div class="js-selectAC-container selectAC-container type-container-2" data-id="${id}">
				<input class="js-selectAC-input selectAC-input form-control">
				<i class="js-show-options glyphicon glyphicon-chevron-down"> </i>

				<ul class="js-selectAC-container-options selectAC-container-options hidden">
					${newOptionsList}
				</ul>
			</div>
		`;

		$select.after(newHTML);
		$select.siblings('.js-selectAC-container');
	}

	toogleOptions (e) {
		const $element = $(e.target);
		const nodeName = $(e.target)[0].nodeName.toLowerCase();

		if ($element.hasClass('js-selectAc-option')) {
			this.selectOption( $element );
		}

		if ($element.hasClass('js-selectAC-input')) {
			$('.js-selectAC-container-options').addClass('hidden');
			$element.siblings('.js-selectAC-container-options').removeClass('hidden');
			return false;
		}

		$('.js-selectAC-container-options').addClass('hidden');
	}

	closeOptions ($element) {
		$element.parents('.js-selectAC-container').find('.js-selectAC-container-options').addClass('hidden');
	}

	selectOption (e) {
		const $option = $(e.currentTarget);
		const value = $option.html();
		const id = $option.attr('value');

		const $container = $option.parents('.js-selectAC-container');
		$container.siblings('select').val(id);
		$container.find('input').val(value && value.trim());
	}

	filterOptions (e) {
		if (e.keyCode == 9) {
			return false;
		}

		const $el = $(e.currentTarget);
		const value = $el.val();
		const $container = $el.parents('.js-selectAC-container');
		const currentSelect = $container.attr('data-id');
		const $containerOptions = $container.find('.js-selectAC-container-options');

		const newList = this.getOptions(currentSelect).options.filter(e => e.value.toLowerCase().includes(value.toLowerCase()));
		const newOptionsList = newList.map(el => `<li class="js-selectAc-option" value="${el.code}"> ${el.value} </li>`);

		$containerOptions.html(newOptionsList);
	}

	destroy (selector) {
		const id = $(selector).attr('id') || $(selector).attr('name');
		$(selector).siblings('.js-selectAC-container').remove();
		selectACSelects = selectACSelects.filter(e => e.code != id);
		$(selector).val('');
		$(selector).removeClass('hidden');
	}
}();