const BROWNIE = document.querySelector("#click-brownie");

console.log(BROWNIE.computedStyleMap().get("max-width").value);









let browniePoints = 0;

function addPoints(points) {
    browniePoints += points;
    return browniePoints;
}

function removePoints(points) {
    browniePoints -= points;
    return browniePoints;
}

function attemptPurchase(points) {
    if (points < browniePoints) {
        return null;
    }

    return removePoints(points);
}





const POINTS_DISPLAY = document.querySelector("#points-holder");

let clickMultiplier = 1;

function clickBrownie() {
    addPoints(clickMultiplier);
    POINTS_DISPLAY.innerHTML = browniePoints;
    console.log(browniePoints);
}

BROWNIE.addEventListener("click", clickBrownie);