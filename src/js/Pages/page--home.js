const pagehome = new class PageHome {
    constructor () {
        this.doc = $(document);


        this.doc.on('click', '.js-search-suggestion', e => this.getSuggestion(e));
    }

    init () {
        formValidator.init('.js-form-movie', {callback: this.searchMovie});
        this.createSliderSuggestion();
    }

    getSuggestion (e) {
        const $el = $(e.currentTarget);
        const value = $el.attr('data-id');

        this.searchMovie({$form: false, isOk: true, value});
    }

    searchMovie ({$form, isOk, value}) {
        if (!isOk) {
            return false;
        }

        const url = `http://www.omdbapi.com`;
        // const url = `http://localhost:3000/mockResponse.json`;
        let params = {
            apikey: '7809a72a',
            plot: 'full',
        };

        if ($form) {
            params.t = $form.find('input').val();
        } else {
            params.i = value;
        }

        loader.init();

        setTimeout(() => {
            $.ajax({
                url: url,
                type: 'GET',
                data: params,
            })
            .done(function(data) {
                const $movieContent = $('.js-content-movie');

                if (data) {
                    $movieContent.removeClass('hidden');
                    $movieContent.html( pagehome.createTemplateMovieDetails(data) );
                } else {
                    $movieContent.addClass('hidden');
                }
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                loader.close();
            });
        }, 500);
    }

    createSliderSuggestion () {
        const url = '/suggestions.json';

        $.ajax({
            url: url,
            type: 'GET',
        })
        .done(function(data) {
            $('.js-slide-suggestions').html( pagehome.createTemplateSlide(data) );
            customSlick.init('.js-slick-suggestion');
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

    }

    createTemplateSlide (data) {
        let sliders = ``;

        $(data.suggestions).each(function(index, el) {
            sliders += `
                <div class="js-search-suggestion c-pointer" data-id="${el.id}">
                    <img src="${el.poster}" title="${el.name}" class="w-100 p-l-4 p-r-4" />
                </div>
            `;
        });

        return `
            <h2 class="text-center m-t-40"> Sugestões de Filmes </b2>
            <div class="js-slick-suggestion js-slick-default m-t-40 m-b-40">
                ${sliders}
            </div>
        `;
    }

    createTemplateMovieDetails (data) {
        return `
            <div class="m-t-40">
                <div class="row">
                    <div class="col-md-9">
                        <p class="font-03 fs-06">
                            ${data.Title}
                        </p>
                        <p>
                            ${data.Plot}
                        </p>
                        <div class="m-t-20">
                            <p class="m-t-4" >
                                <span class="font-02">
                                    Diretor:
                                </span>
                                ${data.Director}
                            </p>
                            <p class="m-t-4" >
                                <span class="font-02">
                                    Ator:
                                </span>
                                ${data.Actors}
                            </p>
                            <p class="m-t-4" >
                                <span class="font-02">
                                    Ano:
                                </span>
                                ${data.Year}
                            </p>
                            <p class="m-t-4" >
                                <span class="font-02">
                                    Genero:
                                </span>
                                ${data.Genre}
                            </p>

                            <button data-testid="btn-add-favorite" class="btn btn-primary m-t-20 hidden">
                                Favoritar
                            </button>
                        </div>
                    </div>
                    <div class="t-a-c col-md-3">
                        <img src="${data.Poster}" alt="${data.Title}" title="${data.Title}">
                    </div>
                </div>
            </div>
        `;
    }
}();