const currentDisplay = document.getElementById('current-display')
const resultDisplay = document.getElementById('result-display');
const numbers = Array.from(document.querySelectorAll('.number'));
const numberTexts = numbers.map((number) => number.innerText);
const operators = Array.from(document.querySelectorAll('.operator'));
const operatorTexts = operators.map((operator) => operator.innerText)

let decimalClicked = false
let openParentheses = true
let operatorClicked = false
let memory = '';
let calculationResult = '0';

function memoryClear() {
  memory = ''
}

function memoryRecall() {
  if(memory === "") {
    currentDisplay.innerText = '0'
  } else {
    currentDisplay.innerText = memory
  }
}

function addToMemory() {
  const previousMemory = memory
  memory = eval(previousMemory + '+' + calculationResult)
}

function subtractFromMemory() {
  const previousMemory = memory
  memory = eval(previousMemory + '-' + calculationResult)
}

function handleCalculate() {
  const openParenthesesCount = (currentDisplay.innerText.match(/\(/g) || []).length
  const closeParenthesesCount = (currentDisplay.innerText.match(/\)/g) || []).length

  const expression = currentDisplay.innerText
  .replace(/-(?=\()/g, '-1*')
  .replace(/×/g, '*')
  .replace(/÷/g, '/')
  .replace(/(\d)\(/g, '$1*(')
  .replace(/\)(\d)/g, ')*$1') 
  .replace(/\)\(/g, ')*(')   
  .replace(/%/g, '*1/100');

  if (openParenthesesCount > closeParenthesesCount) {
    resultDisplay.innerText = eval(expression + ')');
  } else {
    if (operatorClicked) {
      resultDisplay.innerText = eval(expression)
    } else {
      resultDisplay.innerText = '';
    }
  }
}

// Function to clear the display
function clearDisplay() {
  calculationResult = '0';
  currentDisplay.innerText = calculationResult;
  resultDisplay.innerText = '';
  decimalClicked = false
  openParentheses = true
  operatorClicked = false
}

function deleteText() {
  const lastChar = currentDisplay.innerText.slice(-1)
  if (lastChar === '.') {
    decimalClicked = false
  } 
  currentDisplay.innerText = currentDisplay.innerText.slice(0, -1);
  if (currentDisplay.innerText.length > 0) {
    handleCalculate();
  } else {
    clearDisplay();
  }
}

function handleEqual() {
  handleCalculate();
  calculationResult = resultDisplay.innerText;
  currentDisplay.innerText = calculationResult;
  resultDisplay.innerText = '';
}


numbers.forEach((number) => {
  number.addEventListener('click', (e) => {
    const lastChar = currentDisplay.innerText.slice(-1)
    const secondToLastChar = currentDisplay.innerText.slice(-2, -1)

    openParentheses = false;
    handleNumber(parseInt(e.target.textContent));
    handleCalculate() 
  })
})

function handleNumber(number) {
  const lastChar = currentDisplay.innerText.slice(-1)
  const secondToLastChar = currentDisplay.innerText.slice(-2,-1)

  if (lastChar === '-' && secondToLastChar === '(') {
    openParentheses = false
  }

  if (lastChar !== '%') {
    if (number === 0) {
      if (currentDisplay.innerText === '0') {
        currentDisplay.innerText = number;
      } else if (lastChar === '-') {
        if (secondToLastChar === '') {
          currentDisplay.innerText = number
        } else if (operatorTexts.includes(secondToLastChar)) {
          currentDisplay.innerText = currentDisplay.innerText.slice(0, -1) + number
        } else {
          currentDisplay.innerText += number
        }
      } else if (lastChar === '0' && secondToLastChar !== '' && !operatorTexts.includes(secondToLastChar)) {
        currentDisplay.innerText += number 
       } else if (lastChar !== '0') {
        currentDisplay.innerText += number
      }
    } else if (number !== 0) {
      if (currentDisplay.innerText === '') {
        currentDisplay.innerText += number
      } else if (lastChar === '0' && secondToLastChar === '') {
        currentDisplay.innerText = number
      } else if (lastChar === '0' && (secondToLastChar !== '' || !operatorTexts.includes(secondToLastChar))){
        currentDisplay.innerText += number
      } else if (lastChar !== '0') {
        currentDisplay.innerText += number
      }
    }
  }
}

operators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    handleOperator(e.target.textContent)
  })
})

function handleOperator(operator) {
  const lastChar = currentDisplay.innerText.slice(-1)
  const secondToLastChar = currentDisplay.innerText.slice(-2, -1)

  operatorClicked = true
  
  if (operator === '-' && lastChar !== '-' && lastChar !== '+' && currentDisplay.innerText === '0') {
    currentDisplay.innerText = operator
  } else if (currentDisplay.innerText !== '0' && lastChar !== '(') {
    decimalClicked = false
    if (!operatorTexts.includes(lastChar)) {
      currentDisplay.innerText += operator
    } else if (operatorTexts.includes(lastChar) && !operatorTexts.includes(secondToLastChar)  && secondToLastChar !== '') {
      currentDisplay.innerText = currentDisplay.innerText.slice(0, -1) + operator
    } else if (operatorTexts.includes(lastChar) && operatorTexts.includes(secondToLastChar)) {
      currentDisplay.innerText = currentDisplay.innerText.slice(0, -2) + operator
    }
  } else if (lastChar === '(' && operator === '-') {
    currentDisplay.innerText += operator
  }

  openParentheses = true
}

function handlePercent() {
  const lastChar = currentDisplay.innerText.slice(-1)
  if (numberTexts.includes(lastChar) && currentDisplay.innerText !== '0') {
    currentDisplay.innerText += '%'
  }
   handleCalcluate();
}

function handleParentheses() {
  const lastChar = currentDisplay.innerText.slice(-1)
  const openParenthesesCount = (currentDisplay.innerText.match(/\(/g) || []).length
  const closeParenthesesCount = (currentDisplay.innerText.match(/\)/g) || []).length

  if (openParentheses) {
    if (currentDisplay.innerText === '0') {
      currentDisplay.innerText = '('
    } else if (currentDisplay.innerText !== '0' || lastChar.includes(operatorTexts) || lastChar !== '0') {
      currentDisplay.innerText += '('
    }
  } else if (!openParentheses && !operatorTexts.includes(lastChar) && currentDisplay.innerText !== '0') {
    if (openParenthesesCount !== closeParenthesesCount && !lastChar.includes('(')) {
      currentDisplay.innerText += ')'
    } else if (openParenthesesCount === closeParenthesesCount) {
      currentDisplay.innerText += '('
      openParentheses = true
    }
  } 
  operatorClicked = true;
}


function decimalPoint(e) {
  const lastChar = currentDisplay.innerText.slice(-1)
  if(!decimalClicked && lastChar !== '.' && !operatorTexts.includes(lastChar) && lastChar !== '(' && lastChar !== ')') {
    if (currentDisplay.innerText === '') {
      currentDisplay.innerText = '0' + e.target.textContent
      decimalClicked = true
    } else {
      currentDisplay.innerText += e.target.textContent;
      decimalClicked = true;
    }
  }
}

function sizeChanged() {
  if (currentDisplay.innerText.length > 8) {
    currentDisplay.style.fontSize = '35px'
  } else {
    currentDisplay.style.fontSize = '';
  }
}

document.getElementById("mc").addEventListener("click", memoryClear)
document.getElementById("mr").addEventListener("click", memoryRecall)
document.getElementById("m+").addEventListener("click", addToMemory)
document.getElementById("m-").addEventListener("click", subtractFromMemory)
document.getElementById("ac").addEventListener('click', clearDisplay)
document.getElementById('parentheses').addEventListener('click', handleParentheses)
document.getElementById('percent').addEventListener('click',handlePercent)
document.getElementById("delete").addEventListener('click', deleteText)
document.getElementById("equal").addEventListener('click', handleEqual)
document.getElementById('decimal-point').addEventListener('click', decimalPoint)

document.addEventListener('keydown', function(event) {
      const key = event.key;
      console.log(key)
      if (key >= '0' && key <= '9') {
        handleNumber(parseInt(key));
      } else if (key === '.') {
        decimalPoint();
      } else if (operatorTexts.includes(key)) {
        handleOperator(key);
      } else if (key === 'Enter') {
        handleEqual();
      } else if (key === 'Backspace') {
        deleteText();
      } else if (key === 'c') {
        clearDisplay();
      } else if (key === '(') {
        currentDisplay.innerText += '(';
      } else if (key === ')') {
        currentDisplay.innerText += ')';
      }
    });

