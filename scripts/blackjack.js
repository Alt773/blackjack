const wholeDeck = [];
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 13; k++) {
            switch (k) {
                case 0:
                    wholeDeck.push({ suit: j, rank: "A", value: 1 });
                    break;
                case 10:
                    wholeDeck.push({ suit: j, rank: "A", value: 10 });
                    break;
                case 11:
                    wholeDeck.push({ suit: j, rank: "A", value: 10 });
                    break;
                case 12:
                    wholeDeck.push({ suit: j, rank: "A", value: 10 });
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
let playerMoney = 1000;
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

const scorekeeper = document.createElement("div");
scorekeeper.classList.add("scorekeeper")

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

const chipsContainer = document.getElementById("chips");
const bbottomContainer = document.getElementById("bbottom");

function deal() {

    tempWhileNoDatabase()
    console.log("player's money: " + playerMoney)
    insurance = 0;
    if (betAmount == 0) {
        document.getElementById("end").style.visibility = "visible"
        document.getElementById("end").innerText = "You have to bet in order to play";
        return;
    }
    document.getElementById("clearbet").style.visibility = "hidden";

    playerMoney -= betAmount
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`

    clearTable();

    dealerCards.push(randomCard("dhand"));
    dealerCards.push(randomCard("dhand"));


    document.querySelector(".pcard:nth-child(2)").style.visibility = "hidden"

    const dealBtn = document.getElementById("bdeal");
    if (dealBtn) dealBtn.style.visibility = "hidden";
    playb.forEach(el => el.style.visibility ="visible");

    playerCards.push(randomCard("phand"));
    playerCards.push(randomCard("phand"));
    document.getElementById("phand").appendChild(scorekeeper)
    scorekeeper.innerHTML = `${calculateScore(playerCards)}`

    console.log("Dealer cards:", dealerCards, "score:", calculateScore(dealerCards));
    console.log("Player hand:", playerCards, "score:", calculateScore(playerCards));

    bbottomContainer.classList.remove("bbottom-expanding");
    bbottomContainer.classList.add("bbottom-collapsing");

    chipsContainer.classList.remove("chips-visible");
    chipsContainer.classList.add("chips-hidden");

    if (dealerCards[0].rank === "A") {
        if (playerMoney - Math.round(betAmount/2) >= 0){
            playb.forEach(el => el.style.visibility ="hidden");
            endMsg.style.visibility = "visible";
            endMsg.innerHTML = `Buy Insurance?<br>${Math.round(betAmount/2)} $`;
            insButton.forEach(el => el.style.visibility ="visible");
        }

    }
    
    if (calculateScore(playerCards) == 21 && calculateScore(dealerCards) != 21) {
        document.getElementById("end").innerHTML = "You got Blackjack";
        playerMoney += Math.round(1.5*betAmount)

        dealerScorekeeper()

        endReset()
    }
    if (calculateScore(dealerCards) == 21 && calculateScore(playerCards) != 21 && dealerCards[0].rank !== "A") {
        document.getElementById("end").innerHTML = "Dealer's Blackjack";

        dealerScorekeeper()

        endReset()
    }

    if (playerMoney - betAmount < 0) {document.getElementById("double").style.visibility ="hidden"}
}

function dealerScorekeeper() {
    const dScore = document.createElement("div")
    dScore.classList.add("scorekeeper")
    document.getElementById("dhand").appendChild(dScore)
    dScore.innerHTML = `${calculateScore(dealerCards)}`
}

let insurance = 0;
function insYes() {
    insurance = 0;
    insurance += Math.round(betAmount/2);
    console.log(`Insurance: ${insurance}`);
    insButton.forEach(el => el.style.visibility ="hidden");
    endMsg.style.visibility = "hidden";
    playb.forEach(el => el.style.visibility = "visible");
    
    if (calculateScore(dealerCards) == 21) {
        if (calculateScore(playerCards) == 21) {
            playerMoney -= insurance
            playerMoney += 2*betAmount
            
            
            document.getElementById("end").innerHTML = "Push";

            dealerScorekeeper()

            endReset()
        }
        else {
            playerMoney -= insurance
            playerMoney += 2*insurance

            document.getElementById("end").innerHTML = "Dealer's Blackjack";

            dealerScorekeeper()

            endReset()
        }
    } else {playerMoney -= insurance}

    
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`;
    document.getElementById("bbet").innerHTML = `Bet:<br>${betAmount} $`;
}

const insButton = document.querySelectorAll(".insurance");
function insNo() {
    insurance = 0;
    insButton.forEach(el => el.style.visibility ="hidden");
    endMsg.style.visibility = "hidden";
    playb.forEach(el => el.style.visibility = "visible")

    if (calculateScore(dealerCards) == 21) {
        if (calculateScore(playerCards) == 21) {
            playerMoney -= insurance
            playerMoney += 2*betAmount
            
            
            document.getElementById("end").innerHTML = "Push";

            dealerScorekeeper()

            endReset()
        }
        else {
            playerMoney -= insurance
            playerMoney += 2*insurance

            document.getElementById("end").innerHTML = "Dealer's Blackjack";

            dealerScorekeeper()

            endReset()
        }
    } else {playerMoney -= insurance}

    
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`;
    document.getElementById("bbet").innerHTML = `Bet:<br>${betAmount} $`;

}

function hit() {
    const newCard = randomCard("phand");
    playerCards.push(newCard);
    scorekeeper.innerHTML = `${calculateScore(playerCards)}`
    if (calculateScore(playerCards) > 21) {
        endMsg.innerHTML = "Busted!";



        dealerScorekeeper()

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
    console.log(`player's final score: ${calculateScore(playerCards)}`);
    

    if ((calculateScore(dealerCards) < calculateScore(playerCards) && calculateScore(playerCards) <= 21) || (calculateScore(dealerCards) > 21 && calculateScore(playerCards) <= 21) ) {
        endMsg.innerHTML = "Won!";
        playerMoney += insurance
        playerMoney += 2*betAmount

        dealerScorekeeper()

        endReset()
    } else if (calculateScore(dealerCards) == calculateScore(playerCards)) {
            endMsg.innerHTML = "Pushed!";
            playerMoney += insurance
            playerMoney += betAmount

            dealerScorekeeper()

            endReset()
    } else if (calculateScore(dealerCards) > calculateScore(playerCards)) {
            endMsg.innerHTML = "Lost!";

            dealerScorekeeper()

            endReset()
    }
           
        
    playb.forEach(el => el.style.visibility ="hidden");
}

function clearBet() {
    betAmount = 0;
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`
    document.getElementById("bbet").style.visibility = "hidden"
    document.getElementById("bdeal").style.visibility ="hidden";
    document.getElementById("clearbet").style.visibility ="hidden";
}


function bet(amount) {
    clearTable()
    document.getElementById("end").style.visibility = "hidden"
    tempWhileNoDatabase()
    document.getElementById("clearbet").style.visibility = "visible";
    betAmount += amount
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`
    document.getElementById("bbet").style.visibility = "visible"
    document.getElementById("bbet").innerHTML = `Bet:<br>${betAmount} $`
    if (betAmount > 0) {document.getElementById("bdeal").style.visibility = "visible"}
    if (betAmount > playerMoney) {
        betAmount = playerMoney;
        document.getElementById("end").style.visibility = "visible";
        document.getElementById("end").innerText = "You don't have that much money!"
        document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`;
        document.getElementById("bbet").innerHTML = `Bet:<br>${betAmount} $`;
    }
}

function endReset() {
    document.querySelector(".pcard:nth-child(2)").style.visibility = "visible";
    document.getElementById("end").style.visibility = "visible";
    betAmount = 0;
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`;
    document.getElementById("bbet").style.visibility = "hidden"
    playb.forEach(el => el.style.visibility ="hidden");
    document.getElementById("bdeal").style.visibility ="hidden";
    document.getElementById("clearbet").style.visibility ="hidden";
    document.getElementById("chips").style.visibility = "visible";
    bbottomContainer.classList.remove("bbottom-collapsing");
    bbottomContainer.classList.add("bbottom-expanding");
    chipsContainer.classList.remove("chips-hidden");
    chipsContainer.classList.add("chips-visible");
}

function doubleDown() {
    playerMoney -= betAmount
    betAmount *= 2
    document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`;
    document.getElementById("bbet").innerHTML = `Bet:<br>${betAmount} $`;
    hit()
    stand()
}

function tempWhileNoDatabase() {
    if (playerMoney <= 0) {
        playerMoney = 1000;
        document.getElementById("bmoney").innerHTML = `Bank: ${playerMoney} $`;
    } 

}


