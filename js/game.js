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

    const POINTS_DISPLAY = document.querySelector("#points-holder");

    function addPoints(points) {
        browniePoints += points;
        POINTS_DISPLAY.innerHTML = browniePoints;
        return browniePoints;
    }

    function removePoints(points) {
        browniePoints -= points;
        POINTS_DISPLAY.innerHTML = browniePoints;
        return browniePoints;
    }

    function attemptPurchase(points) {
        if (points > browniePoints) {
            return null;
        }

        return removePoints(points);
    }




    /* Click Brownie */
    let clickMultiplier = 1;

    function clickBrownie() {
        addPoints(clickMultiplier);
    }

    BROWNIE.addEventListener("click", clickBrownie);





    /* Points per second */
    POINTS_PER_SECOND_DISPLAY = document.querySelector(".bpps-value");
    let pointsPerSecond = 0.0;


    function addPointsPerSecond(addPointsPerSecond) {
        pointsPerSecond += addPointsPerSecond;
        POINTS_PER_SECOND_DISPLAY.innerHTML = pointsPerSecond.toFixed(1);
        return pointsPerSecond;
    }

    function removePointsPerSecond(removePointsPerSecond) {
        pointsPerSecond -= removePointsPerSecond;
        POINTS_PER_SECOND_DISPLAY.innerHTML = pointsPerSecond.toFixed(1);
        return pointsPerSecond;
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




    /* Store objects */
    let storeItems = {
        "auto-clicker": {
            "amount": 0,
            "cost": 100,
            "costFactor": 1.2,
            "baseMultiplier": 0.1,
            "upgradeMultiplier": 1,
            "bpps": 0.0
        },
        "oven": {
            "amount": 0,
            "cost": 1000,
            "costFactor": 1.1,
            "baseMultiplier": 1.0,
            "upgradeMultiplier": 1,
            "bpps": 0.0
        }
    };

    let storeUpgrades = {
        "cursor-boost": {
            "amount": 0,
            "cost": 10,
            "costFactor": 1.2
        },
        "auto-clicker-boost": {
            "amount": 0,
            "cost": 200,
            "costFactor": 1.3
        }
    };





    /* General store event listener */
    function clickStoreItem(itemStr, purchaseBehaviorFunction) {
        let storeObject;

        if (Object.keys(storeItems).includes(itemStr)) {
            storeObject = storeItems[itemStr];
        } else {
            storeObject = storeUpgrades[itemStr];
        }

        // let costSpan = document.querySelector(".store-section span." + itemStr + "-cost");
        // let amountSpan = document.querySelector(".purchases-section.active span." + itemStr + "-amount");

        if (attemptPurchase(storeObject.cost) != null) {
            storeObject.amount++;
            // amountSpan.parentNode.parentNode.classList.remove("empty");

            storeObject.cost *= storeObject.costFactor;
            // costSpan.innerHTML = parseInt(cost);

            purchaseBehaviorFunction();

            renderObjects();
        }
    }



    function renderObjects() {
        // I was here
    }




    /* Specific store item implementations */

    const CURSOR_BOOST = document.querySelector(".store-section .upgrade-container.cursor-boost");
    function cursorBoostPurchase() {
        clickMultiplier++;
    }
    CURSOR_BOOST.addEventListener("click", () => clickStoreItem("cursor-boost", 1.2, cursorBoostPurchase));



    const AUTO_CLICKER = document.querySelector(".store-section .item-container.auto-clicker");
    function autoClickerPurchase() {
        addPointsPerSecond(0.1);
    }
    AUTO_CLICKER.addEventListener("click", () => clickStoreItem("auto-clicker", 1.05, autoClickerPurchase));





// })();