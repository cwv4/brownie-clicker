/* Window Resize */
const FIRST_PURCHASES_SECTION = document.querySelector("#first-purchases-section");
const SECOND_PURCHASES_SECTION = document.querySelector("#second-purchases-section");

function windowResize() {
	if (window.innerWidth < 800) {
		FIRST_PURCHASES_SECTION.classList.add("inactive");
		FIRST_PURCHASES_SECTION.classList.remove("active");
		SECOND_PURCHASES_SECTION.classList.add("active");
		SECOND_PURCHASES_SECTION.classList.remove("inactive");
	} else {
		FIRST_PURCHASES_SECTION.classList.add("active");
		FIRST_PURCHASES_SECTION.classList.remove("inactive");
		SECOND_PURCHASES_SECTION.classList.add("inactive");
		SECOND_PURCHASES_SECTION.classList.remove("active");
	}
}

window.onresize = windowResize;

windowResize();



/* Mobile animation */
const BROWNIE = document.querySelector("#click-brownie");

function moveBrownieOnClick() {
    BROWNIE.classList.remove("mobile-click");
    
    BROWNIE.classList.add("mobile-click");
    console.log("Here");
}

BROWNIE.addEventListener("click", () => BROWNIE.classList.add("mobile-click"));
BROWNIE.addEventListener("animationend", () => BROWNIE.classList.remove("mobile-click"));




/* Game closure */
// (function() {

    /* Total points */
    let browniePoints = 0;
    let won = false;

    

    function addPoints(points) {
        browniePoints += points;
        renderObjects();

        if (browniePoints >= 1000000000000000 && won == false) {
            won = true;
            document.querySelector("span.stopwatch").innerHTML = timerDisplay(seconds);
            document.querySelector(".win-container").classList.remove("no-win");
        }

        return browniePoints;
    }

    function removePoints(points) {
        browniePoints -= points;
        renderObjects();
        return browniePoints;
    }

    function attemptPurchase(points) {
        if (points > browniePoints) {
            return null;
        }

        return removePoints(points);
    }




    /* Click Brownie */
    function clickBrownie() {
        let clickMultiplier = storeUpgrades['cursor-boost'].total;
        addPoints(clickMultiplier);
    }

    BROWNIE.addEventListener("click", clickBrownie);





    /* Points per second */
    
    let pointsPerSecond = 0.0;

    function calculatePointsPerSecond() {
        pointsPerSecond = 0.0;
        let itemsKeys = Object.keys(storeItems);

        itemsKeys.forEach((key) => {
            let item = storeItems[key];
            let bpps = item.amount * item.baseMultiplier * item.upgradeMultiplier;
            item.bpps = bpps;
            pointsPerSecond += bpps;
        });

        pointsPerSecond += storeUpgrades["excelerator"].total;
    }



    /* Points per second calculation and interval setting */
    let currentPointFractions = 0.0;

    function browniePointsPerSecondCalc() {
        let gainedPoints = pointsPerSecond / 20;
        currentPointFractions += gainedPoints;

        let wholePoints = Math.floor(currentPointFractions);
        currentPointFractions -= wholePoints;
        addPoints(wholePoints);
    }

    setInterval(browniePointsPerSecondCalc, 50);



    /* Timer display */
    let seconds = 0;

    setInterval(() => seconds++, 1000);

    function timerDisplay(seconds) {
        let hours, minutes, displaySeconds = 0;
        let display = "";

        if (seconds >= 3600) {
            hours = Math.floor(seconds / 3600);
            display = String(hours) + "h ";
        }

        if (seconds >= 60) {
            minutes = Math.floor((seconds % 3600) / 60);
            display += String(minutes).padStart(2, "0") + "m ";
        }

        displaySeconds = seconds % 60;

        display += String(displaySeconds).padStart(2, "0") + "s";
        console.log(display);
        return display;
    }



    /* Store objects */
    let storeItems = {
        "auto-clicker": {
            "amount": 0,
            "cost": 100,
            "costFactor": 1.2,
            "baseMultiplier": 0.2,
            "upgradeMultiplier": 1,
            "bpps": 0.0
        },
        "oven-tronic": {
            "amount": 0,
            "cost": 5000,
            "costFactor": 1.4,
            "baseMultiplier": 10.0,
            "upgradeMultiplier": 1,
            "bpps": 0.0
        },
        "brownie-elf": {
            "amount": 0,
            "cost": 100000,
            "costFactor": 1.4,
            "baseMultiplier": 10000.0,
            "upgradeMultiplier": 1,
            "bpps": 0.0
        }
    };

    let storeUpgrades = {
        "cursor-boost": {
            "amount": 0,
            "cost": 10,
            "costFactor": 1.45,
            "total": 1,
            "rate": 1.4
        },
        "mega-clicker": {
            "amount": 0,
            "cost": 1000,
            "costFactor": 2.1,
            "total": 1,
            "rate": 2
        },
        "double-door": {
            "amount": 0,
            "cost": 10000,
            "costFactor": 1.35,
            "total": 1,
            "rate": 1.4
        },
        "caffeine-kick": {
            "amount": 0,
            "cost": 1000000,
            "costFactor": 2.5,
            "total": 1,
            "rate": 1.2
        },
        "more-chocolate": {
            "amount": 0,
            "cost": 1000000,
            "costFactor": 3.0,
            "total": 1,
            "rate": 2.0
        },
        "excelerator": {
            "amount": 0,
            "cost": 100000000,
            "costFactor": 3.0,
            "total": 0.0,
            "rate": 0.005
        }
    };





    /* General store event listener */
    function clickStoreItem(key, purchaseBehaviorFunction) {
        let storeObject;

        if (Object.keys(storeItems).includes(key)) {
            storeObject = storeItems[key];
        } else if (Object.keys(storeUpgrades).includes(key)) {
            storeObject = storeUpgrades[key];
        } else {
            console.error("clickStoreItem() does not recognize key: " + key);
            return;
        }

        if (attemptPurchase(storeObject.cost) != null) {
            storeObject.amount++;

            if (storeObject.cost >= 1000000 && storeObject.cost <= 1000000000 && key != "cursor-boost") {
                storeObject.costFactor += 0.5;
            }

            storeObject.cost = Math.floor(storeObject.cost * storeObject.costFactor);



            purchaseBehaviorFunction();

            calculatePointsPerSecond();

            renderObjects();
        }
    }


    const POINTS_DISPLAY = document.querySelector("#points-holder");
    const POINTS_PER_SECOND_DISPLAY = document.querySelector("#bpps-value");


    function renderObjects() {
        let itemsKeys = Object.keys(storeItems);

        itemsKeys.forEach((key) => {
            let item = storeItems[key];
            let purchasesSelector = ".purchases-section.active .item-container." + key + " span." + key;
            document.querySelector(purchasesSelector + "-amount").innerHTML = item.amount;
            document.querySelector(purchasesSelector + "-bpps").innerHTML = perSecondDisplay(item.bpps);
            if (item.amount > 0) {
                document.querySelector(purchasesSelector + "-amount").parentNode.parentNode.classList.remove("empty");
            }

            let storeSelector = ".store-section .item-container." + key + " span." + key;
            document.querySelector(storeSelector + "-cost").innerHTML = pointsDisplay(item.cost);
            document.querySelector(storeSelector + "-each").innerHTML = perSecondDisplay(item.baseMultiplier * item.upgradeMultiplier);
            if (browniePoints < item.cost) {
                document.querySelector(storeSelector + "-cost").parentNode.parentNode.classList.add("empty");
            } else {
                document.querySelector(storeSelector + "-cost").parentNode.parentNode.classList.remove("empty");
            }
        });

        let upgradeKeys = Object.keys(storeUpgrades);

        upgradeKeys.forEach((key) => {
            let upgrade = storeUpgrades[key];
            let purchasesSelector = ".purchases-section.active .upgrade-container." + key + " span." + key;
            document.querySelector(purchasesSelector + "-amount").innerHTML = upgrade.amount;
            document.querySelector(purchasesSelector + "-total").innerHTML = perSecondDisplay(upgrade.total);
            if (upgrade.amount > 0) {
                document.querySelector(purchasesSelector + "-amount").parentNode.parentNode.classList.remove("empty");
            }

            let storeSelector = ".store-section .upgrade-container." + key + " span." + key;
            document.querySelector(storeSelector + "-cost").innerHTML = pointsDisplay(upgrade.cost);
            document.querySelector(storeSelector + "-rate").innerHTML = perSecondDisplay(upgrade.rate);
            if (browniePoints < upgrade.cost) {
                document.querySelector(storeSelector + "-cost").parentNode.parentNode.classList.add("empty");
            } else {
                document.querySelector(storeSelector + "-cost").parentNode.parentNode.classList.remove("empty");
            }
        });

        POINTS_DISPLAY.innerHTML = pointsDisplay(browniePoints);
        POINTS_PER_SECOND_DISPLAY.innerHTML = perSecondDisplay(pointsPerSecond);
    }



    function pointsDisplay(points) {
        if (points > 999999999999999) {
            return (999.999).toFixed(3) + " T";
        } else if (points >= 1000000000000) {
            points /= 1000000000;
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " T";
        } else if (points >= 1000000000) {
            points /= 1000000;
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " B";
        } else if (points >= 1000000) {
            points /= 1000;
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " M";
        } else if (points >= 1000) {
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " K";
        } else {
            return Math.floor(points);
        }
    }

    function perSecondDisplay(perSecond) {
        if (perSecond > 999999999999999) {
            return (999.999).toFixed(3) + " T";
        } else if (perSecond >= 1000000000000) {
            perSecond /= 100000000000;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " T";
        } else if (perSecond >= 1000000000) {
            perSecond /= 100000000;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " B";
        } else if (perSecond >= 1000000) {
            perSecond /= 100000;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " M";
        } else if (perSecond >= 1000) {
            perSecond /= 100;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " K";
        } else {
            perSecond *= 10;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1);
        }
    }





    /* Specific store item implementations */


    /* Items */
    const AUTO_CLICKER = document.querySelector(".store-section .item-container.auto-clicker");
    function autoClickerPurchase() {

    }
    AUTO_CLICKER.addEventListener("click", () => clickStoreItem("auto-clicker", autoClickerPurchase));



    const OVEN_TRONIC = document.querySelector(".store-section .item-container.oven-tronic");
    function ovenTronicPurchase() {

    }
    OVEN_TRONIC.addEventListener("click", () => clickStoreItem("oven-tronic", ovenTronicPurchase));



    const BROWNIE_ELF = document.querySelector(".store-section .item-container.brownie-elf");
    function brownieElfPurchase() {

    }
    BROWNIE_ELF.addEventListener("click", () => clickStoreItem("brownie-elf", brownieElfPurchase));










    /* Upgrades */

    const CURSOR_BOOST = document.querySelector(".store-section .upgrade-container.cursor-boost");
    function cursorBoostPurchase() {
        let upgrade = storeUpgrades["cursor-boost"];
        upgrade.total *= upgrade.rate;
    }
    CURSOR_BOOST.addEventListener("click", () => clickStoreItem("cursor-boost", cursorBoostPurchase));



    const MEGA_CLICKER = document.querySelector(".store-section .upgrade-container.mega-clicker");
    function megaClickerPurchase() {
        let upgrade = storeUpgrades["mega-clicker"];
        upgrade.total *= upgrade.rate;
        storeItems["auto-clicker"].upgradeMultiplier *= upgrade.rate;
    }
    MEGA_CLICKER.addEventListener("click", () => clickStoreItem("mega-clicker", megaClickerPurchase));



    const DOUBLE_DOOR = document.querySelector(".store-section .upgrade-container.double-door");
    function doubleDoorPurchase() {
        let upgrade = storeUpgrades["double-door"];
        upgrade.total *= upgrade.rate;
        storeItems["oven-tronic"].upgradeMultiplier *= upgrade.rate;
    }
    DOUBLE_DOOR.addEventListener("click", () => clickStoreItem("double-door", doubleDoorPurchase));



    const CAFFEINE_KICK = document.querySelector(".store-section .upgrade-container.caffeine-kick");
    function caffeineKickPurchase() {
        let upgrade = storeUpgrades["caffeine-kick"];
        upgrade.total *= upgrade.rate;
        storeItems["brownie-elf"].upgradeMultiplier *= upgrade.rate;
    }
    CAFFEINE_KICK.addEventListener("click", () => clickStoreItem("caffeine-kick", caffeineKickPurchase));


    const MORE_CHOCOLATE = document.querySelector(".store-section .upgrade-container.more-chocolate");
    function moreChocolatePurchase() {
        let upgrade = storeUpgrades["more-chocolate"];
        upgrade.total *= upgrade.rate;

        Object.keys(storeItems).forEach((item) => {
            storeItems[item].upgradeMultiplier *= 2;
        });

    }
    MORE_CHOCOLATE.addEventListener("click", () => clickStoreItem("more-chocolate", moreChocolatePurchase));



    const EXCELERATOR = document.querySelector(".store-section .upgrade-container.excelerator");
    function exceleratorInterval() {
        let upgrade = storeUpgrades["excelerator"];
        upgrade.total += (pointsPerSecond - storeUpgrades["excelerator"].total) * 0.005;
        calculatePointsPerSecond();
    }
    function exceleratorPurchase() {
        setInterval(exceleratorInterval, 1000);
    }
    EXCELERATOR.addEventListener("click", () => clickStoreItem("excelerator", exceleratorPurchase));








// })();