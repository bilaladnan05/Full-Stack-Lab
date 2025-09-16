document.addEventListener('DOMContentLoaded', function() {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const equalsButton = document.querySelector('.equals');
    const clearButton = document.querySelector('[data-action="clear"]');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const percentButton = document.querySelector('[data-action="%"]');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;

    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    function appendNumber(number) {
        if (shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        
        if (number === '.' && currentOperand.includes('.')) return;
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }

    function chooseOperation(op) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    currentOperand = 'Error';
                    previousOperand = '';
                    operation = undefined;
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
    }

    function calculatePercentage() {
        if (currentOperand === '') return;
        currentOperand = (parseFloat(currentOperand) / 100).toString();
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function deleteNumber() {
        if (currentOperand === 'Error' || shouldResetScreen) {
            clear();
            return;
        }
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
            updateDisplay();
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.dataset.action);
            updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        compute();
        updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        deleteNumber();
        updateDisplay();
    });

    percentButton.addEventListener('click', () => {
        calculatePercentage();
        updateDisplay();
    });

    // Initialize display
    updateDisplay();
});
