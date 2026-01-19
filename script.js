const displayPrev = document.getElementById("displayPrev");
const displayCurrent = document.getElementById("displayCurrent");
const keys = document.querySelector(".keys");
const deleteKey = document.querySelector('[data-action="delete"]');

let current = "0";
let previous = "";
let operator = "";
let waitingForNext = false;

const updateDisplay = () => {
  displayPrev.textContent = previous;
  displayCurrent.textContent = current;
};

const inputDigit = (digit) => {
  if (waitingForNext) {
    current = digit;
    waitingForNext = false;
    return;
  }
  current = current === "0" ? digit : current + digit;
};

const inputDecimal = () => {
  if (waitingForNext) {
    current = "0.";
    waitingForNext = false;
    return;
  }
  if (!current.includes(".")) {
    current += ".";
  }
};

const clearAll = () => {
  current = "0";
  previous = "";
  operator = "";
  waitingForNext = false;
};

const deleteLast = () => {
  if (waitingForNext) return;
  if (current.length === 1) {
    current = "0";
    return;
  }
  current = current.slice(0, -1);
};

const toggleSign = () => {
  if (current === "0") return;
  current = current.startsWith("-") ? current.slice(1) : `-${current}`;
};

const percent = () => {
  const value = parseFloat(current);
  if (Number.isNaN(value)) return;
  current = String(value / 100);
};

const compute = (first, second, op) => {
  const a = parseFloat(first);
  const b = parseFloat(second);
  if (Number.isNaN(a) || Number.isNaN(b)) return second;
  switch (op) {
    case "+":
      return String(a + b);
    case "-":
      return String(a - b);
    case "*":
      return String(a * b);
    case "/":
      return b === 0 ? "Error" : String(a / b);
    default:
      return second;
  }
};

const handleOperator = (nextOp) => {
  if (operator && !waitingForNext) {
    current = compute(previous, current, operator);
  }
  if (current === "Error") {
    previous = "";
    operator = "";
    waitingForNext = true;
    return;
  }
  previous = `${current} ${nextOp}`;
  operator = nextOp;
  waitingForNext = true;
};

const handleEquals = () => {
  if (!operator || waitingForNext) return;
  const result = compute(previous.split(" ")[0], current, operator);
  current = result;
  previous = "";
  operator = "";
  waitingForNext = true;
};

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const digit = button.dataset.digit;
  const op = button.dataset.op;
  const action = button.dataset.action;

  if (digit) inputDigit(digit);
  else if (op) handleOperator(op);
  else if (action === "decimal") inputDecimal();
  else if (action === "clear") clearAll();
  else if (action === "sign") toggleSign();
  else if (action === "percent") percent();
  else if (action === "equals") handleEquals();

  updateDisplay();
});

deleteKey.addEventListener("click", () => {
  deleteLast();
  updateDisplay();
});

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    inputDigit(event.key);
  } else if (event.key === ".") {
    inputDecimal();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (event.key === "Escape") {
    clearAll();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    handleOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    handleEquals();
  } else {
    return;
  }
  event.preventDefault();
  updateDisplay();
});

updateDisplay();
