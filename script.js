var toBeTyped = "I'll have you know I graduated top of my class in the Navy Seals";
var arrayOfWords = toBeTyped.split(/ +/);
var i = 0;
var globalTimer;

function startTimer() {
    var start = new Date;
    globalTimer = setInterval(function() {
        $('#timer').text(((new Date - start) / parseFloat(1000)).toFixed(2) + " Seconds");
    }, 1);
}

function updateWordsRemaining() {
    $('#numberOfWordsRemaining').text(arrayOfWords.length - i);
    if (i === arrayOfWords.length) {
        clearInterval(globalTimer);
        var timeStoppedAt = $('#timer').text();
        $('#timer').text("You finished in " + timeStoppedAt);
    }
}


$(function() {
    $('#typethis').text(toBeTyped);
    startTimer();
    updateWordsRemaining();

    $('#inputtext').on('input', function() {
        var matchThisWord = i < arrayOfWords.length - 1 ? arrayOfWords[i] + " " : arrayOfWords[i];
        if($('#inputtext').val() === matchThisWord) {
            $('#inputtext').val('');
            i++;
            updateWordsRemaining();
        }
    });

});