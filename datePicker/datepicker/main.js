$(function(){
	 $.each($('.datePicker'), function(k, v) {
        $(v).Zebra_DatePicker({
            show_icon: false,
            onSelect: function() {
                $(v).trigger('change').trigger('blur');
            }
        });
    });


    $.each($('.datePickerFuture'), function(k, v){
        $(v).Zebra_DatePicker({
            show_icon: false,
            direction: true,
            onSelect: function() {
                $(v).trigger('change').trigger('blur');
            }
        });
    });

    $.each($('[class*=datePickerBegin]'), function(k, v) {
        var pair = (function() {
            var matched = /.*datePickerBegin(\d+)/.exec($(v).attr('class'));
            if (matched) {
                return matched[1];
            }
            return '';
        })();
        $('.datePickerBegin' + pair).Zebra_DatePicker({
            pair: $('.datePickerEnd' + pair),
            show_icon: false,
            onSelect: function() {
                $(this).trigger('change').trigger('blur');
            }
        });

        $('.datePickerEnd' + pair).Zebra_DatePicker({
            direction: 1,
            show_icon: false,
            show_select_today: false,
            onSelect: function() {
                $(this).trigger('change').trigger('blur');
            }
        });
    });
})