
const current = document.getElementById("current");
const previous = document.getElementById("previous");

let firstNumber = null;
let operator = null;
let resetScreen = false;

// UPDATE DISPLAY
function updateDisplay(value) {
    current.textContent = value;
}

// ENTER NUMBERS
function appendNumber(number) {

    if (current.textContent === "Error") {
        updateDisplay("0");
    }

    if (resetScreen) {
        updateDisplay("0");
        resetScreen = false;
    }

    if (number === "." && current.textContent.includes(".")) {
        return;
    }

    if (current.textContent === "0" && number !== ".") {
        updateDisplay(number);
    } else {
        updateDisplay(current.textContent + number);
    }
}

// SELECT OPERATOR
function chooseOperator(op) {

    if (operator !== null && !resetScreen) {
        calculate();
    }

    firstNumber = parseFloat(current.textContent);
    operator = op;

    previous.textContent = firstNumber + " " + op;
    resetScreen = true;
}

// CALCULATE RESULT
function calculate() {

    if (operator === null || resetScreen) return;

    const secondNumber = parseFloat(current.textContent);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            result = secondNumber === 0
                ? "Error"
                : firstNumber / secondNumber;
            break;
    }

    if (typeof result === "number" && !Number.isFinite(result)) {
        result = "Error";
    }

    if (typeof result === "number") {
        result = Number(result.toPrecision(10));
    }

    updateDisplay(String(result));

    previous.textContent = "";

    firstNumber = null;
    operator = null;

    resetScreen = true;
}

// CLEAR ALL
function clearCalculator() {

    updateDisplay("0");
    previous.textContent = "";

    firstNumber = null;
    operator = null;

    resetScreen = false;
}

// DELETE LAST NUMBER
function deleteNumber() {

    if (resetScreen || current.textContent === "Error") {
        updateDisplay("0");
        resetScreen = false;
        return;
    }

    updateDisplay(
        current.textContent.length > 1
            ? current.textContent.slice(0, -1)
            : "0"
    );
}

// PERCENTAGE
function percentage() {

    const value = parseFloat(current.textContent);

    updateDisplay(String(value / 100));
}

// POSITIVE / NEGATIVE
function toggleSign() {

    const value = parseFloat(current.textContent);

    if (value !== 0) {
        updateDisplay(String(-value));
    }
}

// BUTTON CLICK EVENTS
document.querySelector(".buttons").addEventListener("click", (e) => {

    const button = e.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    }

    switch (button.dataset.action) {

        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteNumber();
            break;

        case "equals":
            calculate();
            break;

        case "percent":
            percentage();
            break;

        case "sign":
            toggleSign();
            break;
    }
});

// KEYBOARD SUPPORT
document.addEventListener("keydown", (e) => {

    if (/^[0-9.]$/.test(e.key)) {
        appendNumber(e.key);
    }

    if (["+", "-", "*", "/"].includes(e.key)) {
        chooseOperator(e.key);
    }

    if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculate();
    }

    if (e.key === "Backspace") {
        deleteNumber();
    }

    if (e.key === "Escape") {
        clearCalculator();
    }

    if (e.key === "%") {
        percentage();
    }
});
