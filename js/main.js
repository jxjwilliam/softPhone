(function ($) {
    'use strict';

    /**
     * this widget multiple times by assign different ids.
     */
    var rootNode = '#phoneWiget';

    var dials = ['2123450556', '8006668888', '3481238900', '7185340102'];

    function _phoneFormat(str) {
        if (str && str.length === 10) {
            return "+1 (" + str.substr(0, 3) + ") " + str.substr(3, 3) + " - " + str.substr(6);
        }
        return str;
    }


    function _phoneNumber(number, reset) {
        var phoneNumber = rootNode + ' input.phoneNumber';
        if (reset) {
            $(phoneNumber).val('');
            return;
        }
        if (number && number.toString().length >= 10) {
            return $(phoneNumber).val(number);
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
        val = val.replace(/[\(\)\s\-\+]*/g, '').replace(/^1/, '');

        if (/\b\d{10}\b/.test(val)) {
            _phoneValid(true);
            _phoneStatus('ready');
            dials.push(val);
            return true;
        }
        else {
            _phoneStatus('invalid');
            _phoneValid(false);
            return false;
        }
    }

    function _dialButton() {
        var dialButton = rootNode + ' button.dialButton';
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

    var _ctrlToggle = function (flag, redial) {
        if(redial) {
            $(rootNode + ' button.callControl.redial').attr('disabled', flag);
            return;
        }
        $(rootNode + ' button.callControl:not(:last)').each(function (i, c) {
            $(this).attr('disabled', flag);
        });
    };

    var init = (function () {

        _phoneStatus('init');
        _ctrlToggle(true);
        _ctrlToggle(false, 'redial');

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

        $(rootNode + ' button.callControl').on('click', function (e) {
            e.preventDefault();
            var ctrl = $(this).closest('button.callControl');
            if ($(ctrl).hasClass('mute')) {
                if (/mute/i.test(_phoneStatus())) {
                    _phoneStatus('connected');
                }
                else {
                    _phoneStatus('mute');
                }
                //_dialButton();
            }
            else if ($(ctrl).hasClass('hold')) {
                if (/hold/i.test(_phoneStatus())) {
                    _phoneStatus('connected');
                    SoftPhoneTool.pauseTimer(false);
                }
                else {
                    _phoneStatus('hold');
                    SoftPhoneTool.pauseTimer(true);
                }
                //_dialButton();
            }
            else if ($(ctrl).hasClass('redial')) {
                var curPhone = _phoneNumber();
                var indx = 0;
                if (curPhone) {
                    curPhone = curPhone.replace(/[\(\)\s\-\+]*/g, '').replace(/^1/, '');
                    indx = dials.indexOf(curPhone) - 1;
                    if(indx === -2) { //if curPhone exist and is invalid, or new input
                        indx = -1;
                    }
                }
                else {
                    curPhone = dials[dials.length - 1];
                    indx = dials.indexOf(curPhone);
                }
                if(indx===-1) {
                    indx = dials.length -1;
                }
                var prePhone = dials[indx];
                _phoneNumber(_phoneFormat(prePhone));
                _phoneStatus('ready');
            }
        });

        $(rootNode + ' button.dialButton').on('click', function (e) {

            var dialButton = rootNode + ' button.dialButton';

            if ($(dialButton).hasClass('dialing')) {

                $('div.status').addClass('endCall');
                _phoneStatus('callEnd');
                setTimeout(function () {
                    $(dialButton).removeClass('dialing');
                    $('div.status').removeClass('endCall');
                    SoftPhoneTool.stopTimer(rootNode + ' span.timer');
                    _phoneStatus('ready');
                    _phoneNumber(0, true);
                    _ctrlToggle(true);
                    _ctrlToggle(false, 'redial');
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
                        _ctrlToggle(false);
                        _ctrlToggle(true, 'redial');
                    }, 1000);
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
            val = val.replace(/[\(\)\s\-\+]*/g, '').replace(/^1/, '');

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

