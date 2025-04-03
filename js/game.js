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

    

    function addPoints(points) {
        browniePoints += points;
        renderObjects();
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
    }


    // function addPointsPerSecond(addPointsPerSecond) {
    //     pointsPerSecond += addPointsPerSecond;
    //     renderObjects();
    //     return pointsPerSecond;
    // }

    // function removePointsPerSecond(removePointsPerSecond) {
    //     pointsPerSecond -= removePointsPerSecond;
    //     renderObjects();
    //     return pointsPerSecond;
    // }



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




    /* Store objects */
    let storeItems = {
        "auto-clicker": {
            "amount": 0,
            "cost": 100,
            "costFactor": 1.2,
            "baseMultiplier": 0.1,
            "upgradeMultiplier": 1,
            "bpps": 0.0
        }//,
        // "oven": {
        //     "amount": 0,
        //     "cost": 1000,
        //     "costFactor": 1.1,
        //     "baseMultiplier": 1.0,
        //     "upgradeMultiplier": 1,
        //     "bpps": 0.0
        // }
    };

    let storeUpgrades = {
        "cursor-boost": {
            "amount": 0,
            "cost": 10,
            "costFactor": 1.2,
            "total": 1,
            "rate": 1
        }//,
        // "auto-clicker-boost": {
        //     "amount": 0,
        //     "cost": 200,
        //     "costFactor": 1.3,
        //     "total": 1,
        //     "rate": 1.0
        // }
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
        });

        POINTS_DISPLAY.innerHTML = pointsDisplay(browniePoints);
        POINTS_PER_SECOND_DISPLAY.innerHTML = perSecondDisplay(pointsPerSecond);
    }



    function pointsDisplay(points) {
        if (points > 999999999999999) {
            return (999.999).toFixed(3) + " T";
        } else if (points > 1000000000000) {
            points /= 1000000000;
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " T";
        } else if (points > 1000000000) {
            points /= 1000000;
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " B";
        } else if (points > 1000000) {
            points /= 1000;
            points = Math.floor(points);
            points /= 1000;
            return points.toFixed(3) + " M";
        } else if (points > 1000) {
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
        } else if (perSecond > 1000000000000) {
            perSecond /= 100000000000;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " T";
        } else if (perSecond > 1000000000) {
            perSecond /= 100000000;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " B";
        } else if (perSecond > 1000000) {
            perSecond /= 100000;
            perSecond = Math.floor(perSecond);
            perSecond /= 10;
            return perSecond.toFixed(1) + " M";
        } else if (perSecond > 1000) {
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

    const CURSOR_BOOST = document.querySelector(".store-section .upgrade-container.cursor-boost");
    function cursorBoostPurchase() {
        let upgrade = storeUpgrades["cursor-boost"];
        upgrade.total += upgrade.rate;
        upgrade.rate++;
    }
    CURSOR_BOOST.addEventListener("click", () => clickStoreItem("cursor-boost", cursorBoostPurchase));



    const AUTO_CLICKER = document.querySelector(".store-section .item-container.auto-clicker");
    function autoClickerPurchase() {
        // addPointsPerSecond(0.1);
        // let item = storeItems["auto-clicker"];
        // item.

        // calculatePoints
    }
    AUTO_CLICKER.addEventListener("click", () => clickStoreItem("auto-clicker", autoClickerPurchase));





// })();