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

