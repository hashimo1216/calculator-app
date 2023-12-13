const currentDisplay = document.getElementById('current-display')
const resultDisplay = document.getElementById('result-display');
const numbers = Array.from(document.querySelectorAll('.number'));
const numberTexts = numbers.map((number) => number.innerText);
const operators = Array.from(document.querySelectorAll('.operator'));
const operatorTexts = operators.map((operator) => operator.innerText)

let decimalClicked = false
let openParentheses = false
let operatorClicked = false



function calculateResult() {
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
  currentDisplay.innerText = '';
  resultDisplay.innerText = '';
  decimalClicked = false
  openParentheses = false
  operatorClicked = false
}

function deleteText() {
  const lastChar = currentDisplay.innerText.slice(-1)
  if (lastChar === '.') {
    decimalClicked = false
  } 
  currentDisplay.innerText = currentDisplay.innerText.slice(0, -1);
  if (currentDisplay.innerText.length > 0) {
    calculateResult();
  } else {
    clearDisplay();
  }
}

function equalHandle() {
  calculateResult();
  currentDisplay.innerText = resultDisplay.innerText;
  resultDisplay.innerText = '';
}


numbers.forEach((number) => {
  number.addEventListener('click', (e) => {
    const lastChar = currentDisplay.innerText.slice(-1)
    if (lastChar === '(') {
      openParentheses = true;
    }
    handleNumber(parseInt(e.target.textContent));
    calculateResult() 
  })
})

function handleNumber(number) {
  const lastChar = currentDisplay.innerText.slice(-1)
  const secondToLastChar = currentDisplay.innerText.slice(-2,-1)

  if (lastChar === '-' && secondToLastChar === '(') {
    openParentheses = true
  }
  
  if (number === 0) {
    if (currentDisplay.innerText === '') {
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



operators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    handleOperator(e.target.textContent)
  })
})

function handleOperator(operator) {
  const lastChar = currentDisplay.innerText.slice(-1)
  const secondToLastChar = currentDisplay.innerText.slice(-2, -1)

  operatorClicked = true

  if (operator === '-' && lastChar !== '-' && lastChar !== '+') {
    currentDisplay.innerText += operator
  } else if (currentDisplay.innerText !== '' && lastChar !== '(') {
    decimalClicked = false
    if (!operatorTexts.includes(lastChar)) {
      currentDisplay.innerText += operator
    } else if (operatorTexts.includes(lastChar) && !operatorTexts.includes(secondToLastChar)  && secondToLastChar !== '') {
      currentDisplay.innerText = currentDisplay.innerText.slice(0, -1) + operator
    } else if (operatorTexts.includes(lastChar) && operatorTexts.includes(secondToLastChar)) {
      currentDisplay.innerText = currentDisplay.innerText.slice(0, -2) + operator
    } 
  }
}

function handlePercent() {
  const lastChar = currentDisplay.innerText.slice(-1)
  if (numberTexts.includes(lastChar)) {
    currentDisplay.innerText += '%'
  }
   calculateResult();
}

function handleParentheses() {
  const lastChar = currentDisplay.innerText.slice(-1)
  const openParenthesesCount = (currentDisplay.innerText.match(/\(/g) || []).length
  const closeParenthesesCount = (currentDisplay.innerText.match(/\)/g) || []).length

  if(!openParentheses) {
    currentDisplay.innerText += '('
  } else if (openParentheses && !operatorTexts.includes(lastChar)) {
    if (openParenthesesCount !== closeParenthesesCount && !operatorTexts.includes(lastChar)) {
      currentDisplay.innerText += ')'
    } else if (openParenthesesCount === closeParenthesesCount) {
      currentDisplay.innerText += '('
      openParentheses = false
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

document.getElementById("ac").addEventListener('click', clearDisplay)
document.getElementById('parentheses').addEventListener('click', handleParentheses)
document.getElementById('percent').addEventListener('click',handlePercent)
document.getElementById("delete").addEventListener('click', deleteText)
document.getElementById("equal").addEventListener('click', equalHandle)
document.getElementById('decimal-point').addEventListener('click', decimalPoint)
