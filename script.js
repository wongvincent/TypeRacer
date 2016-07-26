var globalTimer;
var noOfWords = 100;
var requestSize = noOfWords + 5;

$.ajax({
    url: '//api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=1000&minLength=3&maxLength=10&limit=' + requestSize + '&api_key=ef6dd4f5820f0ae33a0030485610961d4cf34d215edd3293f',
    dataType: 'jsonp',
    jsonpCallback: 'generateWords'
});

function generateWords(response) {
    var validWords = [];
    for(var i=0; i<response.length; i++) {
        if(isValid(response[i].word)) {
            validWords.push(response[i].word);
        }
        if(validWords.length === noOfWords) {
            placeWordsOnScreen(validWords);
            break;
        }
        if(i === response.length-1) {
            getRemainingWords();
            function getRemainingWords() {
                var requestSize = noOfWords - validWords.length;
                $.ajax({
                    url: '//api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=1000&minLength=3&maxLength=10&limit=' + requestSize + '&api_key=ef6dd4f5820f0ae33a0030485610961d4cf34d215edd3293f',
                    dataType: 'jsonp',
                    jsonpCallback: 'checkArrayLength' //$.done generates this
                }).done(function(response){
                    response.forEach(function(val) {
                        if(isValid(val.word)){
                            validWords.push(val.word);
                        }
                    });
                    if(validWords.length < noOfWords) {
                        getRemainingWords();
                    } else {
                        placeWordsOnScreen(validWords);
                    }
                });
            }
        }
    }

    function isValid(word) {
        return /^[a-zA-Z\-']+$/.test(word);
    }
}

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
        var wpm = new WPM();
        updateWordsRemaining(toBeTyped.length);
        input.on('input', function () {
            var matchThisWord = toBeTyped.length > 1 ? toBeTyped[0] + " " : toBeTyped[0];
            var currentInput = input.val();
            if (currentInput === matchThisWord) {
                wpm.wordCounter += toBeTyped.length > 1 ? ((matchThisWord.length - 1) / 5) : (matchThisWord.length / 5);
                wpm.setWPMText();
                input.val('');
                $("#typethis span:not('.completed-word'):first").addClass("completed-word");
                toBeTyped.shift();
                updateWordsRemaining(toBeTyped.length);
            } else if (matchThisWord.indexOf(currentInput) === 0) {
                input.removeClass("has-typo");
            } else {
                input.addClass("has-typo");
            }
        });

    });
}