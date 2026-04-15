const state = {
    firstNum: '',
    secondNum: '',
    operator: null,
    displayValue: '0',
    waitingForNewValue: false,
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
    let output = state.displayValue;
    if (!output.includes('Error')) {
        if (output.length > 9) {
            const num = parseFloat(output);
            output = num.toExponential(4);
        }
    }
    display.value = output;
};

const inputNumber = (num) => {
    if (state.waitingForNewValue) {
        state.firstNum = num;
        state.displayValue = num;
        state.waitingForNewValue = false;
        return updateDisplay();
    }

    let currentNum = (state.operator && state.firstNum) ? 'secondNum' : 'firstNum';

    if (state[currentNum] === '0') {
        state[currentNum] = num;
    } else {
        state[currentNum] += num;
    }

    state.displayValue = state[currentNum];
    updateDisplay();
};

const inputDecimal = (dot) => {
    if (state.waitingForNewValue) {
        state.firstNum = '0';
        state.displayValue = state.firstNum;
        state.waitingForNewValue = false;
        return updateDisplay();
    }

    let currentNum = (state.operator) ? 'secondNum' : 'firstNum';
    if (state[currentNum] === '') {
        state[currentNum] = '0.';
    } else if (!state[currentNum].includes(dot)) {
        state[currentNum] += dot;
    }

    state.displayValue = state[currentNum];
    updateDisplay();
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
        state.displayValue = 'Error: Div 0';
        state.firstNum = '';
        state.secondNum = '';
        state.operator = null;
        state.waitingForNewValue = true;
        return updateDisplay();
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
    if (target.classList.contains('key-random')) return randomizeTheme();

    inputNumber(value);
})

window.addEventListener('keydown', (event) => {
    const { key } = event;
    if (key) event.preventDefault();

    if (key >= '0' && key <= '9') return inputNumber(key);
    if (key === '.') return inputDecimal(key);
    if (key === '=' || key === 'Enter') return calculate();
    if (key === 'Backspace') return deletedLastChar();
    if (key === 'Escape') return resetCalculator();
    if (key.toLowerCase() === 'x') return randomizeTheme();

    const validOperators = ['+', '-', '*', '/'];
    if (validOperators.includes(key)) return handleOperator(key);
});

const themeToggleBtn = document.querySelector('.theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.removeAttribute('style');
});

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
};

const randomizeTheme = () => {
    const body = document.body;
    body.style.setProperty('--text-main', getRandomColor());
    body.style.setProperty('--btn-default', getRandomColor());
    body.style.setProperty('--btn-text', getRandomColor());
    body.style.setProperty('--btn-operator', getRandomColor());
};