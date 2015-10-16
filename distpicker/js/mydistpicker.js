function zipcode2Name(code) {
    var address = '';
    $.each(ChineseDistricts, function(k, v) {
        if (v[code] != undefined) {
            address = v[code];
            return false;
        }
    });
    return address;
}

function name2ZipCode(code) {
    // todo
}

$.fn.distpicker = function(options) {
    this.each(function(k, v) {
        var o = $.extend({

        }, options || {});

        var selected = {};
        var $province = $(this).find('select').eq(0).html('<option value="">-请选择-</option>'),
            $city     = $(this).find('select').eq(1).html('<option value="">-请选择-</option>'),
            $district = $(this).find('select').eq(2).html('<option value="">-请选择-</option>');

        $province.on('change', function() {
            iniCity($(this).val(), selected.city)
        });

        $city.on('change', function() {
            initDistrict($(this).val(), selected.district)
        });



        var initProvince = function(selected) {
            $.each(ChineseDistricts[1], function(k, v) {
                $province.append('<option data-zipcode="' + k + '" value="' + k + '" ' + (function() {
                    if (selected == k) {
                        return "selected";
                    }
                    return '';
                })() + '>' + v + '</option>')
            });

            $province.trigger('change');

        }

        var iniCity = function(provinceZipcode, selected) {
            if (provinceZipcode.length == 0) {
                return;
            }
            if (/^\d*$/.test(provinceZipcode)) {
                $.each(ChineseDistricts[provinceZipcode], function(k, v) {
                    $city.append('<option data-zipcode="' + k + '" value="' + k + '" ' + (function() {
                        if (selected == k) {
                            return "selected";
                        }
                        return '';
                    })() + '>' + v + '</option>')
                });

                $city.trigger('change');
            } else {
                // throw "error";
            }
        }

        var initDistrict = function(cityZipcode, selected) {
            if (cityZipcode.length == 0) {
                return;
            }
            if (/^\d*$/.test(cityZipcode)) {
                $.each(ChineseDistricts[cityZipcode], function(k, v) {
                    $district.append('<option data-zipcode="' + k + '" value="' + k + '" ' + (function() {
                        if (selected == k) {
                            return "selected";
                        }
                        return '';
                    })() + '>' + v + '</option>')
                });
                $district.trigger('change');
            } else {
                // throw "error";
            }
        }

        var init = function() {
            selected = {
                province: $province.data('selected') || 1,
                city: $city.data('selected'),
                district: $district.data('selected')
            };
            initProvince(selected.province);
        }


        init();
    });
};
