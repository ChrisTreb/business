import {
    homeImg,
    days,
    money,
    currency,
    transportPrice,
    products,
    products_soft,
    productsOwned,
    districts,
    districts_soft,
    gameMode,
    getRandom,
    getPrices,
    getSellPrices,
    getLSDays,
    getLSMoney,
    getLSMode,
    getLSProductOwned,
    setPrices,
    setLSDays,
    setLSMoney,
    setLSMode,
    setLSProductsOwned,
    clearLS
} from "./app.js";

// Open Menu
function openMenu() {
    $("#open-menu").off().click(function () {
        $("nav").css("left", "0vw");
    })
}

// Close menu
function closeMenu() {
    $("#close-menu").off().click(function () {
        $("nav").css("left", "-100vw");
    })
}

// Close dices popup
function closeDices() {
    $("#close-dices").off().click(function () {
        $("#dices-container").fadeOut();
    })
}

// Submit params form
function submitForm() {
    $("#submit").off().click(function () {
        clearLS();
        closeMenu();
        var inputDays = $("#inputDays").val();
        var inputMoney = $("#inputMoney").val();
        let inputMode = $("input[name='mode']:checked").val();

        if (inputDays > 365) {
            $("#inputDays").val(365);
            inputDays = 365;
        }
        if (inputDays < 1) {
            $("#inputDays").val(days);
            inputDays = days;
        }
        if (inputMoney > 99999) {
            $("#inputMoney").val(99999);
            inputMoney = 99999;
        }
        if (inputMoney < 1) {
            $("#inputMoney").val(money);
            inputMoney = money;
        }

        // Travel Home
        travelHome();

        setLSProductsOwned(productsOwned);
        setLSDays(inputDays);
        setLSMoney(inputMoney);

        // Display days left
        displayDays();

        // Display money left
        displayMoney();

        // Display products owned
        displayProductsAmounts();

        if (inputMode === gameMode[0].name) {
            // Set mode
            setLSMode(gameMode[0].name);

            // Display district
            displayDistricts(districts_soft);

            // Display products names
            displayProductsNames(products_soft);
            displayListProductsNames(products_soft);
        } else {
            setLSMode(gameMode[1].name);

            // Display district
            displayDistricts(districts);

            // Display products names
            displayProductsNames(products);
            displayListProductsNames(products);
        }

        $("body").css("background-image", "url(" + homeImg + ")");
        $("#events").fadeOut();
        displayDistrictPanel();
        $("#btn-home").fadeOut();
    });
}

// Display district
function displayDistricts(d) {
    $(".district-content > p").text(function (index) {
        return (d[index].name).toUpperCase();
    });
    for (let i = 0; i < d.length; i++) {
        $("#d_" + i).css("background-image", "url(" + d[i].img + ")");
    }
}

// Display products names in event div
function displayProductsNames(products) {
    for (let i = 0; i < products.length; i++) {
        $("#p_" + i).text(products[i].name);
    }
}

// Display products names in list
function displayListProductsNames(products) {
    for (let i = 0; i < products.length; i++) {
        $("#i_" + i + " > .name").text(products[i].name);
    }
}

// Display days in calendar div
function displayDays() {
    $("#days").text(getLSDays());
}

// Display money in money div
function displayMoney() {
    $("#money").text(getLSMoney() + currency);
}

// Display products owned
function displayProductsAmounts() {
    var productsTemp = getLSProductOwned();
    for (let i = 0; i < products.length; i++) {
        $("#p_" + i + "_amount").text(productsTemp[i].amount);
    }
}

// Display prices
function displayPrices() {
    setPrices();
    let arrPrices = getPrices();
    let arrSellPrices = getSellPrices();
    for (let i = 0; i < arrPrices.length; i++) {

        if (arrPrices[i] > arrSellPrices[i]) {
            $("#buy_" + i).text(arrPrices[i] + currency).css("color", "black");
            $("#b_" + i).css("visibility", "visible");
        }
        if (arrPrices[i] <= arrSellPrices[i]) {
            $("#b_" + i).css("visibility", "hidden");
            $("#buy_" + i).text("OUT").css("color", "#E75450");
        }
    }
    displaySellPrices();
}

// Display sell prices
function displaySellPrices() {
    let arrPrices = getSellPrices();
    for (let i = 0; i < arrPrices.length; i++) {
        $("#sell_" + i).text(arrPrices[i] + currency);
    }
}

// Display district panel
function displayDistrictPanel() {
    $("#districts").slideDown();
}

// Display events div
function displayEventsPanel() {
    $("#events").slideDown();
}

// Display trade div
function displayTradePanel(district) {
    let districtDomId = district.parent().attr("id");
    var districtId = districtDomId.charAt(districtDomId.length - 1);
    $("#districts").slideUp().promise().done(function () {
        displayEventsPanel()
    }).promise().done(function () {
        if (getLSMode() === gameMode[0].name) {
            $("body").css("background-image", "url(" + districts_soft[districtId].img + ")");
        } else {
            $("body").css("background-image", "url(" + districts[districtId].img + ")");
        }

    });
}

// Display home button
function displayHomeButton() {
    $("#btn-home").fadeIn();
}

// Go home, pay bus ticket
function travelHome() {
    $("#btn-home").off().click(function () {
        if (getLSMoney() >= 2 && getLSDays() > 0) {

            // Random event
            createRandomEvent();
            let days = parseInt(getLSDays());
            setLSDays(days - 1);
            displayDays(getLSDays());
            $("#events").slideUp().promise().done(function () {
                displayDistrictPanel();
                $("#btn-home").fadeOut();
                displayMessage("Tu prends le bus pour rentrer, - " + transportPrice + currency + " Bonne nuit !");
                setLSMoney(getLSMoney() - transportPrice);
            }).promise().done(function () {
                $("body").css("background-image", "url(" + homeImg + ")");
                displayMoney(getLSMoney());
            });
        } else {
            end();
        }
    });
}

// Take bus to a district
function travelDistrict() {
    $(".district-content").off().click(function () {
        if (getLSDays() > 0 && getLSMoney() >= 2) {

            // Random event
            createRandomEvent();
            displayMessage("Tu prends le bus, - " + transportPrice + currency + " Au travail !");
            setLSMoney(getLSMoney() - transportPrice);
            displayMoney(getLSMoney());
            displayTradePanel($(this));
            displayPrices();
            setTimeout(function () { displayHomeButton() }, 1000);
            for (let i = 0; i < products.length; i++) {
                // Display sell options
                $("#s_" + i).fadeIn(200);
                $("#sell_" + i).fadeIn(200);
            }
        } else {
            // End Game
            end();
        }
    });
}

// Buy items
function buy() {
    $(".buy").click(function () {
        // Id
        let id = $(this).attr("id");
        id = id.charAt(id.length - 1);
        if (getLSMoney() >= getPrices()[id]) {
            // Remove sell options
            $("#s_" + id).fadeOut(200);
            $("#sell_" + id).fadeOut(200);
            // Products
            let p = getLSProductOwned();
            let upd_obj = p.findIndex((obj => obj.id == id));
            p[upd_obj].amount = p[upd_obj].amount + 1;
            setLSProductsOwned(p);
            displayProductsAmounts();
            // Money 
            let money = getLSMoney();
            money = money - getPrices()[id];
            setLSMoney(money);
            displayMoney();
        } else {
            displayMessage("Tu n'as pas assez d'argent !");
        }
    });
}

// Sell items
function sell() {
    $(".sell").click(function () {
        // Id
        let id = $(this).attr("id");
        id = id.charAt(id.length - 1);
        // Products
        let p = getLSProductOwned();
        let upd_obj = p.findIndex((obj => obj.id == id));
        if (p[upd_obj].amount > 0) {
            p[upd_obj].amount = p[upd_obj].amount - 1;
            setLSProductsOwned(p);
            displayProductsAmounts();
            // Money 
            let money = getLSMoney();
            money = parseInt(money) + parseInt(getSellPrices()[id]);
            setLSMoney(money);
            displayMoney();
        } else {
            displayMessage("Tu n'as rien à vendre...");
        }
    });
}

// End game
function end() {
    $("#popup").fadeIn();
    if (parseInt(getLSDays()) === 0) {
        clearLS();
        displayDays(0);
        $("#popup-title").text("Le temps alloué est écoulé !");
    } else if (getLSMoney() <= 2) {
        clearLS();
        $("#popup-title").text("Vous êtes à sec !");
    }
}

// Display message
function displayMessage(message) {
    $("#message").fadeIn();
    $("#message-text").text(message);
    setTimeout(function () {
        $("#message").fadeOut();
    }, 1000);
}

// Display dices container
function displayEvent(num, text) {
    $(".dices-text").text(num);
    $("#event-text").text(text);
    setTimeout(function () {
        $(".dices-text").fadeIn();
    }, 1000);
    $("#dices-container").fadeIn();
    setTimeout(function () {
        $("#event-text").fadeIn();
    }, 2000);
}

// Create random event
function createRandomEvent() {

    let rng = getRandom(1, 12);

    if (rng === 6) {
        displayEvent(rng, "Lucky ! You found 100 € in the bus");
        setLSMoney(parseInt(getLSMoney()) + 100);
        displayMoney();
    } else if(rng === 9 && (getLSMoney() > 150)) {
        displayEvent(rng, "Damn ! A pickpocket stole 100 €");
        setLSMoney(parseInt(getLSMoney()) - 100);
        displayMoney();
    }
}

//----------------------------------------
// READY FUNCTION !!!!!!!!!!!!! ----------
//----------------------------------------

$(document).ready(function () {

    // Open Menu
    openMenu();

    // Close menu
    closeMenu();

    // Close dices popup
    closeDices();

    // Submit params form
    submitForm();

    // Display district
    displayDistricts(districts_soft);

    // Display products names
    displayProductsNames(products_soft);
    displayListProductsNames(products_soft);

    // Display days left
    displayDays();

    // Display money left
    displayMoney();

    // Display products owned
    displayProductsAmounts();

    // Move to a district
    travelDistrict();

    // Go back home
    travelHome();

    // Buy merch
    buy();

    // Sell merch
    sell();
});