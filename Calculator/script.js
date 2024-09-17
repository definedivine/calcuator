document.addEventListener('DOMContentLoaded', function() {
    let display = document.getElementById('display');
    let currentTab = 'main';
    let isDarkMode = false;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const tabButtons = document.querySelectorAll('.tab-button');
    const buttonsContainer = document.querySelector('.buttons');
    const calculateButton = document.getElementById('calculateButton');

    const mainButtons = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', 'C', '+']
    ];

    const scientificButtons = [
        ['sin(', 'cos(', 'tan(', 'π'],
        ['log(', 'ln(', '√(', '^'],
        ['(', ')', 'e', '!']
    ];

    const functionsButtons = [
        ['abs(', 'round(', 'floor(', 'ceil('],
        ['min(', 'max(', 'random()', ',']
    ];

    function renderButtons() {
        buttonsContainer.innerHTML = '';
        let buttons;
        if (currentTab === 'main') {
            buttons = mainButtons;
        } else if (currentTab === 'scientific') {
            buttons = scientificButtons;
        } else if (currentTab === 'functions') {
            buttons = functionsButtons;
        }

        buttons.forEach(function(row) {
            row.forEach(function(value) {
                let button = document.createElement('button');
                button.className = 'button';
                button.textContent = value;
                button.addEventListener('click', function() {
                    handleButtonClick(value);
                });
                buttonsContainer.appendChild(button);
            });
        });
    }

    function handleButtonClick(value) {
        if (value === 'C') {
            display.value = '0';
        } else {
            if (display.value === '0' && value !== '.') {
                display.value = value;
            } else {
                display.value += value;
            }
        }
    }

    function handleCalculate() {
        try {
            let expression = display.value
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E)
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/sin\(/g, 'Math.sin(Math.PI/180 * ') // Convert degrees to radians
                .replace(/cos\(/g, 'Math.cos(Math.PI/180 * ') // Convert degrees to radians
                .replace(/tan\(/g, 'Math.tan(Math.PI/180 * ') // Convert degrees to radians
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/abs\(/g, 'Math.abs(')
                .replace(/round\(/g, 'Math.round(')
                .replace(/floor\(/g, 'Math.floor(')
                .replace(/ceil\(/g, 'Math.ceil(')
                .replace(/min\(/g, 'Math.min(')
                .replace(/max\(/g, 'Math.max(')
                .replace(/random\(\)/g, 'Math.random()')
                .replace(/\^/g, '**')
                .replace(/(\d+)!/g, 'factorial($1)'); // Replace n! with factorial(n)

            // Define factorial function
            function factorial(n) {
                n = parseInt(n);
                if (n < 0) return 'Error';
                return n <= 1 ? 1 : n * factorial(n - 1);
            }

            // Evaluate the expression in a safe context
            let result = (function() {
                const factorial = function(n) {
                    n = parseInt(n);
                    if (n < 0) return 'Error';
                    return n <= 1 ? 1 : n * factorial(n - 1);
                };
                return eval(expression);
            })();
            display.value = result;
        } catch (error) {
            display.value = 'Error';
        }
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.body.classList.add('dark');
            darkModeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark');
            darkModeToggle.textContent = '🌙';
        }
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            currentTab = button.getAttribute('data-tab');
            renderButtons();
        });
    });

    calculateButton.addEventListener('click', handleCalculate);

    // Keyboard Support
    document.addEventListener('keydown', function(event) {
        const key = event.key;

        // Allow only specific keys
        const allowedKeys = '0123456789+-*/().%!^';
        const functionKeys = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'round', 'floor', 'ceil', 'min', 'max', 'random'];

        if (allowedKeys.includes(key)) {
            event.preventDefault();
            handleButtonClick(key);
        } else if (key === 'Enter') {
            event.preventDefault();
            handleCalculate();
        } else if (key === 'Backspace') {
            event.preventDefault();
            if (display.value.length > 1) {
                display.value = display.value.slice(0, -1);
            } else {
                display.value = '0';
            }
        } else if (key === 'Escape') {
            event.preventDefault();
            display.value = '0';
        }
    });

    // Handle Input from Function Keys (e.g., sin, cos)
    // You can extend this functionality based on your requirements

    renderButtons();
});
