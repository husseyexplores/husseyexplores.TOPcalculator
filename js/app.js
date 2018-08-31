//{
const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;
const percent = num => num / 100;

const keyCodes = {
  digits: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102, 103, 104, 105],
  decimal: [190, 110],
  plus: [187, 107],
  minus: [189, 109],
  multiply: [187, 106], // use event.key + because it is same keycode as multiply
  divide: [191, 111],
  isEqual: [187],
  enter: [12, 13],
  backspace: [8],
  clear: [46],
}

const history = document.querySelector('#history');
const display = document.querySelector('#display');

const clearBtn = document.querySelector('#clearBtn');

const addBtn = document.querySelector('#addBtn');
const subtractBtn = document.querySelector('#subtractBtn');
const multiplyBtn = document.querySelector('#multiplyBtn');
const divideBtn = document.querySelector('#divideBtn');

const delBtn = document.querySelector('#delBtn');

const isEqualBtn = document.querySelector('#isEqualBtn');

const numbers = document.querySelectorAll('.num');

const digitsClickHandler = (e) => {
  const currentVal = e.target;

  // if last input is an operator 
  if (replaceLastOperator(display.innerHTML, currentVal.innerHTML)) return;

  if (display.innerHTML === '0' && currentVal.innerHTML !== '.') {
    display.innerHTML = currentVal.innerHTML;
  } else if ((display.innerHTML.length <= 12 && currentVal.innerHTML !== '.') || (display.innerHTML === '0' && currentVal.innerHTML === '.')) {
    display.innerHTML += currentVal.innerHTML;
  } else if (display.innerHTML.match(/([0-9])/g).length <= 11) {
    display.innerHTML += currentVal.innerHTML;
  } else if (display.innerHTML.match(/([0-9])/g).length === 12) {
    // If decimal point not exists in last digits, then allow decimal digit, else no.
    const digitsArr = display.innerHTML.match(/([0-9\.]+)/g);
    if (digitsArr[digitsArr.length - 1].indexOf('.') === -1) {
      display.innerHTML += currentVal.innerHTML;
    }
  }
}

// Keyboard input handler
const keyboardInputHandler = (e) => {
  const currentVal = e.key;

  let keyCodeMatch = false;
  for (key in keyCodes) {
    keyCodes[key].indexOf(e.keyCode) !== -1 ? keyCodeMatch = true : '';
  }
  // if nothing matches
  if (!keyCodeMatch) return;

  // if clear key 
  if (keyCodes.clear.indexOf(e.keyCode) !== -1) {
    clearDisplayHandler();
    return;
  }

  // if backspace
  if (keyCodes.backspace.indexOf(e.keyCode) !== -1) {
    backspace();
    return;
  }

  // if enter or isEqual
  if ((keyCodes.isEqual.indexOf(e.keyCode) !== -1 && e.key === '=') || keyCodes.enter.indexOf(e.keyCode) !== -1) {
    calculateExpression();
    return;
  }

  // if last input is an operator, and current is also an operator then replace
  if (replaceLastOperator(display.innerHTML, currentVal)) return;

  // Basic math checks
  if (display.innerHTML === '0' && currentVal !== '.') {
    display.innerHTML = currentVal;
  } else if ((display.innerHTML.length <= 12 && currentVal !== '.') || (display.innerHTML === '0' && currentVal === '.')) {
    display.innerHTML += currentVal;
  } else if (display.innerHTML.length <= 12) {
    // If decimal point not exists in last digits, then allow decimal digit, else no.
    const digitsArr = display.innerHTML.match(/([0-9\.]+)/g);
    if (digitsArr[digitsArr.length - 1].indexOf('.') === -1) {
      display.innerHTML += currentVal;
    }
  }
}

// Removes last value - backspace button
const backspace = () => {
  // If it is a last digit, then replace it by 0
  if (display.innerHTML.length === 1) {
    display.innerHTML = '0';
  }

  // otherwise delete the last keyword
  const newVals = display.innerHTML.split('');
  newVals.pop();
  display.innerHTML = newVals.join('');
}

// Clears the display - CLEAR button
const clearDisplayHandler = () => {
  display.innerHTML = '0';
  history.innerHTML = '';
}

// Final Calculations and Update the the display;
const calculateExpression = (e) => {

  if (display.innerHTML.match(/([+|\-|/|x]$)/g)) return;

  history.innerHTML = display.innerHTML;
  const curExpression = display.innerHTML.replace(/([x])/g, '*');
  let result = eval(curExpression);
  result = parseFloat(result.toFixed(13 - result.toString().split('.')[0].length), 10);

  display.innerHTML = result;
}

const replaceLastOperator = (string, operator) => {
  // if last input is an operator, and current is also an operator then replace
  if (string.match(/([+|\-|/|x|*]$)/g) !== null && (operator == '-' || operator == '+' || operator == 'x' || operator == '*' || operator == '/')) {
    let splitArr = string.split(/([+|\-|/|x|*]$)/g);
    splitArr[1] = operator;
    string = splitArr.join('');
    return true;
  }
  return false;
}

// CLEAR KEY
clearBtn.addEventListener('click', clearDisplayHandler);

// DEL BKEY
delBtn.addEventListener('click', backspace);

// Show display for each keyboard hit
numbers.forEach(num => {
  num.addEventListener('click', digitsClickHandler)
});

// Calculate the values after hitting = button
isEqualBtn.addEventListener('click', calculateExpression);

document.addEventListener('keyup', keyboardInputHandler);

//}