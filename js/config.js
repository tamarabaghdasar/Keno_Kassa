var mainURL = "//test_keno.beticus.com";
var CONFIG = {
    999: { //keno
        json_keno_url: "http://test_keno.beticus.com/kenodata/keno.json",
        slip_url: 'http://test_keno.beticus.com/inbet/mkMultiSlipKeno.php',
        ready_slip_url: '../mkSlip.php',
        data_type: 'json',
        bg_color: '#99cc66',
        seconds_for_betting: 120
    },

    995: { //keno2
        json_keno_url: "/kenodata/keno2.json",
        slip_url: '../mkMultiSlipKeno.php',
        ready_slip_url: '../mkSlip.php',
        data_type: 'json',
        bg_color: '#6699cc',
        seconds_for_betting: 120
    },

    99901: { //keno 5 min
        json_keno_url: mainURL + "/kenodata/5minkeno/keno.json",
        slip_url: '../mkMultiSlipKeno.php',
        ready_slip_url: '../mkSlip.php',
        data_type: 'json',
        bg_color: '#542727',
        seconds_for_betting: 300
    },
    99902: { //keno 5 min
        json_keno_url: "/kenodata/xkeno/keno.json",
        slip_url: '../mkMultiSlipKeno.php',
        ready_slip_url: '../mkSlip.php',
        data_type: 'json',
        bg_color: '#9c6ac4',
        seconds_for_betting: 120,
        seconds_for_playing: 60
    }
};

//var source = 99901; //old
var source = 999;
if($.url().param('source')) {
    source = $.url().param('source');
}

var seconds_for_betting = 120;
var seconds_for_playing = 120;
if(typeof CONFIG[source] != 'undefined') {
    json_keno_url = CONFIG[source].json_keno_url;
    slip_url      = CONFIG[source].slip_url;
    ready_slip_url = CONFIG[source].ready_slip_url;
    data_type = CONFIG[source].data_type;
    seconds_for_betting = CONFIG[source].seconds_for_betting;
    if (CONFIG[source].seconds_for_playing != null) {
        seconds_for_playing = CONFIG[source].seconds_for_playing;
    }

    $('body').css('background-color', CONFIG[source].bg_color);
}
else {
    alert('Wrong config');
}