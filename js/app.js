/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * Create a list that holds all of your cards
 */
const $cards = $('.card');
const shownCardsList = new Array();

//get necessary DOM elements
const $restBtn = $('.restart');
const $counter = $('.counter');
const $plyAgnBtn = $('#play-again');

//Number of moves played
let moveNum = 0;

//timer variables
let min = 0;
let sec = 0;

//timer variable
let timer = 0;

//a flag used for first player click
let firstClick = false;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

prepareCards();
//start the gam e
function prepareCards() {
    //set number of moves to 0
    moveNum = 0;
    $('.moves').html(moveNum.toString());
    
    //Initialize stars
    $('.stars li i').removeClass('fa-star-o');
    $('.stars li i').addClass('fa-star');
    
    //preparing cards
    $('ul.deck').find('li').remove();
    $cards.removeClass('match');
    $cards.removeClass('open show');
    $cards.each( function() {
        $(this).on('click',function() {
            if (!firstClick) {
                firstClick = true;
                startTimer();
            }
            if (!$(this).hasClass('open show')) {
                displayCard($(this));
                if (shownCardsList.length == 0)
                    addCard($(this));
                else if ($(this).children().attr('class') == shownCardsList[0].children().attr('class'))
                    match($(this), shownCardsList[0]);
                else 
                    hideCards($(this), shownCardsList[0]);
            }
            if ($cards.length == $('.match').length) {
                finish();
            }
        });
    });
    shuffle($cards);
    $('ul.deck').append($cards);
    
    //hide cards after 3 seconds
    setTimeout(function() {
        $cards.removeClass('open show');
    }, 3000);
    
    //show cards and play counter and restart timer
    displayCard($cards);
    runConter();
    restTimer();
    firstClick = false;
}

//show card
function displayCard($card) {
    $card.addClass('open show');
}

//add a card to *list*
function addCard($card) {
    shownCardsList.push($card);
}

//set matched cards and increase number of moves by one
function match($card1, $card2) {
    $card1.addClass('match anim');
    $card2.addClass('match anim');
    shownCardsList.pop();
    increaseMoves();
}

//hide cards if they don't match and increase number of moves by one
function hideCards($card1, $card2) {
    displayCard($card2);
    $card1.addClass('dismatch danim');
    $card2.addClass('dismatch danim');
    setTimeout(function(){4
        $card1.removeClass('open show');
        $card2.removeClass('open show');
        $card1.removeClass('dismatch danim');
        $card2.removeClass('dismatch danim');
    }, 500);
    shownCardsList.pop();
    increaseMoves();
}

//moves increment and stars management
function increaseMoves() {
    moveNum++;
    $('.moves').html(moveNum.toString());
    if (moveNum >= 20) {
        $('.stars li:nth-child(2)').children().removeClass('fa-star');
        $('.stars li:nth-child(2)').children().addClass('fa-star-o');
    }
    if (moveNum >= 15) {
        $('.stars li:last-child').children().removeClass('fa-star');
        $('.stars li:last-child').children().addClass('fa-star-o');
    }
}

//finishes game if player won
function finish() {
    if (moveNum >= 20) $('#star-number').html('1');
    else if (moveNum >= 15) $('#star-number').html('2');
    else $('#star-number').html('3');
    $('#moves-number').html(moveNum.toString());
    $('.finish-box').css('display', 'block');
    $('.finish-box .container').addClass('open-anim');
    setTimeout(function() {
        $('.finish-box .container').removeClass('open-anim');
    }, 300);
    stopTimer();
}

//starts timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(function() {
        sec++;
        if (sec == 60) {
            sec = 0;
            min++;
        }
        $('.minute').html(min);
        $('.second').html(sec);
    }, 1000);
}

//stop timer
function stopTimer() {
    clearInterval(timer);
}

//restart timer
function restTimer() {
    clearInterval(timer);
    sec = 0;
    min = 0;
    $('.minute').html('0');
    $('.second').html('0');
}

//handle restart button
$restBtn.on('click','i' ,function() {
   prepareCards();
});

//handle play again button
$plyAgnBtn.on('click', function() {
    $('.finish-box .container').addClass('close-anim');
    setTimeout(function() {
        $('.finish-box').css('display', 'none');
        $('.finish-box .container').addClass('close-anim');
        prepareCards();
    }, 200);
});

//runs start counter
function runConter () {
    $('.counter').html('3');
    $('.counter').addClass('canim');
    setTimeout(function (){
        $('.counter').html('2');
    }, 1000);
    setTimeout(function (){
        $('.counter').html('1');
    }, 2000);
    setTimeout(function (){
        $('.counter').removeClass('canim');
    }, 3000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
}