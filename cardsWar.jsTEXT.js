
/*

improvements:

if taking more time:

    * make the transition of card additions smoother, maybe a fold out for additional cards
    * use a template linked to data for things like score, (react, angular, mustache)
    * use a SASS preprocessor for CSS
    * add help link/button for rules
    * add option for save (use local storage)
    * add accessibility features. if using backbone, image alternates with sg-only

*/

var Card = function () {
    return {
        "name": undefined,
        "suite": undefined,
        "value": 0
    };
};

var cardNames = {
    "11": "jack",
    "12": "queen",
    "13": "king",
    "14": "ace"
};
var cardSuites = ['clubs', 'diamonds', 'hearts', 'spades'];
var cardValues = [2,3,4,5,6,7,8,9,10,11,12,13,14];

var Deck = function () {
    var builtDeck = {
        "cards": [],
        "newDeck": function () {
            var newDeck = this;
            newDeck.cards.length = 0;
            _.each(cardSuites, function (suite) {
                _.each(cardValues, function (value) {
                    var addCard = new Card();
                    var name = value + '';
                
                    addCard.name = _.has(cardNames, name) ? cardNames[name] : name;
                    addCard.suite = suite;
                    addCard.value = value;
                
                    newDeck.cards.push(addCard);
                    shuffleDeck(newDeck.cards);
                });
            }); 
        }
    };
    return builtDeck;
};

var game;

var Match = function () {
    thisMatch = {
        "dealCards": function () {
            var thisMatch = this;
            if (matchDeck.length > 0) {
            
                //var p1cardIndex = _.random(0, matchDeck.length);
                var p1cardIndex = 0;
                var p1card = matchDeck[p1cardIndex];
                thisMatch.player1.hand.push(p1card);
                displayHand(p1card, 'player1');
                matchDeck.splice(p1cardIndex, 1);
                       
                //var p2cardIndex = _.random(0, matchDeck.length);
                var p2cardIndex = 0;
                var p2card = matchDeck[p2cardIndex];
                thisMatch.player2.hand.push(p2card);
                displayHand(p2card, 'player2');
                matchDeck.splice(p2cardIndex, 1);
                
                var winner = determineWinner(p1card, p2card);
                
                if (winner === 'tie') {
                    thisMatch.dealCards();
                }
                else {
                    var bothHands = _.concat(thisMatch.player1.hand, thisMatch.player2.hand);
                    _.each(bothHands, function (card) {
                        thisMatch[winner].cards_won.push(card);
                    });
                    thisMatch[winner].won = thisMatch[winner].cards_won.length;
                }
                
                thisMatch.player1.hand.length = 0;
                thisMatch.player2.hand.length = 0;
                
                $('.player1 .score span').text(thisMatch.player1.cards_won.length);
                $('.player2 .score span').text(thisMatch.player2.cards_won.length);
            }
            else {
                var winning_player;
                var p1 = thisMatch.player1.cards_won.length;
                var p2 = thisMatch.player2.cards_won.length;
                
                if (p1 === p2) {
                    winning_player = 'Tie: Each player';
                }
                else {
                    winning_player = p1 > p2 ? 'Player 1' : 'Player 2';
                }
            
                $('.next-hand').prop('disabled', 'disabled');
                $('ul.cards').empty();
                $('.winner span').text(winning_player);
                $('.winner').addClass('show-winner');
            }
        },
        "player1": new Player(),
        "player2": new Player()
    };
    return thisMatch;
};

var matchDeck;

var Player = function () {

    var newPlayer = {
    "cards_won": [],
    "hand": [],
    "won": 0
    };
    
    return newPlayer;
}

function determineWinner (p1, p2) {
    var result;
    if (p1.value === p2.value) {
        result = 'tie';
    }
    else {
        result = p1.value > p2.value ? 'player1' : 'player2';
    }
    return result;
}

function displayHand (card, player) {

    //better done with data driven view. But for display purposes, this demonstrates functionality
    
    var border_color = card.suite === 'hearts' || card.suite === 'diamonds' ? 'warm' : 'cold';
    
    var listCard = document.createElement('li');
    listCard.setAttribute('class', border_color);
    listCard.setAttribute('title', card.name + ' of ' + card.suite);
    var cardImage = document.createElement('img');
    cardImage.setAttribute('src', 'img/' + card.name + '_of_' + card.suite + '.png');
    listCard.appendChild(cardImage);
    
    $('.' + player + ' .cards').append(listCard);

}

//this is the FisherYates randomize array script
//http://sedition.com/perl/javascript-fy.html
function shuffleDeck ( myArray ) {
    var i = myArray.length;
    if ( i === 0 ) return false;
    while ( --i ) {
         var j = Math.floor( Math.random() * ( i + 1 ) );
         var tempi = myArray[i];
         var tempj = myArray[j];
         myArray[i] = tempj;
         myArray[j] = tempi;
    }
}

//bootstrap 4 brings in jquery (but can be swaped out. So might as well use it
//vanilla would be document.getElementById('new-game').addEventListener('click', function() {});
//since jquery is in the mix, easier to use a class name rather than an id for getElementById: if we know that the use is unique, then just as good as ID and and a bit less verbose than vanilla's class array and index 0 equivalent 
$('.new-game').click(function () {

    event.preventDefault();
    
    $('.winner').removeClass('show-winner');
    
    var deck = new Deck();
    deck.newDeck();
    
    game = new Match();
    
    matchDeck = _.map(deck.cards,_.clone);
    
    game.dealCards();
    
    //vanilla would be to recreate add or remove classes or if using some sort of View model, the class would be bound to a data value, like ng-class
    $('.next-hand').removeAttr('disabled');

});

$('.next-hand').click(function () {

    event.preventDefault();
    
    $('ul.cards').empty();

    game.dealCards();

});

$('.winner').click( function () {
    $('.winner').removeClass('show-winner');
});

/*

NWEA Code Sample Request
 
Consider the following requirements when completing the below code sample:
* Best Practices (OO Design, TDD, Code Maintenance, etc)
* Documentation
* Unit Tests
* Executable demo
* Provide all source files for review
 
Create the game of war in Java or Javascript for 2 or more players.
 
If using Java
 
Design a class to represent a playing card. 

public class Card { 

} 

 
Using the Card class above, create an implementation of the following interface. 

public interface Deck 

{ 

Create the deck of cards 

public void create( int numberOfSuits, int numberOfRanks ); 

 
Shuffle the deck 

public void shuffle(); 

 

deal a card from the deck 

public Card deal(); 

}
Using the Card and Deck create a driver program that plays the card game War. 

public class War 

{ 

public void play( int numberOfSuits, 

int numberOfRanks, int numberOfPlayers ) 

{ 

 

} 

}

*/