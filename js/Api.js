
let apiUrl = "https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes"
let paramsString = ''
let finalUrl = apiUrl + paramsString

$.getJSON(finalUrl, gotMakes)

console.log("CHIAMATA PARTITA")



// Callback eseguita dopo la richiesta dei dati di un singolo modello
function gotModel(data, idSelection) {
    let model = data[0]
    $("#" + idSelection).parent().find(".model-container").text(model.model_name + " by " + model.make_display + " (" + model.make_country + ")")
}
function getParams(data, idSelection){
    let trims = trims[0]
    $("#" + idSelection).parent().find(".result_api").text(model_doors + model.model_engine_power_kw)
}
// Callback eseguita dopo la richiesta dell'elenco dei modelli di un make
function gotModels(data, make, idSelection) {

    let makeModels = data.Models;

    $("#" + idSelection).find(".models-menu").empty()
    makeModels.forEach(function (model) {
        let template = '<a class="dropdown-item" href="#">' + model.model_name + '</a>'
        $("#" + idSelection).find(".models-menu").append(template);
    });

    $('#' + idSelection).find(".models-menu .dropdown-item").click(function (event) {
        let model = event.target.innerText

        // Evento di TRIMS in base alla selezione di makes
        $.getJSON("https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=" + make + "&model=" + model, function (data) {
            console.log("Trims", make, model, data)
            // Evento di MODEL in base al primo Trim ottenuto
            $.getJSON("https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModel&model=" + data.Trims[0].model_id, function (data) {
                console.log("Model", data)
                gotModel(data, idSelection)
                // Evento DETTAGLI IN BASE AI TRIMS
                $.getJSON("https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&[params]") + trims + doors + engine_position + engine_type, function(data){
                    console.log("parametri", data)
                    getParams(data, idSelection)
                }
            })
        })
        event.preventDefault(); //non far risalire la pagina
    })

}

function gotMakes(data) {

    let allMakes = data.Makes,
        countries = allMakes
            .map(function (make) { return make.make_country; })
            .filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
    console.log("Makes", allMakes);
    console.log("Countries", countries);
    $("#primary-selection .countries-menu").empty()

    countries.forEach(function (country) {
        let template = '<a class="dropdown-item" href="#">' + country + '</a>'
        $("#primary-selection .countries-menu").append(template);
        $("#secondary-selection .countries-menu").append(template);//PER LA SECONDA SELEZIONE
    });


    // filtro il paese selezionato dell utente - console.log(event) x vedere cosa clicca e poi filtro
    $(".countries-menu .dropdown-item").click(function (event) {        //#countries-menu e .dropecc è il selettore css
        let idSelection = $(this).parents(".dropdown-group").attr("id")
        let country = event.target.innerText            // event.target.innertext è il percorso che avviene quando l utente clicca (target)
        let countryMakes = allMakes.filter(
            function (make) {
                return make.make_country === country; // === è una comparazione 
            }
        )
        console.log(countryMakes)

        // Evento di MAKES in base alla selezione  di countries
        $('#' + idSelection).find(".makes-menu").empty() // svuotare il contenitore
        countryMakes.forEach(function (make) {
            $('#' + idSelection).find(".makes-menu").append('<a class="dropdown-item" href="#">' + make.make_display + '</a>');
        });

        $('#' + idSelection).find(".makes-menu .dropdown-item").click(function (event) {        //#countries-menu e .dropecc è il selettore css
            let make = event.target.innerText            // event.target.innertext è il percorso che avviene quando l utente clicca (target)

            // Evento di MODELS in base alla selezione  di makes
            $.getJSON("https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModels&make=" + make, function (data) {
                console.log("Models by", make, data)
                gotModels(data, make, idSelection)
            })
            event.preventDefault(); //non far risalire la pagina
        })

        event.preventDefault(); //non far risalire la pagina
    })


// TABALLA DATI AUTO

    // event onchange
    // let selectedCountry = ...
    // let makesPerCountry = allMakes.filter(function(make) { return make.make_country === selectedCountry; })

}

//let apiUrl = "https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getModel&model=11459"


