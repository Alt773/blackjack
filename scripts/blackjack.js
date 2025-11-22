const wholeDeck = [];
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 13; k++) {
            switch (k) {
                case 0:
                    wholeDeck.push({ suit: j, rank: "A", value: 1 });
                    break;
                case 10:
                    wholeDeck.push({ suit: j, rank: "J", value: 10 });
                    break;
                case 11:
                    wholeDeck.push({ suit: j, rank: "Q", value: 10 });
                    break;
                case 12:
                    wholeDeck.push({ suit: j, rank: "K", value: 10 });
                    break;
                default:
                    wholeDeck.push({ suit: j, rank: (k+1).toString(), value: k+1 });
            }
        }
    }
}
let newDeck = structuredClone(wholeDeck);

let dealerCards = [];
let playerCards = [];
let handCount = 0;
let playerMoney = 0;
let betAmount = 0;

const playb = document.querySelectorAll(".playb");
playb.forEach(el => el.style.visibility ="hidden");

function drawCardFromDeck() {
    if (newDeck.length < 20) {
        newDeck = structuredClone(wholeDeck);
    }
    const idx = Math.floor(Math.random() * newDeck.length);
    return newDeck.splice(idx, 1)[0];
}

function randomCard(handId) {
    const carddata = drawCardFromDeck();

    const card = document.createElement("div");
    card.classList.add("pcard");

    const rankEl = document.createElement("div");
    rankEl.classList.add("rank");
    rankEl.textContent = `${carddata.rank}`;

    const symbol = document.createElement("img");
    symbol.classList.add("symbol");

    const face = document.createElement("img");
    face.classList.add("face");

    function faceImg(suitIndex) {
        if (carddata.rank === "J") {
            face.src = `images/faces/${suitIndex}jack.png`;
            face.alt = "Jack";
        } else if (carddata.rank === "Q") {
            face.src = `images/faces/${suitIndex}queen.png`;
            face.alt = "Queen";
        } else if (carddata.rank === "K") {
            face.src = `images/faces/${suitIndex}king.png`;
            face.alt = "King";
        } else {
            face.src = `images/suits/${suitIndex}.png`;
            switch (suitIndex) {
                case 0: face.alt = "Spades"; break;
                case 1: face.alt = "Diamonds"; break;
                case 2: face.alt = "Clubs"; break;
                case 3: face.alt = "Hearts"; break;
            }
        }
    }

    switch (carddata.suit) {
        case 0:
            symbol.src = "images/suits/0.png";
            symbol.alt = "Spades";
            faceImg(0);
            break;
        case 1:
            symbol.src = "images/suits/1.png";
            symbol.alt = "Diamonds";
            faceImg(1);
            break;
        case 2:
            symbol.src = "images/suits/2.png";
            symbol.alt = "Clubs";
            faceImg(2);
            break;
        case 3:
            symbol.src = "images/suits/3.png";
            symbol.alt = "Hearts";
            faceImg(3);
            break;
    }

    card.appendChild(rankEl);
    card.appendChild(symbol);
    card.appendChild(face);

    const container = document.getElementById(handId);
    container.appendChild(card);

    return carddata;
}

function calculateScore(cards) {
    let total = 0;
    let aces = 0;
    for (const c of cards) {
        total += c.value;
        if (c.rank === "A") aces++;
    }
    while (aces > 0 && total + 10 <= 21) {
        total += 10;
        aces--;
    }
    return total;
}

function clearTable() {
      dealerCards = [];
      playerCards = [];
      handCount = 0;
      const d = document.getElementById("dhand");
      while (d && d.firstChild) d.removeChild(d.firstChild);
      const p = document.getElementById("phand");
      while (p && p.firstChild) p.removeChild(p.firstChild);
      document.getElementById("end").style.visibility = "hidden";
  }

function deal() {
    if (betAmount == 0) {
        alert("You have to bet in order to play!");
        return;
    }
    document.getElementById("clearbet").style.visibility = "hidden";

    playerMoney -= betAmount
    document.getElementById("bmoney").innerHTML = `${playerMoney} $`

    clearTable();

    dealerCards.push(randomCard("dhand"));
    dealerCards.push(randomCard("dhand"));

    document.querySelector(".pcard:nth-child(2)").style.visibility = "hidden"

    const dealBtn = document.getElementById("bdeal");
    if (dealBtn) dealBtn.style.visibility = "hidden";
    playb.forEach(el => el.style.visibility ="visible");

    playerCards.push(randomCard("phand"));
    playerCards.push(randomCard("phand"));

    console.log("Dealer cards:", dealerCards, "score:", calculateScore(dealerCards));
    console.log("Player hand:", playerCards, "score:", calculateScore(playerCards));

    if (calculateScore(dealerCards) == 21) {
        if (calculateScore(playerCards) == 21) {
            playerMoney += betAmount
            endReset()
            
            document.getElementById("end").innerHTML = "Push";  
        }
        else {
            document.getElementById("end").innerHTML = "Dealer's Blackjack";
            endReset()
        }
    } else {if (calculateScore(playerCards) == 21) {
        document.getElementById("end").innerHTML = "You got Blackjack";
        playerMoney += Math.round(1.5*betAmount)
        endReset()
    }}
}

function hit() {
    const newCard = randomCard("phand");
    playerCards.push(newCard);
    if (calculateScore(playerCards) > 21) {
        endMsg.innerHTML = "Busted!";
        endReset()
    }   else if (calculateScore(playerCards) == 21) {
        stand()
    }
    document.getElementById("double").style.visibility = "hidden"
}
const endMsg = document.getElementById("end");

function stand() {

    while (calculateScore(dealerCards) < 17) {dealerCards.push(randomCard("dhand"));calculateScore(dealerCards)}
    console.log(`dealer's final score: ${calculateScore(dealerCards)}`);
    

    if ((calculateScore(dealerCards) < calculateScore(playerCards)) || (calculateScore(dealerCards) > 21) ) {
        endMsg.innerHTML = "Won!";
        playerMoney += 2*betAmount
        endReset()
    } else if (calculateScore(dealerCards) == calculateScore(playerCards)) {
            endMsg.innerHTML = "Pushed!";
            playerMoney += betAmount
            endReset()
    } else if (calculateScore(dealerCards) > calculateScore(playerCards)) {
            endMsg.innerHTML = "Lost!";
            endReset()
    }
           
        
    playb.forEach(el => el.style.visibility ="hidden");
}

function clearBet() {
    betAmount = 0;
    document.getElementById("bmoney").innerHTML = `${playerMoney} $`
    document.getElementById("bbet").innerHTML = `Bet: ${betAmount} $`
    document.getElementById("bdeal").style.visibility ="hidden";
}


function bet(amount) {
    document.getElementById("clearbet").style.visibility = "visible";
    betAmount += amount
    console.log(betAmount)
    console.log(playerMoney)
    document.getElementById("bmoney").innerHTML = `${playerMoney} $`
    document.getElementById("bbet").innerHTML = `Bet: ${betAmount} $`
    if (betAmount > 0) {document.getElementById("bdeal").style.visibility = "visible"}  
}

function endReset() {
    document.querySelector(".pcard:nth-child(2)").style.visibility = "visible";
    document.getElementById("end").style.visibility = "visible";
    document.getElementById("bmoney").innerHTML = `${playerMoney} $`;
    document.getElementById("bbet").innerHTML = `Bet: ${betAmount} $`;
    playb.forEach(el => el.style.visibility ="hidden");
    document.getElementById("bdeal").style.visibility ="visible";
    document.getElementById("clearbet").style.visibility ="visible";
}

function doubleDown() {
    playerMoney -= betAmount
    betAmount *= 2
    document.getElementById("bmoney").innerHTML = `${playerMoney} $`;
    document.getElementById("bbet").innerHTML = `Bet: ${betAmount} $`;
    hit()
    stand()


}
