const routers = new class Router {
	constructor () {

		$(window).on('hashchange', e => this.init());

		this.init();
	}

	allRoutes () {
		return [
		{page: '', url: 'src/HTML/Pages/index.html'},
		];
	}

	getPage (pageCode) {
		let page = this.allRoutes().find( e => e.page == pageCode );

		if (!page) {
			window.location = '/';
		}

		return page;
	}

	init () {
		const hashPage = location.hash.replace(/[#\/]/g, '');

		const page = this.getPage(hashPage);
		page.el = $('.js-main-content');

		this.addComponents(page);
	}

	addComponents (page) {
		page.el.load(page.url);
	}
}();