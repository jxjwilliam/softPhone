(function ($) {
    'use strict';

    /**
     * this widget multiple times by assign different ids.
     */
    var rootNode = '#phoneWiget';

    function _phoneNumber(number, reset) {
        var phoneNumber = rootNode + ' input.phoneNumber';
        if (reset) {
            $(phoneNumber).val('');
            return;
        }

        var val = $(phoneNumber).val();
        if (number || number === 0) {
            if (!val) {
                val = '+1 (';
            }

            if (val.match(/\((\d*)/)[1].length === 2) {
                val = val + number + ') ';
            }
            else {
                var t = val.match(/\)\s(\d*)/);
                if (t && t[1] && t[1].toString().length === 2) {
                    val = val + number + ' - ';
                }
                else {
                    val = val + number;
                }
            }

            $(phoneNumber).val(val);
        }
        return val;
    }

    function _phoneCheck() {
        var val = _phoneNumber();
        val = val.replace(/[\(\)\s\-\+]*/g, '').replace(/^1/,'');

        if (/\b\d{10}\b/.test(val)) {
            _phoneValid(true);
            _phoneStatus('ready');
            return true;
        }
        else {
            _phoneStatus('invalid');
            _phoneValid(false);
            return false;
        }
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
            invalid: 'need 10/11 digital'
        };

        return function (status) {
            if (status) {
                $(phoneStatus).text(statuses[status]);
            }
            return $(phoneStatus).text();
            //return statuses[status || 'init'];
        }
    }(rootNode));

    var _phoneValid = (function (rootNode) {
        var phoneStatus = rootNode + ' span.phoneStatus';
        return function (valid) {
            if (valid) {
                $(phoneStatus).removeClass('phoneInValid');
            }
            else {
                $(phoneStatus).addClass('phoneInValid');
            }
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
            }
            else if ($(ctrl).hasClass('hold')) {
                if (/hold/i.test(_phoneStatus())) {
                    _phoneStatus('ready');
                }
                else {
                    _phoneStatus('hold');
                }
            }
            else if ($(ctrl).hasClass('redial')) {
                if (/connecting/i.test(_phoneStatus())) {
                    _phoneStatus('ready');
                }
                else {
                    _phoneStatus('connecting');
                }
            }
            _dialButton();
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
                }, 15000);
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
                    }, 2000);
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
            val = val.replace(/[\(\)\s\-\+]*/g, '').replace(/^1/,'');

            if (/\b\d{10}\b/.test(val)) {
                _phoneStatus('ready');
                _phoneValid(true);
            }
            else {
                console.log('phone [' + val + '] length must be 10: ' + val.length);
            }

            return false;
        });
    });


})(jQuery);

