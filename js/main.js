(function ($) {
    'use strict';

    /**
     * this widget multiple times by assign different ids.
     */
    var rootNode = '#phoneWiget';

    function _phoneNumber(number) {
        var phoneNumber = rootNode + ' input.phoneNumber';
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
            return true;
        }
        return false;
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
            hold: 'OnHold'
        };

        return function (status) {
            if (status) {
                $(phoneStatus).text(statuses[status]);
            }
            return statuses[status || 'init'];
        }
    }(rootNode));


    var init = (function () {

        _phoneStatus('init');

        setTimeout(function () {
            _phoneStatus('ready');
        }, 1000);
    }());

    function _dialButton(call) {
        var dialButton = rootNode + ' div.dialButton';
        if (call) {
            $(dialButton).css({backgroundColor: 'red'});
        }
        else {
            $(dialButton).delay(15000).css({backgroundColor: '#2AB27B'});
        }
    }

    $(function () {

        $(rootNode + ' div.dial').on('click', 'div.dialPad', function (e) {
            e.preventDefault();

            var number = parseInt($(e.target).closest('div.dialPad').text());

            _phoneNumber(number);

            $('form').trigger('phoneNumberChange');

            return false;
        });

        $(rootNode + ' div.callControl.mute').on('click', function (e) {
            e.preventDefault();
            _phoneStatus('mute');

        });

        $(rootNode + ' div.callControl.hold').on('click', function (e) {
            e.preventDefault();
            _phoneStatus('hold');
        });

        $(rootNode + ' div.callControl.redial').on('click', function (e) {
            e.preventDefault();
            _phoneStatus('connecting');
        });

        $(rootNode + ' div.dialButton').on('click', function (e) {

            var dialButton = rootNode + ' div.dialButton';

            if($(dialButton).hasClass('dialing')) {
               $(dialButton).delay(15000).removeClass('dialing');
            }
            else {
                if (_phoneCheck()) {
                    _phoneStatus('connecting');

                    /**
                     * start the call timer from the moment the call is connected
                     */
                    setTimeout(function () {
                        SoftPhoneTool.timeCalculater('span.timer');
                        _phoneStatus('connected');
                        $(dialButton).addClass('dialing');

                    }, 2000);
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
            var status = _phoneStatus();

            val = val.replace(/[\(\)\s\-]*/g, '');

            if (val.length === 10 || val.length === 11) {
                _phoneStatus('ready');
            }

            console.log('val=' + val + ', val.length=' + val.length);
            return false;
        });
    });


})(jQuery);

