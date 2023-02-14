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

var mode = getLSMode();

// Open Menu
function openMenu() {
    $("#open-menu").click(function () {
        $("nav").css("left", "0vw");
    })
}

// Close menu
function closeMenu() {
    $("#close-menu").click(function () {
        $("nav").css("left", "-100vw");
    })
}

// Submit params form
function submitForm() {
    $("#submit").click(function () {
        clearLS();
        closeMenu();
        var inputDays = $("#inputDays").val();
        var inputMoney = $("#inputMoney").val();
        let inputMode = $("input[name='mode']:checked").val();

        if(inputDays > 365) {
            $("#inputDays").val(365);
            inputDays = 365;
        }
        if(inputDays < 1 ) {
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
            mode = getLSMode();

            // Display district
            displayDistricts(districts_soft);

            // Display products names
            displayProductsNames(products_soft);
            displayListProductsNames(products_soft);
        } else {
            setLSMode(gameMode[0].name);
            mode = getLSMode();

            // Display district
            displayDistricts(districts);

            // Display products names
            displayProductsNames(products);
            displayListProductsNames(products);
        }

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

// End game
function end() {
    $("#popup").fadeIn();
    if (parseInt(getLSDays()) === 0) {
        clearLS();
        displayDays(0);
        $("#popup-title").text("Le mois est terminé !");
    } else if (getLSMoney() <= 2) {
        clearLS();
        $("#popup-title").text("Vous êtes à sec !");
    }
}

// Display message
function displayMessage(message) {
    $("#message").css("bottom", getRandom(100, 600) + "px");
    $("#message").css("left", getRandom(250, 800) + "px");
    $("#message").fadeIn();
    $("#message-text").text(message);
    setTimeout(function () { 
        $("#message").fadeOut();
    }, 3000);
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

function displayDistrictPanel() {
    $("#districts").slideDown();
}

// Display events div
function displayEventsPanel() {
    $("#events").slideDown();
}

// Display trade div
function displayTradePanel(district, districts) {
    let districtDomId = district.parent().attr("id");
    var districtId = districtDomId.charAt(districtDomId.length - 1);
    $("#districts").slideUp().promise().done(function () {
        displayEventsPanel()
    }).promise().done(function () {
        $("body").css("background-image", "url(" + districts[districtId].img + ")");
    });
}

// Display home button
function displayHomeButton() {
    $("#btn-home").fadeIn();
}

// Go home
function travelHome() {
    $("#btn-home").click(function () {
        if (getLSMoney() >= 2 && getLSDays() >  0) {
            setLSDays(parseInt(getLSDays()) - 1);
            displayDays(getLSDays());
            $("#events").slideUp().promise().done(function () {
                displayDistrictPanel();
                $("#btn-home").fadeOut();
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

// Pay transport
function travelDistrict(districts) {
    $(".district-content").click(function () {
        if (getLSDays() > 0 && getLSMoney() >= 2) {
            setLSMoney(getLSMoney() - transportPrice);
            displayMoney(getLSMoney());
            displayTradePanel($(this), districts);
            displayPrices();
            setTimeout(function () { displayHomeButton() }, 1000);
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

$(document).ready(function () {

    // Open Menu
    openMenu();

    // Close menu
    closeMenu();

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

    if (mode = gameMode[0].name) {
        // Move to a district
        travelDistrict(districts_soft);
    } else {
        // Move to a district
        travelDistrict(districts);
    }

    // Go back home
    travelHome();

    // Buy merch
    buy();

    // Sell merch
    sell();
});