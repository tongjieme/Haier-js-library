
// config
$(function() {
    $.each($('.datePicker'), function(k, v) {
        $(v).Zebra_DatePicker({
            show_icon: false,
            default_position: 'left_align',
            onSelect: function() {
                $(v).trigger('change').trigger('blur');
            }
        });
    });


    $.each($('.datePickerFuture'), function(k, v) {
        $(v).Zebra_DatePicker({
            show_icon: false,
            default_position: 'left_align',
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
        $('.datePickerBegin' + pair).data('beginpair', $('.datePickerEnd' + pair)).Zebra_DatePicker({
            default_position: 'left_align',
            show_icon: false,
            onSelect: function() {
                $(this).trigger('change').trigger('blur');
            },
            onOpen: function(){
                var This = this;
            }
        });

        $('.datePickerEnd' + pair).data('endpair', $('.datePickerBegin' + pair)).Zebra_DatePicker({
            default_position: 'left_align',
            show_icon: false,
            // show_select_today: false,
            onSelect: function() {
                $(this).trigger('change').trigger('blur');
            },
            onOpen: function(){
                var This = this;
                $(this).data('Zebra_DatePicker').update({
                    direction: [$(This).data('endpair').val().replace(/\//g, '-'), false]
                });
            }
        });
    });
})
