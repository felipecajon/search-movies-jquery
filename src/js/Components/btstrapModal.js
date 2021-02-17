const btsModal = new class ModalBST {
	constructor () {
		this.doc = $(document);

		this.onOpen();
		this.onClose();

		this.doc.on('keyup', e => {this.escapeModal(e);});
	}

	escapeModal (e) {
		let key = e.key;

		if ($('.js-bootstrapModal').hasClass('in') && key == 'Escape') {
			this.close();
		}
	}

	onOpen () {
		this.doc.on('shown.bs.modal', '.js-bootstrapModal', function (e) {
			let $this = $(e.target);
			let zIndex = 1050 + $('.js-bootstrapModal').length;

			$this.removeClass('cboxElement');
			$this.css({'z-index': zIndex});
		});
	}

	onClose () {
		this.doc.on('hidden.bs.modal', '.js-bootstrapModal', function (e) {
			$(e.target).remove();
			
			if ($('.js-bootstrapModal').length > 0) {
				$('body').addClass('modal-open');
			}
		});
	}

	open (config) {
		let $modal = this.template();
		
		if (!config.id) {
			config.id = `modal_${ $('.js-bootstrapModal').length }`;
		}

		$modal.attr('id', config.id);
		
		if (config.class) {
			$modal.addClass(config.class);
		}

		if (config.title) {
			$modal.find('.modal-title').html(config.title);
		} else {
			$modal.find('.modal-header').remove();
		}

		if (config.html) {
			$modal.find('.modal-body').html(config.html);
		}

		if (config.size) {
			$modal.find('.modal-dialog').addClass(config.size);
		}

		$('body').prepend($modal);
		$modal.modal('show');
	}

	close (selector = '.js-bootstrapModal') {
		$(selector).modal('hide');
	}

	template () {
		let modalTemplate = `
		<div class="js-bootstrapModal modal fade" role="dialog">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Modal Header</h4>
					</div>

					<div class="modal-body">
						<p>Some text in the modal.</p>
					</div>
				</div>
			</div>
		</div>
		`;

		return $(modalTemplate);
	}
}();