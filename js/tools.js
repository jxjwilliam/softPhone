var SoftPhoneTool = (function () {

    var timer = 0;
    var isPaused = false;

    function timeCalculater(displayAt) {

        if ($(displayAt).length === 0) {
            return;
        }
        var seconds, minutes, hours, divider, currentTimeString;
        seconds = minutes = hours = currentTimeString = 0;
        divider = 60;

        timer = setInterval(function () {

            if (!isPaused) {
                seconds++;
                minutes += Math.floor(seconds / divider);
                hours += Math.floor(minutes / divider);
                if (seconds % divider === 0) {
                    seconds = 0;
                }
                if (minutes % divider === 0) {
                    minutes = 0;
                }

                seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

                currentTimeString = [
                    hours ? (hours + ":") : '',
                    minutes ? (minutes + ":") : '',
                    seconds
                ].join('');

                //console.log(currentTimeString);
                $(displayAt).html(currentTimeString);
            }
        }, 1000);
    };

    function stopTimer(displayAt) {
        displayAt = displayAt || 'span.timer';
        clearInterval(timer);
        $(displayAt).html('');
    }

    function pauseTimer(flag) {
        isPaused = flag;
    }

    return {
        timeCalculater: timeCalculater,
        stopTimer: stopTimer,
        pauseTimer: pauseTimer
    }
})();
