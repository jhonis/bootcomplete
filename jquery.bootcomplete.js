(function ($) {

    var bootcomplete = function (options, object) {
        // Initializing global variables
        var instance = object;
        var id = $(instance).attr('id');
        var text = $(instance).val();
        var name = $(instance).attr('name');
        var value = $(instance).attr('title');
        $(instance).removeAttr('name');
        $(instance).removeAttr('title');

        var settings = $.extend({}, $.fn.bootcomplete.defaults, options);

        function clear() {
            $(instance).val('');
            $('#bc-hidden-'+ id).val('');
            $('#bc-div-selected-'+ id).hide();
            $(instance).show();
        }

        function print() {
            $(instance).blur(function() {
                $(this).val('');
            });
            $(instance).autocomplete({
                minLength: settings.minLength,
                delay: settings.delay,
                select: function (event, ui) {
                    $('#bc-hidden-'+ id).val(ui.item.id);
                    $('#bc-selected-'+ id).val(ui.item.value);
                    $(instance).val(ui.item.value);
                    $(instance).hide();
                    $('#bc-div-selected-'+ id).show();
                },
                close: function() {
                    $(instance).val('');
                },
                source: function (request, response) {
                    var dataObj = {};
                    dataObj[settings.parameterName] = $(instance).val();
                    $.ajax({
                        url: settings.url,
                        data: dataObj,
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item[settings.labelAttributeName],
                                    id: item[settings.idAttributeName]
                                }
                            }));
                        }
                    });
                }
            });

            var hidden = $('<input type="hidden"/>');
            hidden.attr('id', 'bc-hidden-'+ id);
            hidden.attr('name', name);
            hidden.val(value);

            var divSelected = $('<div/>');
            divSelected.attr('id', 'bc-div-selected-'+ id);
            divSelected.addClass('input-group');
            if (typeof value == 'undefined' || value == '') {
                divSelected.css({display: 'none'});
            } else {
                $(instance).hide();
            }
            var inputGroup = $('<span/>').addClass('input-group-btn');
            var inputSelected = $('<input type="text"/>').attr('id', 'bc-selected-'+ id).addClass('form-control').val(text).attr('disabled', 'disabled');
            var removeButton = $('<button type="button"/>').addClass('btn btn-default').click(clear);
            var glyph = $('<span/>').addClass('glyphicon glyphicon-remove');
            removeButton.append(glyph);
            removeButton.append(' Remover');
            inputGroup.append(removeButton);
            divSelected.append(inputSelected);
            divSelected.append(inputGroup);

            $(instance).parent().append(hidden);
            $(instance).parent().append(divSelected);
        }

        return print();
    }

    $.fn.bootcomplete = function (oInit) {
        return this.each(function () {
            return bootcomplete(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.bootcomplete.defaults = {
        minLength: 2,
        delay: 200,
        url: '',
        labelAttributeName: 'text',
        idAttributeName: 'id',
        parameterName: 'value'
    };

}(jQuery));
