const state = {
    firstNum: '',
    secondNum: '',
    operator: null,
    displayValue: '0',
};

const display = document.querySelector('.calculator-screen');
const keys = document.querySelector('.calculator-keys');

const operate = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

const updateDisplay = () => {
    display.value = state.displayValue;
};

const inputNumber = (num) => {
    if (state.operator && state.firstNum !== '') {
        state.secondNum += num;
        state.displayValue = state.secondNum;
    } else {
        if (state.displayValue === '0' && num === '0') return;

        state.firstNum += num;
        state.displayValue = state.firstNum.replace(/^0+/, '') || '0';
        if (state.firstNum === '0') state.firstNum = '';
    }
    updateDisplay();
};

const inputDecimal = (dot) => {
    let currentNum = (state.operator) ? 'secondNum' : 'firstNum';

    if (!state[currentNum].includes(dot)) {
        state[currentNum] += dot;
        stated.displayValue = state[currentNum];
        updateDisplay();
    }
};

const handleOperator = (nextOperator) => {
    if (state.operator && state.secondNum !== '') {
        calculate();
    }
    state.operator = nextOperator;
};

const calculate = () => {
    if (!state.operator || state.secondNum === '') return;

    if (state.operator === '/' && state.secondNum === '0') {
        state.displayValue = 'Error: Div by 0';
        updateDisplay();
        return resetCalculator();
    }

    const result = operate[state.operator](parseFloat(state.firstNum), parseFloat(state.secondNum));
    state.displayValue = String(Math.round(result * 1000000) / 1000000);

    state.firstNum = state.displayValue;
    state.secondNum = '';
    state.operator = null;

    updateDisplay();
};

const resetCalculator = () => {
    state.firstNum = '';
    state.secondNum = '';
    state.operator = null;
    state.displayValue = '0';
    updateDisplay();
};

const toggleSign = () => {
    let currentNum = (state.operator) ? 'secondNum' : 'firstNum';
    if (state[currentNum] === '') return;

    state[currentNum] = String(parseFloat(state[currentNum]) * -1);
    state.displayValue = state[currentNum];
    updateDisplay();
};

const deletedLastChar = () => {
    let currentNum = (state.operator) ? 'secondNum' : 'firstNum';
    state[currentNum] = state[currentNum].slice(0, -1);
    state.displayValue = state[currentNum] || '0';
    updateDisplay();
};

keys.addEventListener('click', (event) => {
    const { target } = event;
    const value = target.value;

    if (!target.matches('button')) return;

    if (target.classList.contains('key-operator')) return handleOperator(value);
    if (target.classList.contains('key-decimal')) return inputDecimal(value);
    if (target.classList.contains('key-clear')) return resetCalculator();
    if (target.classList.contains('key-sign')) return toggleSign();
    if (target.classList.contains('key-delete')) return deletedLastChar();
    if (target.classList.contains('key-equal')) return calculate();

    inputNumber(value);
})