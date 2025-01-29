//global player balance
var balanceElement = document.getElementById("balanceAmount");
var balanceNum = parseFloat(balanceElement.innerHTML);

//amount of each purchasable
var pchables = [0, 0, 0, 1];

//base rates and costs of purchasables
var standardPchablesPrice = [-0.5, -5, -1, -50];
var standardPchablesAmts = [1, 20, 100, 1];

//current cost and amounts for purchasables (altered by bulk buttons)
var currentPchablesPrice = [-0.5, -5, -1, -50]; //gets updated every purchase press
var currentPchablesAmts = [1, 20, 100, 1];

function purchaseButtonClicked(callingButton) {
    console.log("purchase button: " + callingButton);

    if (updateBalance(currentPchablesPrice[callingButton - 1])) {
        var amountOwned = document.getElementById("amountOwned" + callingButton);
        var buff = parseInt(amountOwned.innerHTML);
        buff += currentPchablesAmts[callingButton - 1];
        amountOwned.innerHTML = buff;
        pchables[callingButton - 1] += currentPchablesAmts[callingButton - 1];
    }
}

function bulkBuyButtonClicked(callingFrom, amountSelected) {
    //find the button that was clicked
    var find = findActiveButton(callingFrom, amountSelected);
    var activeButton = find.activeButton;
    var type = find.type;

    //this changes the price and amounts backend
    updatePrice(callingFrom, amountSelected);
    document.getElementById(type + "Price").innerHTML = '$' + Math.abs(currentPchablesPrice[callingFrom - 1]);

    //this is the toggle for the buttons
    var buttons = document.querySelectorAll('[id^="' + type + '"][id$="Button"]');
    for (var i = 0; i < buttons.length; i++) {
        if (activeButton === buttons[i].id) {
            buttons[i].className = "bulkBuyButtonActive";
        } else {
            buttons[i].className = "bulkBuyButton";
        }
    }
}

//updates the price in backend
function updatePrice(calling, amount) {
    currentPchablesPrice[calling - 1] = standardPchablesPrice[calling - 1] * amount;
    currentPchablesAmts[calling - 1] = standardPchablesAmts[calling - 1] * amount;
}

//finds active bulkBuy button
function findActiveButton(callingFrom, amountSelected) {
    var activeButton, type, amount;
    switch (callingFrom) {
        case 1:
            activeButton = "lemons";
            break;
        case 2:
            activeButton = "sugar";
            break;
        case 3:
            activeButton = "ice";
            break;
    }
    type = activeButton;

    switch (amountSelected) {
        case 1:
            activeButton += "1xButton";
            break;
        case 5:
            activeButton += "5xButton";
            break;
        case 10:
            activeButton += "10xButton";
            break;
    }
    return {activeButton, type};
}

//updates the player's balance
function updateBalance(change) {
    if (!(balanceNum + change >= 0)) {
        return false; //insufficient funds
    } else {
        balanceNum += change;
        balanceElement.innerHTML = balanceNum.toFixed(2);
        return true;
    }
}

//calculation for lemonadeStand (calculates for number of stands)
function lemonadeCalculation() {
    var numStands = pchables[3];
    var total = 0;

    console.clear();

    for (var i = 0; i < numStands; i++) {
        var tuff;
        tuff = lemonadeCalculationHelper();
        total += tuff;
    }

    console.log("total:" + total);
    updateBalance(total);
}

//helper for lemonadeStand calculation (calculates individual stand performance)
function lemonadeCalculationHelper() {
    // calculate revenue
    var numLemons = pchables[0];
    var numSugar = pchables[1];
    var numIce = pchables[2];

    //lemons
    var numUsed;
    if (numLemons === 0) {
        numUsed = 0;
    } else if (numLemons > 20) {
        numUsed = Math.floor((Math.random() * 20)) + 1;    
    } else {
        numUsed = Math.floor((Math.random() * numLemons)) + 1;
    }
    numLemons -= numUsed;
    pchables[0] = numLemons;

    //sugar
    var sugarRate = 0.5;
    if (numUsed > numSugar) {
        //more lemons used than sugar available
        //use all the sugar
        sugarRate = numSugar * sugarRate;
        numSugar = 0;
    } else {
        //more sugar (or equal parts) use sugar up to num used
        sugarRate = numUsed * sugarRate;
        numSugar -= numUsed;
    }
    pchables[1] = numSugar;

    //ice
    var iceRate = 0.25;

    if (numUsed > (numIce / 4)) {
        //more lemons than ice (4 ice cubes per)
        //use all ice
        iceRate = (numIce / 4) * iceRate;
        numIce = 0;
    } else {
        //more ice than lemons
        iceRate = numUsed * iceRate;
        numIce -= (numUsed * 4);
    }
    pchables[2] = numIce;

    console.log("numUsed: " + numUsed);
    console.log("sugarRate: " + sugarRate);
    console.log("iceRate: " + iceRate);

    document.getElementById("amountOwned1").innerHTML = numLemons;
    document.getElementById("amountOwned2").innerHTML = numSugar;
    document.getElementById("amountOwned3").innerHTML = numIce;

    return numUsed + sugarRate + iceRate;
}

//driver for progression
function nextDay() {
    lemonadeCalculation();


    if (document.getElementById("balanceAmount").innerHTML == '0' && document.getElementById("amountOwned1").innerHTML == '0') {
        if (window.confirm("You are bankrupt!\nRestart?")) {
            window.location.reload();
        }
    }
    document.getElementById("dayNumber").innerHTML++;
}

//100 ice cubes / dollar
//20 sugar packs / 5 dollars (4 / dollar)
//1 stand for 50 dollars, can expand infinitely
//in the future, will have to refactor to accomodate other businesses
