export function initScientificCalculator() {
    const display = document.getElementById('scientific-display');
    const historyDisplay = document.getElementById('history');
    const angleModeDisplay = document.getElementById('angle-mode-display');
    const keys = document.querySelector('.keys');
    let angleMode = 'deg'; // 'deg' or 'rad'
    let lastCalculation = '';

    // Update angle mode display
    function updateAngleModeDisplay() {
        angleModeDisplay.textContent = angleMode.toUpperCase();
    }

    // Calculate factorial
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = n; i > 1; i--) {
            result *= i;
        }
        return result;
    }

    // Handle key press
    keys.addEventListener('click', e => {
        if (!e.target.matches('button')) return;

        const key = e.target;
        const value = key.value;
        let currentDisplay = display.value;

        switch (value) {
            case 'clear':
                display.value = '';
                historyDisplay.textContent = '';
                break;
            case 'backspace':
                display.value = currentDisplay.slice(0, -1);
                break;
            case 'deg':
            case 'rad':
                angleMode = value;
                updateAngleModeDisplay();
                break;
            case '=':
                try {
                    if (!currentDisplay) return;
                    
                    lastCalculation = currentDisplay;
                    historyDisplay.textContent = lastCalculation + ' =';
                    
                    let expression = currentDisplay
                        .replace(/\^/g, '**')
                        .replace(/√\(/g, 'Math.sqrt(')
                        .replace(/ln\(/g, 'Math.log(')
                        .replace(/log\(/g, 'Math.log10(')
                        .replace(/sin\(/g, `Math.sin(${angleMode === 'deg' ? 'Math.PI/180*' : ''}`)
                        .replace(/cos\(/g, `Math.cos(${angleMode === 'deg' ? 'Math.PI/180*' : ''}`)
                        .replace(/tan\(/g, `Math.tan(${angleMode === 'deg' ? 'Math.PI/180*' : ''}`);
                    
                    // Handle factorial
                    if (expression.includes('!')) {
                        expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
                    }

                    const result = eval(expression);
                    display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
                } catch (error) {
                    display.value = 'Error';
                }
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'sqrt':
                display.value += `${value}(`;
                break;
            case '!':
                display.value += '!';
                break;
            default:
                display.value += value;
        }
    });

    // Keyboard support
    document.addEventListener('keydown', e => {
        // --- FIX STARTS HERE ---
        // First, check if the scientific calculator tab is actually active.
        const scientificTab = document.getElementById('scientific');
        if (!scientificTab || !scientificTab.classList.contains('active')) {
            // If it's not active, do nothing and let the browser handle the input normally.
            return; 
        }
        // --- FIX ENDS HERE ---

        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '+': '+', '-': '-', '*': '*', '/': '/', '.': '.',
            'Enter': '=', 'Escape': 'clear', 'Backspace': 'backspace',
            '^': '^', '!': '!', '(': '(', ')': ')'
        };

        if (keyMap[e.key]) {
            e.preventDefault(); // This should only run for the scientific calculator now
            
            // This selector should use the `.key` class from your HTML
            const button = document.querySelector(`.keys .key[value="${keyMap[e.key]}"]`);
            
            if (button) {
                button.click();
                // Optional: Add a visual feedback class
                button.classList.add('active');
                setTimeout(() => button.classList.remove('active'), 100);
            }
        }
    });

    // Initialize angle mode display
    updateAngleModeDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initScientificCalculator);