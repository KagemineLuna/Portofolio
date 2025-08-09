class Calculator {
    constructor(historyElement, currentOperandElement) {
        this.historyElement = historyElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.history = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.history !== '') {
            this.compute();
        }
        this.operation = operation;
        this.history = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.history);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
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
                computation = prev / current;
                break;
            case '%':
                computation = (prev / 100) * current;
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.history = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.historyElement.innerText = `${this.history} ${this.operation}`;
        } else {
            this.historyElement.innerText = this.history;
        }
    }
}

const historyElement = document.getElementById('history');
const currentOperandElement = document.getElementById('current-operand');

const calculator = new Calculator(historyElement, currentOperandElement);

// Event Listeners
const numberButtons = document.querySelectorAll('.button.number');
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

const operationButtons = document.querySelectorAll('.button.operator[data-operator]');
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
    });
});

const clearButton = document.querySelector('.button.clear');
clearButton.addEventListener('click', () => {
    calculator.clear();
});

const deleteButton = document.querySelector('.button.delete');
deleteButton.addEventListener('click', () => {
    calculator.delete();
});

const equalsButton = document.querySelector('.button.equals');
equalsButton.addEventListener('click', () => {
    calculator.compute();
});

// Fitur Khusus: Konstanta dan Fungsi Ilmiah
const scientificButtons = document.querySelectorAll('.button.scientific');
scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.constant === 'pi') {
            calculator.currentOperand = Math.PI.toString();
        } else if (button.dataset.constant === 'e') {
            calculator.currentOperand = Math.E.toString();
        } else if (button.dataset.function === 'sin') {
            calculator.currentOperand = Math.sin(parseFloat(calculator.currentOperand)).toString();
        } else if (button.dataset.function === 'cos') {
            calculator.currentOperand = Math.cos(parseFloat(calculator.currentOperand)).toString();
        } else if (button.dataset.function === 'tan') {
            calculator.currentOperand = Math.tan(parseFloat(calculator.currentOperand)).toString();
        } else if (button.dataset.function === 'root') {
            calculator.currentOperand = Math.sqrt(parseFloat(calculator.currentOperand)).toString();
        } else if (button.dataset.function === 'log') {
            calculator.currentOperand = Math.log10(parseFloat(calculator.currentOperand)).toString();
        } else if (button.dataset.function === 'ln') {
            calculator.currentOperand = Math.log(parseFloat(calculator.currentOperand)).toString();
        } else if (button.dataset.function === 'factorial') {
            const num = parseInt(calculator.currentOperand);
            if (num < 0) {
                calculator.currentOperand = 'Error';
            } else {
                let result = 1;
                for (let i = 2; i <= num; i++) {
                    result *= i;
                }
                calculator.currentOperand = result.toString();
            }
        } else if (button.dataset.function === 'fraction') {
             calculator.currentOperand = (1 / parseFloat(calculator.currentOperand)).toString();
        }
        calculator.updateDisplay();
    });
});
      
