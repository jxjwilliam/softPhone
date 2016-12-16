var SoftPhoneTool = (function () {

    var timer = 0;

    function timeCalculater(displayAt) {

        if($(displayAt).length === 0) {
            return;
        }
        var seconds, minutes, hours, divider, currentTimeString;
        seconds = minutes = hours = currentTimeString = 0;
        divider = 60;

        timer = setInterval(function () {
            seconds++;
            minutes += Math.floor(seconds / divider);
            hours += Math.floor(minutes / divider);
            if (seconds % divider === 0) {
                seconds = 0;
            }
            if (minutes % divider === 0) {
                minutes = 0;
            }

            seconds = seconds.toString().length===1 ? '0'+seconds : seconds;

            currentTimeString = [
                hours ? (hours + ":") : '',
                minutes ? (minutes + ":") : '',
                seconds
            ].join('');

            //console.log(currentTimeString);
            $(displayAt).html(currentTimeString);

        }, 1000);
    };

    function stopTimer() {
        clearInterval(timer);
    }

    return {
        timeCalculater: timeCalculater,
        stopTimer: stopTimer
    }
})();
