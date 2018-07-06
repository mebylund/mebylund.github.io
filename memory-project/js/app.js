//array of all the cards
let cards = [
    'fa-diamond', 
    'fa-paper-plane-o', 
    'fa-anchor', 
    'fa-bolt', 
    'fa-cube', 
    'fa-anchor', 
    'fa-leaf', 
    'fa-bicycle', 
    'fa-diamond', 
    'fa-bomb', 
    'fa-leaf', 
    'fa-bomb', 
    'fa-bolt', 
    'fa-bicycle', 
    'fa-paper-plane-o', 
    'fa-cube'
];

//Display the cards on the page
//  - shuffle the list of cards using the provided "shuffle" method below
function initializeMatchingGame() {
    const newCards = shuffle(cards);
    const allCards = document.querySelectorAll('.deck .card');
    const cls = ['match', 'show', 'open', ...cards];
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].classList.remove(...cls);
        const nw = allCards[i];
        const child = nw.children[0];
        child.classList.remove(...cards);
        child.classList.add(newCards[i]);

        // //SHORTCUT to end
        // if (newCards[i] !== 'fa-diamond') {
        //     allCards[i].classList.add('open', 'match');
        // }
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//definded array outside respondToClick b/c of scope
let opArr = [];
let mchArr = [];
let clicks = 0;
const STARS_3 = 22;
const STARS_1 = 32;

// show number of clicks
function displayClicks() {
    document.getElementById('clckNum').innerHTML += clicks / 2 + ' tries! You won with time: ' + minutes + ' min ' + seconds + 'sec!';
    
}

//diplay number of moves at top durring game
function displayMoves() {
    const movesEl = document.querySelector('.moves');
    let inMoves = Number(movesEl.innerHTML);
    inMoves = clicks / 2;
    inMoves = Math.floor(inMoves);
    const movesStr = inMoves.toString();
    movesEl.innerHTML = movesStr;
}

// grab stars class, shows stars decreasing as game is played
function displayStars(numS) {
    const stars = document.querySelectorAll('.score-panel .fa-star');
    //reads input and displays correct number of stars
    switch (true) {
        case numS === 1:
            stars[2].parentElement.style.display = 'none';
            stars[1].parentElement.style.display = 'none';
            break;
        case numS === 2:
            stars[2].parentElement.style.display = 'none';
            break;
    }
}

// grab stars class, show number of stars at end of game
function displayStarsEnd(numS) {
    const stars = document.querySelectorAll('.modal-content .fa-star');
    //reads input and displays correct number of stars
    switch (true) {
        case numS === 1:
            stars[2].parentElement.style.display = 'none';
            stars[1].parentElement.style.display = 'none';
            break;
        case numS === 2:
            stars[2].parentElement.style.display = 'none';
            break;
    }
}

//timer
const timer = document.getElementById('timer');
let seconds = 0;
let minutes = 0;
let time;
let timerStart;
//set timer
timer.innerHTML = '0 mins 0 sec';
timerStart = true; 
//funacton to set game timer
function setGameTimer(){
    seconds = 0;
    minutes = 0;
    time = setInterval(() => {
        seconds++;
        if(seconds === 60){
            minutes++;
            seconds = 0;
        } 
        timer.innerHTML = `${minutes} mins ${seconds} sec`;
    }, 1000);
}

function respondToTheClick(e) {
    const el = e.target;
    if(timerStart) {
        setGameTimer();
        timerStart = false;
     }   
    //ignoring other clicks if 2 cards are flipped over
    if (opArr.length == 2) return;

    //showing card when a card is clicked on not when background is clicked
    if (el.classList.contains('card') && !el.classList.contains('match') && !el.classList.contains('open')) {
        // know how many times it was clicked
        let add = (function () {
            clicks += 1;
        })();

        //display stars at Top
        switch (true) {
            case clicks <= STARS_3:
                displayStars(3);
                break;
            case clicks >= STARS_1:
                displayStars(1);
                break;
            default:
                displayStars(2);
        }

        //display moves at top
        displayMoves();

        el.classList.add('open', 'show', 'flipInY', 'animated');
        //adding fa-trait to array
        const inCard = el.children[0];
        const itmCl = inCard.classList[1];
        opArr.push(itmCl);

        //timeout, gives time for players to see card when 2 are flipped over
        setTimeout(function () {
            if (opArr.length == 2 && opArr[0] === opArr[1]) {
                const gb = document.querySelectorAll('.open');
                //added foreach to remove from both in array and add to each in array
                gb.forEach(function (el) {
                    el.classList.remove('open', 'show', 'animated', 'flipInY')
                });
                gb.forEach(function (el) {
                    el.classList.add('match', 'animated', 'tada')
                    mchArr.push(itmCl);
                });
                opArr = [];

                //when all cards are flipped over and display Game End
                if (mchArr.length == cards.length) {
                    clearInterval(time); 
                    let modal = document.querySelector('.modal');
                    modal.style.display = 'block';

                    //display number of clicks and stars at end
                    switch (true) {
                        case clicks <= STARS_3:
                            displayStarsEnd(3);
                            displayClicks();
                            break;
                        // they get 1 star
                        case clicks >= STARS_1:
                            displayStarsEnd(1);
                            displayClicks();
                            break;
                        //they get 2 stars
                        default:
                            displayStarsEnd(2);
                            displayClicks();
                    }
                }
            }
            else if (opArr.length == 2) {
                //grab all cards with 'open'
                const gb = document.querySelectorAll('.open');
                gb.forEach(function (el) {
                    el.classList.remove('flipInY')
                });
                gb.forEach(function (el) {
                    el.classList.add('shake')
                });
                //timeout for animation
                setTimeout(function () {
                    gb.forEach(function (el) {
                        el.classList.remove('open', 'show', 'animated', 'flipInY', 'shake')
                    });
                    opArr = [];
                }, 1000);
            }
        }, 500);
    }
}

const dk = document.querySelector('.deck');
dk.addEventListener('click', respondToTheClick);

document.addEventListener('DOMContentLoaded', function () {
    initializeMatchingGame();
});