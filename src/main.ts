import "./style.css";

const kiloPerMile = 0.621371;
const paceTotal = {
    miles: 0,
    kilos: 0,
};
let units = 'mi';

const result = {
    mile: document.getElementById("res-miles") as HTMLSpanElement,
    kilo: document.getElementById("res-kilo") as HTMLSpanElement,
};

const inputElements = [...document.querySelectorAll(".card input")] as HTMLInputElement[];

const calcPace = () => {
    const values = inputElements.map(({ value }) => value);
    const hours = parseInt(values[0] + values[1] || "0");
    const minutes = parseInt(values[2] + values[3] || "0");
    const seconds = parseInt(values[4] + values[5] || "0");
    const distance = parseFloat(values[6] || "0");

    // If time or distance is 0 don't calculate
    if (distance === 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
        return;
    }

    if (units === 'mi') {
        paceTotal.miles = (hours * 60 + minutes * 1 + seconds / 60) / distance;
        paceTotal.kilos = paceTotal.miles * kiloPerMile;
    } else {
        paceTotal.kilos = (hours * 60 + minutes * 1 + seconds / 60) / distance;
        paceTotal.miles = paceTotal.miles / kiloPerMile;
    }

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

const swapUnits = () => {
    const unitUpdate = units === 'mi' ? 'km' : 'mi';
    const paceRes = [...document.querySelectorAll('.pace')] as HTMLParagraphElement[];

    // Swap on the ui
    (document.getElementById('dis-units') as HTMLSpanElement).innerHTML = unitUpdate;
    (document.getElementById('dis-units-secondary') as HTMLSpanElement).innerHTML = units;
    (document.getElementById('result') as HTMLDivElement).classList.toggle('swap');

    paceRes.forEach((el) => {
        el.classList.toggle('secondary');
    })

    units = unitUpdate;
    calcPace();
}

(document.getElementById('unit-swap') as HTMLElement).addEventListener('click', swapUnits)

inputElements.forEach((el, index) => {
    el.addEventListener("keydown", (e: KeyboardEvent) => {
        const target = e.target as HTMLInputElement;
        // if the keycode is backspace & the current field is empty
        // focus the input before the current. Then the event happens
        // which will clear the "before" input box.
        if (e.code === "Delete" && target.value === "") inputElements[Math.max(0, index - 1)].focus();
    });

    el.addEventListener("input", (e: Event) => {
        const target = e.target as HTMLInputElement;
        const idKey = target.id.slice(0, target.id.indexOf("-"));
        // take the first character of the input
        const [first, ...rest] = target.value;

        // Micro security - remove value if not a number or period
        if (!/[\d.]/.test(first)) {
            target.value = target.value.slice(0, -1);
            return;
        }

        if (idKey !== "distance")
            target.value = first ?? ""; // first will be undefined when backspace was entered, so set the input to ""
        else
            target.value.length > 6 && (target.value = target.value.slice(0, -1)); // 6 char limit

        const lastInputBox = index === inputElements.length - 1;
        const didInsertContent = first !== undefined;
        if (didInsertContent && !lastInputBox) {
            // continue to input the rest of the string
            inputElements[index + 1].focus();
            inputElements[index + 1].value = rest.join("");
            inputElements[index + 1].dispatchEvent(new Event("input"));
        }

        calcPace();
    });
});

calcPace();
