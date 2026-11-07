let balance = 1000;
let currentBet = 0;
let goal = 21;
let leastCardsBJ = 2;

let deck = [];
let playerCards = [];
let dealerCards = [];
let dealersHidden = true;


function setNewRound(){
    if (balance < 10){
        document.getElementById("messageText").innerText = "Dealer: 'Ty jsi ale neschopnej, nauč se sázet XDDDD'";
        setBetButtons(true);
        document.getElementById("btnNewRound").disabled = true;
        return;
    }

    currentBet = 0;
    playerCards = [];
    dealerCards = [];

    goal = Math.floor(Math.random() * 16) + 15;
    //výmysl chytré paní
    //Math.floor -> zaokrouhlí číslo dolů
    //Math.random -> náhodné desetinné číslo od 0 (včetně) do 1 (max 0.99999)

    if (goal <= 22){
        leastCardsBJ = 2;
    } else {
        leastCardsBJ = 3;
    }


    document.getElementById("balanceText").innerText = balance;
    document.getElementById("betText").innerText = currentBet;
    document.getElementById("goalText").innerText = goal;
    document.getElementById("ruleText").innerText = "Dealer musí stát na " + (goal - 4) + " a víš, jinak si musí vzít další kartu";

    document.getElementById("dealerCardsText").innerText = "-";
    document.getElementById("dealerSumText").innerText = "0";
    document.getElementById("playerCardsText").innerText = "-";
    document.getElementById("playerSumText").innerText = "0";
    document.getElementById("messageText").innerText = "Zvolte výši sázky pro zahájení kola";

    setBetButtons(false);
    document.getElementById("btnNextCard").disabled = true;
    document.getElementById("btnStand").disabled = true;
    document.getElementById("btnDouble").disabled = true;
    document.getElementById("btnNewRound").disabled = true;
}


function createDeck(){
    deck = [];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    let colour = ["♠", "♥", "♦", "♣"];

    for (let i = 0; i < 2; i++){
        for (let j = 0; j < colour.length; j++){
            for (let k = 0; k < values.length; k++){
                let card = {
                    value: values[k],
                    display: values[k] + colour[j]
                };
                deck.push(card);
            }
        }
    }
}

function hitCard(){
    let rndIndex = Math.floor(Math.random() * deck.length);
    let pickedCard = deck[rndIndex];

    deck.splice(rndIndex, 1);
    return pickedCard;
}


function betAllIn(){
    bet(balance);
}

function bet(amount){
    if (amount > balance){
        document.getElementById("messageText").innerText = "Nemáte dostatek peněz na tuto sázku!";
        return;
    }

    balance = balance - amount;
    currentBet = amount;
    document.getElementById("balanceText").innerText = balance;
    document.getElementById("betText").innerText = currentBet;
    document.getElementById("messageText").innerText = "Hit nebo Stand?";

    setBetButtons(true);

    createDeck();

    if(goal <= 19){
        playerCards.push(hitCard());
        dealerCards.push(hitCard());
        dealerCards.push(hitCard());
        dealersHidden = true;
    }else{
        playerCards.push(hitCard());
        playerCards.push(hitCard());
        dealerCards.push(hitCard());
        dealerCards.push(hitCard());
        dealersHidden = true;
    }

    updateDisplay();

    document.getElementById("btnNextCard").disabled = false;
    document.getElementById("btnStand").disabled = false;
    document.getElementById("btnDouble").disabled = false;

    checkPlayerState();
}

function sumCounter(cards){
    let sum = 0;
    let aceCount = 0;

    for(let i = 0; i < cards.length; i++){
        let h = cards[i].value;

        if (h === "J" || h === "Q" || h === "K") {
            sum = sum + 10;
        } else if (h === "A") {
            sum = sum + 11;
            aceCount = aceCount + 1;
        } else {
            sum = sum + Number(h);
        }
    }

    while(sum > goal && aceCount > 0){
        sum = sum - 10;
        aceCount = aceCount - 1;
    }

    return sum;
}

function nextCard(){
    playerCards.push(hitCard());
    updateDisplay();
    checkPlayerState();
}

function checkPlayerState(){
    let playerSum = sumCounter(playerCards);

    if (playerSum === goal && playerCards.length === leastCardsBJ){
        dealersHidden = false;
        updateDisplay();

        let win = currentBet + (currentBet * 1.5);
        balance = balance + win;

        document.getElementById("messageText").innerText =
            "BLACK JACK. Dosáhl jsi cíle " + goal + " na nejmenší počet karet (" + leastCardsBJ + "). Výhra: " + win + " Kč";
        endRound();
        return;
    }

    if(playerSum > goal){
        dealersHidden  = false;
        updateDisplay();

        document.getElementById("messageText").innerText =
            "BUST! Ty jsi kopyto xd. Přestřelil jsi cíl o " + (playerSum - goal) + ".";

        endRound();
        return;
    }

    if(playerSum === goal){
        stand();
    }
}

function stand(){
    dealersHidden = false;

    while(sumCounter(dealerCards) < (goal - 4) ){
        dealerCards.push(hitCard());
    }

    updateDisplay();

    let playerSum = sumCounter(playerCards);
    let dealerSum = sumCounter(dealerCards);
    let win = 0;

    if(dealerSum > goal){
        win = currentBet * 2;
        balance = balance + win;
        document.getElementById("messageText").innerText =
            "Dealer přestřelil cíl o " + (dealerSum - goal) + ". Výhra: " + win + " Kč";
    } else if(playerSum > dealerSum){
        win = currentBet * 2;
        balance = balance + win;
        document.getElementById("messageText").innerText =
            "Pěkně Šéfe! Jsi blíž k cíli než dealer. Výhra: " + win + " Kč";
    }else if(dealerSum > playerSum){
        document.getElementById("messageText").innerText =
            "HAHAHAHA ty lopato, dealer vyhrál (byl blíž k cíli). Prohrál jsi " + currentBet + " Kč";
    }else{
        balance = balance + currentBet;
        document.getElementById("messageText").innerText =
            "PUSH! Chytej svých " + currentBet + "Kč (tvoje sázka)";
    }

    endRound();
}

function double(){
    if(currentBet * 2 > balance){
        document.getElementById("messageText").innerText = "Nemáš dostatek finančních prostředků.";
        document.getElementById("btnDouble").disabled = true;
    }else{
        currentBet = currentBet * 2;
        nextCard();
        stand();
    }
}

function updateDisplay(){
    let playerText = "";

    for(let i = 0; i < playerCards.length; i++){
        playerText = playerText +  playerCards[i].display + "  ";
    }

    document.getElementById("playerCardsText").innerText = playerText;
    document.getElementById("playerSumText").innerText = sumCounter(playerCards);

    if(dealersHidden === true){
        document.getElementById("dealerCardsText").innerText = dealerCards[0].display + "  [?]";
        document.getElementById("dealerSumText").innerText = sumCounter([dealerCards[0]]) + " + ?";
    } else {
        let dealerText = "";
        for (let i = 0; i < dealerCards.length; i++){
            dealerText = dealerText + dealerCards[i].display + "  ";
        }
        document.getElementById("dealerCardsText").innerText = dealerText;
        document.getElementById("dealerSumText").innerText = sumCounter(dealerCards);
    }
}

function endRound(disable){
    document.getElementById("balanceText").innerText = balance;
    document.getElementById("btnNextCard").disabled = true;
    document.getElementById("btnStand").disabled = true;
    document.getElementById("btnDouble").disabled = true;
    document.getElementById("btnNewRound").disabled = false;
}

function setBetButtons(disable){
    document.getElementById("btn10").disabled = disable;
    document.getElementById("btn20").disabled = disable;
    document.getElementById("btn50").disabled = disable;
    document.getElementById("btn100").disabled = disable;
    document.getElementById("btn200").disabled = disable;
    document.getElementById("btnAllIn").disabled = disable;
}

setNewRound();
