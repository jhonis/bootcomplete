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

        var bootstrapClasses = {};
        if (settings.bootstrapVersion == 3) {
            bootstrapClasses.inputGroup = 'input-group';
            bootstrapClasses.formControl = 'form-control';
            bootstrapClasses.btn = 'btn btn-default';
        } else if (settings.bootstrapVersion == 2) {
            bootstrapClasses.inputGroup = 'input-append span12';
            bootstrapClasses.formControl = 'input-block-level span9';
            bootstrapClasses.btn = 'btn';
        } else {
            alert('Bootstrap version incompatible');
        }

        function print() {
            if (!$(instance).is(":disabled") && !$(instance).is(".bootcomplete")) {
                $(instance).blur(function () {
                    $(this).val('');
                });
                $(instance).autocomplete({
                    minLength: settings.minLength,
                    delay: settings.delay,
                    select: function (event, ui) {
                        $('#bc-hidden-' + id).val(ui.item.id);
                        $('#bc-selected-' + id).val(ui.item.value);
                        $(instance).val(ui.item.value);
                        $(instance).hide();
                        $('#bc-div-selected-' + id).show();
                    },
                    close: function () {
                        $(instance).val('');
                    },
                    source: function (request, response) {
                        var dataObj = {};
                        dataObj[settings.parameterName] = $(instance).val();
                        if (typeof settings.additionalSelector != 'undefined' && settings.additionalSelector != '' &&
                            typeof settings.additionalParameterName != 'undefined' && settings.additionalParameterName != '') {
                            dataObj[settings.additionalParameterName] = $(settings.additionalSelector).val();
                        }
                        $.ajax({
                            url: settings.url,
                            data: dataObj,
                            success: function (data) {
                                response($.map(data, function (item) {
                                    var itemReturn = {};
                                    if ($.isFunction(settings.labelAttribute)) {
                                        itemReturn.label = settings.labelAttribute(item);
                                    } else {
                                        itemReturn.label = item[settings.labelAttribute];
                                    }
                                    if ($.isFunction(settings.idAttribute)) {
                                        itemReturn.id = settings.idAttribute(item);
                                    } else {
                                        itemReturn.id = item[settings.idAttribute];
                                    }
                                    return itemReturn;
                                }));
                            }
                        });
                    }
                });

                var hidden = $('<input type="hidden"/>');
                hidden.attr('id', 'bc-hidden-' + id);
                hidden.attr('name', name);
                hidden.val(value);

                var divSelected = $('<div/>');
                divSelected.attr('id', 'bc-div-selected-' + id);
                divSelected.addClass(bootstrapClasses.inputGroup);
                if (settings.bootstrapVersion == 2) {
                    divSelected.css({'margin-left': '0px'});
                }
                if (typeof value == 'undefined' || value == '') {
                    divSelected.css({display: 'none'});
                } else {
                    $(instance).hide();
                }
                var inputGroup;
                if (settings.bootstrapVersion == 3) {
                    inputGroup = $('<span/>').addClass('input-group-btn');
                }
                var inputSelected = $('<input type="text"/>').attr('id', 'bc-selected-' + id).addClass(bootstrapClasses.formControl).val(text).attr('disabled', 'disabled');
                var removeButton = $('<button type="button"/>').addClass(bootstrapClasses.btn).click(_clear);
                if (settings.bootstrapVersion == 2) {
                    removeButton.css({width: '26%'});
                }
                var glyph = $('<span/>').addClass('glyphicon glyphicon-remove');
                removeButton.append(glyph);
                removeButton.append(' Remover');
                divSelected.append(inputSelected);
                if (settings.bootstrapVersion == 3) {
                    inputGroup.append(removeButton);
                    divSelected.append(inputGroup);
                } else {
                    divSelected.append(removeButton);
                }

                $(instance).parent().append(hidden);
                $(instance).parent().append(divSelected);
            }
            $(instance).addClass('bootcomplete');
        }
        print();
        return this;
    }

    function _clear(event) {
        var btn = event.currentTarget;
        $(btn).parent().parent().find('.bootcomplete').bootcomplete().clear();
    };

    $.fn.bootcomplete = function (oInit) {
        var elements = this;
        this.each(function () {
            bootcomplete(oInit, $(this));
        });

        this.clear = function() {
            elements.each(function() {
                var id = $(this).attr('id');
                $(this).val('');
                $('#bc-hidden-'+ id).val('');
                $('#bc-div-selected-'+ id).hide();
                $(this).show();
            });
        };

        return this;
    };

    // plugin defaults
    $.fn.bootcomplete.defaults = {
        minLength: 2,
        delay: 200,
        bootstrapVersion: 3,
        url: '',
        labelAttribute: 'name',
        idAttribute: 'id',
        parameterName: 'value',
        additionalSelector: '',
        additionalParameterName: ''
    };

}(jQuery));
