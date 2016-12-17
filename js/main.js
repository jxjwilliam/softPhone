(function ($) {
    'use strict';

    /**
     * this widget multiple times by assign different ids.
     */
    var rootNode = '#phoneWiget';

    var dials = ['2123450556'];

    function _phoneNumber(number, reset) {
        var phoneNumber = rootNode + ' input.phoneNumber';
        if (reset) {
            $(phoneNumber).val('');
            return;
        }

        var val = $(phoneNumber).val();
        if (number || number === 0) {
            val = val + number;
            $(phoneNumber).val(val);
        }
        return val;
    }

    function _phoneCheck() {
        var val = _phoneNumber();
        if (val.length === 10 || val.length === 11) {

            dials.push(val);
            return true;
        }
        return false;
    }

    function _dialButton() {
        var dialButton = rootNode + ' div.dialButton';
        if ($(dialButton).hasClass('dialing')) {
            $(dialButton).removeClass('dialing');
        }
        else {
            $(dialButton).addClass('dialing');
        }
    }

    var _phoneStatus = (function (rootNode) {

        var phoneStatus = rootNode + ' span.phoneStatus';
        /**
         * maintain the status of the widget
         */
        var statuses = {
            init: 'Initializing',
            ready: 'Ready',
            connecting: 'Connecting',
            connected: 'Connected',
            mute: 'Muted',
            hold: 'OnHold',
            callEnd: 'Call Ended',
        };

        return function (status) {
            if (status) {
                $(phoneStatus).text(statuses[status]);
            }
            return $(phoneStatus).text();
            //return statuses[status || 'init'];
        }
    }(rootNode));


    var init = (function () {

        _phoneStatus('init');

        setTimeout(function () {
            _phoneStatus('ready');
        }, 1000);
    }());


    $(function () {

        $(rootNode + ' div.dial').on('click', 'div.dialPad', function (e) {
            e.preventDefault();

            var number = parseInt($(e.target).closest('div.dialPad').text());

            _phoneNumber(number);

            $('form').trigger('phoneNumberChange');

            return false;
        });

        $(rootNode + ' div.callControl').on('click', function (e) {
            e.preventDefault();
            var ctrl = $(this).closest('div.callControl');
            if ($(ctrl).hasClass('mute')) {
                if (/mute/i.test(_phoneStatus())) {
                    _phoneStatus('ready');
                }
                else {
                    _phoneStatus('mute');
                }
                _dialButton();
            }
            else if ($(ctrl).hasClass('hold')) {
                if (/hold/i.test(_phoneStatus())) {
                    _phoneStatus('ready');
                }
                else {
                    _phoneStatus('hold');
                }
                _dialButton();
            }
            else if ($(ctrl).hasClass('redial')) {
                var curPhone = _phoneNumber();
                var indx = dials.indexOf(p) - 1;
                var prePhone = dials[indx > 0 ? indx : 0]
                _phoneNumber(prePhone);
                _phoneStatus('ready');
            }
        });

        $(rootNode + ' div.dialButton').on('click', function (e) {

            var dialButton = rootNode + ' div.dialButton';

            if ($(dialButton).hasClass('dialing')) {

                $('div.status').addClass('endCall');
                _phoneStatus('callEnd');
                setTimeout(function () {
                    $(dialButton).removeClass('dialing');
                    $('div.status').removeClass('endCall');
                    SoftPhoneTool.stopTimer(rootNode + ' span.timer');
                    _phoneStatus('ready');
                    _phoneNumber(0, true);
                }, 5000);
            }
            else {
                if (_phoneCheck()) {
                    _phoneStatus('connecting');
                    $(dialButton).addClass('dialing');

                    /**
                     * start the call timer from the moment the call is connected
                     */
                    setTimeout(function () {
                        SoftPhoneTool.timeCalculater(rootNode + ' span.timer');
                        _phoneStatus('connected');

                        _ctrl();
                    }, 1000);
                }
                else {
                    _phoneStatus('ready');
                }
            }

        });

        $(rootNode + ' form').on('keyup', 'input.phoneNumber', function (e) {
            e.preventDefault();
            $(this).trigger('phoneNumberChange');
        });

        $(rootNode + ' form').on('phoneNumberChange', function (e) {
            e.preventDefault();

            var val = _phoneNumber();
            val = val.replace(/[\(\)\s\-]*/g, '');

            if (val.length === 10 || val.length === 11) {
                _phoneStatus('ready');
            }
            else {
                console.log('phone number should be 10 or 11 number', val.length, val);
            }

            return false;
        });
    });


})(jQuery);

