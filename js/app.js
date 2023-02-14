// Initial sum
const money = 1000;

// Days in a month
const days = 30;

// Mode
const gameMode =  [{id: 0, name: "soft"}, {id: 1, name: "hardcore"}];

// Currency
const currency = " €";

// Transport price
const transportPrice = 2;

// Home image
const homeImg = "../img/home.jpg";

// Cops raid 
const bust = 0;

// Districts 
const districts = [
    {id: 0, name: "Kerangoff", img: "../img/Brest/Kerang.jpg"},
    {id: 1, name: "Kerourien", img: "../img/Brest/Kerour.jpg"},
    {id: 2, name: "Pontanézen", img: "../img/Brest/Ponta.jpg"},
    {id: 3, name: "Queliverzan", img: "../img/Brest/Queli.jpg"},
    {id: 4, name: "Bellevue", img: "../img/Brest/Bellevue.jpg"},
    {id: 5, name: "Lambezellec", img: "../img/Brest/Lambez.jpg"}, 
];

const districts_soft = [
    {id: 0, name: "Manhattan", img: "../img/Nyc/Manhattan.jpg"},
    {id: 1, name: "Brooklyn", img: "../img/Nyc/Brooklyn.jpg"},
    {id: 2, name: "Queens", img: "../img/Nyc/Queens.jpg"},
    {id: 3, name: "Bronx", img: "../img/Nyc/Bronx.jpg"},
    {id: 4, name: "Staten Island", img: "../img/Nyc/Staten-island.jpg"},
    {id: 5, name: "New Jersey", img: "../img/Nyc/New-jersey.jpg"}, 
];

// Products
const products = [
    {id: 0, name: "Cigs", min: 3, max: 8},
    {id: 1, name: "Wee-wee", min: 10, max: 30},
    {id: 2, name: "Acid", min: 15, max: 45},
    {id: 3, name: "Peyoyo", min: 20, max: 40},
    {id: 4, name: "Herowine" , min: 30, max: 60},
    {id: 5, name: "Crackitos", min: 50, max: 80},
    {id: 6, name: "Cockrane" , min: 70, max: 150},
    {id: 7, name: "Mr. Meth" , min: 200, max: 350}
];

const products_soft = [
    {id: 0, name: "Croissants", min: 3, max: 8},
    {id: 1, name: "Paris Brest", min: 10, max: 30},
    {id: 2, name: "Macarons", min: 15, max: 45},
    {id: 3, name: "Fraisier", min: 20, max: 40},
    {id: 4, name: "Fôret noire" , min: 30, max: 60},
    {id: 5, name: "Saint Honoré", min: 50, max: 80},
    {id: 6, name: "Cake design" , min: 70, max: 150},
    {id: 7, name: "Pièce montée" , min: 200, max: 350}
];

// Init products owned
const productsOwned = [
    {id: 0, amount: 10},
    {id: 1, amount: 0},
    {id: 2, amount: 0},
    {id: 3, amount: 0},
    {id: 4, amount: 0},
    {id: 5, amount: 0},
    {id: 6, amount: 0},
    {id: 7, amount: 0}
];

/* LOCALSTORAGE FUNCTIONS */
function setLSMoney(amount) {
    localStorage.setItem("money", amount);
}

function setLSDays(days) {
    localStorage.setItem("days", days);
}

function setLSMode(mode) {
    localStorage.setItem("mode", mode);
}

function setLSProductsOwned(productsOwned) {
    localStorage.setItem("products", JSON.stringify(productsOwned));
}

function getLSMoney() {
    return localStorage.getItem("money");
}

function getLSDays() {
    return localStorage.getItem("days");
}

function getLSMode() {
    return localStorage.getItem("mode");
}

function getLSProductOwned() {
    return JSON.parse(localStorage.getItem("products"));
}

function clearLS() {
    localStorage.clear();
}

function setInitProductsOwned(productsOwned) {
    localStorage.setItem("products", JSON.stringify(productsOwned));
}

// Set sell prices in LS
function setSellPrices() {
    let sellPrices = getPrices();
    for(let i=0; i < sellPrices.length; i++) {
        sellPrices[i] = Math.floor(sellPrices[i] + sellPrices[i] * (getRandom(-50, 50) / 100));
    }
    localStorage.setItem("sellPrices", JSON.stringify(sellPrices));
}

// Get sell prices from LS
function getSellPrices() {
    return JSON.parse(localStorage.getItem("sellPrices"));
}

// Generate random prices for a selected district
function setPrices() {

    var arrDistrictPrices = [];
    // For each product 
    products.forEach(product => {
        arrDistrictPrices.push(setNormalPrices(product.id));
    });
    localStorage.setItem("prices", JSON.stringify(arrDistrictPrices));
    setSellPrices();
}

// Get prices from localstorage
function getPrices() {
    return JSON.parse(localStorage.getItem("prices"));
}

/* INIT LOCALSTORAGE */

setLSMoney(money);
setLSDays(days);
setLSMode(gameMode[0].name);
setInitProductsOwned(productsOwned);
setPrices();
localStorage.setItem("bust", bust);

// Give a random price between min and max value for a product
function setNormalPrices(id) {
    return getRandom(products[id].min, products[id].max);
}

// Get a random number between min and max value
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * TODO
 * function bust get prices
 * function random events (cops, concurrence, steal, bad dope, find hidden dope)
 * function loose end game
 * function reset
 * function win end game
 * function disable buttons if you buy you can't sell
 */

export {
    setLSDays,
    setLSMoney,
    setLSMode,
    setLSProductsOwned,
    getLSDays,
    getLSMoney,
    getLSMode,
    getLSProductOwned,
    clearLS,
    setNormalPrices, 
    getRandom, 
    setPrices,
    getPrices,
    getSellPrices,
    homeImg,
    days,
    money,
    currency, 
    transportPrice,
    districts,
    districts_soft,
    products,
    products_soft,
    productsOwned,
    gameMode
};
