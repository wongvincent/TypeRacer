$.ajax({
    url: '//api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=1000&minLength=3&maxLength=10&limit=10&api_key=ef6dd4f5820f0ae33a0030485610961d4cf34d215edd3293f',
    dataType: 'jsonp',
    jsonpCallback: 'generateWords'
});

function generateWords(response) {
    placeWordsOnScreen(response.map(function(obj){
        return obj.word;
    }));
}

var globalTimer;

function Timer() {
    var start = new Date;
    var seconds;
    globalTimer = setInterval(function() {
        seconds = ((new Date - start) / parseFloat(1000)).toFixed(2);
        $('#timer').text(seconds + " Seconds");
    }, 10);
    this.getSeconds = function(){
        return seconds;
    }
}

function updateWordsRemaining(count) {
    $('#numberOfWordsRemaining').text(count);
    if (count === 0) {
        clearInterval(globalTimer);
        var timeStoppedAt = $('#timer').text();
        $('#timer').text("You finished in " + timeStoppedAt);
    }
}

function WPM() {
    var timer = new Timer();
    $('#wpm').text(0);
    this.wordCounter = 0;
    this.setWPMText = function() {
        $('#wpm').text((this.wordCounter / timer.getSeconds() * 60).toFixed(2));
    }
}

function placeWordsOnScreen(toBeTyped) {
    var input = $('#inputtext');
    $(function () {
        input.focus();
        toBeTyped.forEach(function(word) {
            $('#typethis').append('<span>' + word + ' </span>');
        });
        var wordList = [].slice.call(document.getElementById('typethis').getElementsByTagName('*'));
        console.log(wordList);
        console.log(toBeTyped);
        var wpm = new WPM();
        updateWordsRemaining(toBeTyped.length);
        input.on('input', function () {
            var matchThisWord = toBeTyped.length > 1 ? toBeTyped[0] + " " : toBeTyped[0];
            if (input.val() === matchThisWord) {
                wpm.wordCounter += toBeTyped.length > 1 ? ((matchThisWord.length-1)/5) : (matchThisWord.length/5);
                wpm.setWPMText();
                input.val('');
                wordList[0].style.color = 'DarkGreen';
                wordList.shift();
                toBeTyped.shift();
                updateWordsRemaining(toBeTyped.length);
            }
        });

    });
}