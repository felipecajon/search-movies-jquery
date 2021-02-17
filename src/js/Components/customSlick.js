const customSlick = new class CustomSlick {
	constructor () {
		this.doc = $(document);
		
		this.slickConfig = {
			"default":{
				infinite: true,
				prevArrow: "<span class='glyphicon glyphicon-chevron-left left'></span>",
				nextArrow: "<span class='glyphicon glyphicon-chevron-right right'></span>",
				slidesToShow: 4,
				responsive: [{
					breakpoint: 1024,
					settings: {
						slidesToShow: 5
					}
				},
				{
					breakpoint: 640,
					settings: {
						slidesToShow: 4
					}
				},
				{
					breakpoint: 500,
					settings: {
						slidesToShow: 2
					}
				}]
			},

			"my-config":{
				infinite: true,
				prevArrow: "<span class='glyphicon glyphicon-chevron-left left'></span>",
				nextArrow: "<span class='glyphicon glyphicon-chevron-right right'></span>",
				slidesToShow: 3,
				responsive: [{
					breakpoint: 800,
					settings: {
						slidesToShow: 2
					}
				}]
			}
		};

		this.bindSlicks();
	}

	bindSlicks () {
		const _this = this;

		$(".js-slick").each(function(){
			const $c = $(this);
			
			$.each(_this.slickConfig, (key,config) => {
				if($c.hasClass("js-slick-"+key)){
					const $e = _this.doc.find(".js-slick-"+key);
					$e.slick(config);
				}
			});
		});
	}

	init (selector, configName = 'default') {
		const _this = this;

		$(selector).slick(_this.slickConfig[configName]);		
	}
}();