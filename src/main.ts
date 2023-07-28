import "./style.css";

const kiloPerMile = 0.621371;
const paceTotal = {
    miles: 0,
    kilos: 0,
};

const result = {
    mile: document.getElementById("res-miles") as HTMLSpanElement,
    kilo: document.getElementById("res-kilo") as HTMLSpanElement,
};
const input = {
    distance: document.getElementById("dis-input") as HTMLInputElement,
    hours: document.getElementById("hour-input") as HTMLInputElement,
    minutes: document.getElementById("min-input") as HTMLInputElement,
    seconds: document.getElementById("sec-input") as HTMLInputElement,
};

const calcPace = () => {
    const distance = parseInt(input.distance.value || "0");
    const hours = parseInt(input.hours.value || "0");
    const minutes = parseInt(input.minutes.value || "0");
    const seconds = parseInt(input.seconds.value || "0");

    // If time or distance is 0 don't calculate
    if (distance === 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
        return;
    }

    paceTotal.miles = (hours * 60 + minutes * 1 + seconds / 60) / distance;
    paceTotal.kilos = paceTotal.miles * kiloPerMile;

    const pace: { minutes: number; seconds: number } = {
        minutes: Math.floor(paceTotal.miles),
        seconds: Math.floor((paceTotal.miles - Math.floor(paceTotal.miles)) * 60),
    };
    const paceKilo: { minutes: number; seconds: number } = {
        minutes: Math.floor(paceTotal.kilos),
        seconds: Math.floor((paceTotal.kilos - Math.floor(paceTotal.kilos)) * 60),
    };

    // Update UI
    result.mile.innerHTML = pace.minutes + ":" + (pace.seconds <= 9 ? "0" : "") + pace.seconds;
    result.kilo.innerHTML = paceKilo.minutes + ":" + (paceKilo.seconds <= 9 ? "0" : "") + paceKilo.seconds;
};

const inputEvent = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const idKey = target.id.slice(0, target.id.indexOf("-"));
    const display = document.getElementById(idKey + "-display") as HTMLSpanElement | HTMLLabelElement;

    // maxLength Validation
    const lengthLimit = idKey === "dis" ? 6 : 2;
    if (target.value.length > lengthLimit) {
        target.value = target.value.slice(0, lengthLimit);
        return;
    }

    // Format input
    if (idKey === "dis" || idKey === "hour")
        // Distance
        display.innerHTML = target.value || "0";
    else if (target.value.length === 1)
        // Single Digit Time
        display.innerHTML = 0 + target.value;
    // Double Digit Time or No Time
    else display.innerHTML = target.value || "00";

    calcPace();
};

calcPace();
input.hours.addEventListener("input", inputEvent);
input.minutes.addEventListener("input", inputEvent);
input.seconds.addEventListener("input", inputEvent);
input.distance.addEventListener("input", inputEvent);
