$.ajax({
    url: '//api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=10&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
    dataType: 'jsonp',
    jsonpCallback: 'generateWords'
});

function generateWords(response) {
    placeWordsOnScreen(response.map(function(obj){
        return obj.word;
    }));
}

var globalTimer;

function startTimer() {
    var start = new Date;
    globalTimer = setInterval(function() {
        $('#timer').text(((new Date - start) / parseFloat(1000)).toFixed(2) + " Seconds");
    }, 1);
}

function updateWordsRemaining(i, arrayOfWords) {
    $('#numberOfWordsRemaining').text(arrayOfWords.length - i);
    if (i === arrayOfWords.length) {
        clearInterval(globalTimer);
        var timeStoppedAt = $('#timer').text();
        $('#timer').text("You finished in " + timeStoppedAt);
    }
}

function placeWordsOnScreen(toBeTyped) {
    $(function () {
        var i = 0;
        $('#typethis').text(toBeTyped.join(" "));
        startTimer();
        updateWordsRemaining(0, toBeTyped);


        $('#inputtext').on('input', function () {
            var matchThisWord = i < toBeTyped.length - 1 ? toBeTyped[i] + " " : toBeTyped[i];
            if ($('#inputtext').val() === matchThisWord) {
                $('#inputtext').val('');
                updateWordsRemaining(++i, toBeTyped);
            }
        });

    });
}