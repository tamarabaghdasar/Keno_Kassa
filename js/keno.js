
//slip_url = 'wait_for_slip.html';
var currentCombination = 1;
var state = null;

var $w;
var betString;

function showError(errmsg) {
    $('#errNote').html(errmsg);
    $('#errNote').fadeIn(1000).delay(5000).fadeOut(1000);
}

function niceSeconds(seconds) {
    seconds = parseInt(seconds);
    var txt = "";
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    if (sec < 10) {
        sec = '0' + sec;
    }
    txt = min + ":" + sec;
    return txt;
}

function clearThings() {
    $('#totalSumm, #sum').val('0');
    currentCombination = 1;

    $('.combination:not(:last)').remove();

    $('.button2').each(function(idx, ball) {
        if ($(ball).hasClass("selected")) {
            $(ball).trigger("click");
        }
    });

    $('.combination .remove').hide();
}

function updateData() {
    $.ajax({
        type: 'GET',
        url: json_keno_url + '?rnd=' + Math.random(),
        dataType: data_type,
        timeout: 10000,
        success: function(data) {
            setTimeout(function() {
                try {
                    var json = data;
                    var seconds_for_state = (json['shar'] !== '') ? seconds_for_playing : seconds_for_betting;
                    $('#round').html(json['tiraj']);
                    $('#pbid').width(Math.floor(100 * (seconds_for_state - parseInt(json['timeleft'])) / seconds_for_state) + "%");
                    if (json['shar'] !== '') {
                        $('#statustxt').html(i18n('ÐŸÑ€Ð¸ÐµÐ¼ ÑÑ‚Ð°Ð²Ð¾Ðº Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½ (') + niceSeconds(json['timeleft']) + ')');
                        state = 'playing';
                        clearThings();
                    } else {
                        state = 'betting';
                        $('#statustxt').html(i18n('Ð˜Ð´ÐµÑ‚ Ð¿Ñ€Ð¸ÐµÐ¼ ÑÑ‚Ð°Ð²Ð¾Ðº (') + niceSeconds(json['timeleft']) + ')');
                    }
                } catch (e) {

                }
                updateData()
            }, 1000);
        },
        error: function() {
            setTimeout(function() {
                updateData();
            }, 1000);
        }
    });
}

var countSelected = 0;

$(document).ready(function() {
    $('#comb').val('');
    $('#num').val('');
    var playfield = '<table width="100%" height="100%">';
    for (var line = 0; line < 8; line++) {
        playfield += "<tr>";
        for (var digit = 1; digit <= 10; digit++) {
            var sectorID = (line * 10 + digit);
            playfield += "<td id=\"sector" + sectorID + "\"><input class=\"button2 ball black\" type=\"button\" value=" + sectorID + "></td>";
        }
        playfield += "</tr>";
    }
    playfield += "</table>";
    $('#field').html(playfield);

    $('.combination .add-more').live("click", function() {
        var comb = $(this).parents('.combination:first');
        var clone = comb.clone();
        comb.after(clone);

        clone.find('input').val('');

        $(this).hide();
        $(this).next().show();

        clone.find('.add-more').hide();

        $('.button2').removeClass('selected').addClass('black');

        currentCombination++;
        countSelected = 0;

        if(currentCombination == 5) {
            $('.combination:last .remove').show();
        }

        recalcSumForCombinations();
    });

    $('.combination .remove').live('click', function(){
        $(this).parents('.combination:first').remove();
        currentCombination--;

        if(currentCombination < 5) {
            if($('.combination:last #comb').val() != '') {
                $('.combination:last .add-more').show();
            }

            $('.combination:last .remove').hide();
        }

        recalcSumForCombinations();
    });


    $('#totalSumm').live('keyup', function(event){
        var me = this;
        setTimeout(function(){
            me.value = me.value.replace(/\D/g,'');
        }, 100);
    });
    $('#totalSumm').blur(function(){
        if($('#totalSumm').val() == ''){
            $('#totalSumm').val('0');
        }
    });
    $('#totalSumm').live('keydown', function(event){


        var me = this;
        setTimeout(function(){
            me.value = me.value.replace(/\D/g,'');
            if(me.value == '' && $('#totalSumm').is(':focus') == false) {
                me.value = '0';
            }
            recalcSumForCombinations();
        }, 100);



        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
                return false;
            }
        }

        if(this.value.length >= 8) {
            return false;
        }


    });


    $('.button2').live("click", function() {
        var obj = this;
        if ($(obj).hasClass("selected")) {
            $(obj).removeClass("selected");
            $(obj).addClass("black");
            countSelected--;
        } else {
            if (countSelected == 10) {
                showError("");
            } else {
                $(obj).removeClass("black");
                $(obj).addClass("selected");
                countSelected++;
            }
        }
        var selection = new Array();
        $('.button2').each(function(idx, ball) {
            if ($(ball).hasClass("selected")) {
                if (selection.indexOf($(ball).val()) < 0) {
                    selection.push($(ball).val());

                    if(currentCombination < 5) {
                        $('.combination:last .add-more').show();
                    }
                    else if($('.combination').size() == 5) {
                        $('.combination:last .remove').show();
                    }

                }

            }
        });
        $('.combination:last #comb').val(selection.join(','));
        $('.combination:last #num').val(selection.length);

        if(selection.length < 1) {
            $('.combination:last .add-more').hide();
        }
    });
    $('.randButton').live("click", function() {
        var obj = this;
        var value = $(obj).attr("value");

        //if (value == "clear") {
        $('.button2').each(function(idx, ball) {
            if ($(ball).hasClass("selected")) {
                $(ball).trigger("click");
            }
        });

        $('.combination:last #comb').val('');

        //$('#totalSumm, #sum').val('0');
        //} else {
        var i = 0;
        while (i < value) {
            var ballID = Math.floor(Math.random() * 80) + 1;
            var ball = $('[value="' + ballID + '"].button2');
            if (ball.hasClass("black")) {
                ball.trigger("click");
                i++;
            }
        }
        //}
    });
    $('.calc').live("click", function() {
        if (!$(this).hasClass('randButton')) {
            var val = $(this).val();
            if (/^[\d\.]+$/.test(val)) {
                var newSum = (parseFloat($('#totalSumm').val()) * 10 + parseFloat(val) * 10) / 10;
                if((newSum + '').length <= 8) {
                    $('#totalSumm').val(newSum);
                    recalcSumForCombinations();
                }

            }

            if (/Clear/.test(val)) {
                $('#totalSumm, #sum').val('0');
            }
            if (/Print/.test(val) && $('#totalSumm').val() > 0 ) {

                if(state == 'playing') {
                    return;
                }

                if($('.combination').size() == 1 && $('.combination:last #comb').val() == '') {
                    return;
                }

                if($('.combination:last #comb').val() == '') {
                    currentCombination--;
                    recalcSumForCombinations(true);
                }

                var bet = [];
                $('.combination').each(function(){
                    var item = $(this).find('#comb').val();
                    var sum  = $(this).find('#sum').val();

                    if(item == '' || sum == '' || sum == 0) {
                        return;
                    }

                    bet.push(item + ':' + ('' + sum).replace(',', '.'));
                });

                if(bet.length < 1) {
                    return;
                }
                debugger;
                var bets = bet.join(';');
                //betString = slip_url + "?source=" + source + "&bets=" + bets + "&round=" + $('#round').html();
                //askForSlip(betString);

                betString = slip_url + "?source=" + source + "&bets=" + bets + "&round=" + $('#round').html();
                if (window['parent'] || parent.window['process'])//if (window['parent'] && parent.window['process'])
                {
                    clearThings();
                    $.ajax(betString, {
                        dataType: "json",
                        timeout: 10000,
                        success: function(data) {
                            if(data.ok) {
                                window.open(ready_slip_url + '?slip=' + data.bet_string + '&token=' + Math.random(), '_blank');
                            }
                            else {
                                alert('Something is wrong with slip');
                            }
                        },
                        error: function(xhr, status) {
                            alert('Something is wrong with slip');
                        }
                    });
                }
                else {
                    clearThings();
                    $w = window.open();

                    //clearThings();

                    //$w = window.open();
                    $($w.document.body).html($('#wait_for_slip_html').val());
                }

                //window.open(betString);
            }
        }
    });
    updateData();

    setTimeout(function(){
        $(document.body).trigger('resize');
        $('#totalSumm').focus().select();
    }, 1000);

    $(document).on('keydown', function(e){
        if($('#totalSumm').is(':focus') == false){
            if($('#totalSumm').val() == '0') {
                $('#totalSumm').val('');
            }
            $('#totalSumm').focus().change();
            setTimeout(recalcSumForCombinations, 100);
        }
    });

});

function recalcSumForCombinations(final){
    if(currentCombination < 1) {
        return;
    }
    var val = $('#totalSumm').val();
    if(val == '') {
        val = 0;
    }
    var currentAmount = parseFloat(val);
    var currentPerAmount = Math.floor((currentAmount * 10 / currentCombination) * 10);
    var lastBet = Math.floor((currentAmount * 10 * 10 - (currentPerAmount * (currentCombination-1))) ) / 100;
    currentPerAmount /= 100;

    $('.combination').each(function(){
        if(final == true && $(this).find('#comb').val() == '') {
            return;
        }
        var sum = $(this).find('#sum');
        sum.val(currentPerAmount);
    });

    $('.combination:last #sum').val(lastBet);

}


var requestIterator = 0;
function askForSlip(url) {
    $('#wait-for-bet').show();
    $.ajax(url, {
        dataType: "json",
        timeout: 10000,
        success: function(data) {
            if(data.ok) {
                $('#wait-for-bet').hide();
                requestIterator = 0;
                window.open(ready_slip_url + '?slip=' + data.bet_string + '&token=' + Math.random(), '_blank');
            }
            else {
                alert('Something is wrong with slip');
                $('#wait-for-bet').hide();
                requestIterator = 0;
            }

        },
        error: function(xhr, status) {
            if(requestIterator < 10) {
                requestIterator++;
                setTimeout(askForSlip, 200);
            }

        }
    });
}