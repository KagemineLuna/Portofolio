document.addEventListener('DOMContentLoaded', function() {
    
    // --- LOGIKA TAB SWITCHING ---
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');

            const target = document.querySelector(`#${tab.dataset.tab}`);
            tabContents.forEach(content => content.classList.remove('active'));
            target.classList.add('active');
        });
    });


    // --- LOGIKA KALKULATOR ILMIAH ---
    const display = document.getElementById('scientific-display');
    const keys = document.querySelector('.keys');
    let angleMode = 'deg'; // 'deg' atau 'rad'

    // Fungsi untuk menghitung faktorial
    function factorial(n) {
        if (n < 0) return 'Error';
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = n; i > 1; i--) {
            result *= i;
        }
        return result;
    }

    keys.addEventListener('click', e => {
        if (!e.target.matches('button')) return;

        const key = e.target;
        const value = key.value;
        let currentDisplay = display.value;

        switch (value) {
            case 'clear':
                display.value = '';
                break;
            case 'backspace':
                display.value = currentDisplay.slice(0, -1);
                break;
            case 'deg':
            case 'rad':
                angleMode = value;
                // Bisa tambahkan indikator visual di sini
                alert(`Mode sudut diubah ke: ${angleMode.toUpperCase()}`);
                break;
            case '=':
                try {
                    // PENTING: eval() bisa berbahaya. Di sini kita 'membungkusnya' sedikit.
                    // Mengganti simbol yang user-friendly dengan yang dimengerti Math
                    let expression = currentDisplay
                        .replace(/\^/g, '**')
                        .replace(/√\(/g, 'Math.sqrt(')
                        .replace(/ln\(/g, 'Math.log(')
                        .replace(/log\(/g, 'Math.log10(')
                        .replace(/sin\(/g, `Math.sin(${(angleMode === 'deg' ? 'Math.PI/180*' : '')}`)
                        .replace(/cos\(/g, `Math.cos(${(angleMode === 'deg' ? 'Math.PI/180*' : '')}`)
                        .replace(/tan\(/g, `Math.tan(${(angleMode === 'deg' ? 'Math.PI/180*' : '')}`);
                    
                    // Menangani faktorial secara terpisah karena tidak bisa langsung di-eval
                    if (expression.includes('!')) {
                        expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
                    }

                    display.value = eval(expression);
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


    // --- LOGIKA KALKULATOR RUMUS ---
    const formulaChoice = document.getElementById('formula-choice');
    const formulaInputsContainer = document.getElementById('formula-inputs');
    const calculateBtn = document.getElementById('calculate-formula');
    const formulaResult = document.getElementById('formula-result');

    const formulas = {
        luas_lingkaran: {
            name: "Luas Lingkaran",
            inputs: [{ id: 'jari_jari', label: 'Jari-jari (r)' }],
            calculate: (vals) => Math.PI * Math.pow(vals.jari_jari, 2),
            resultLabel: "Luas"
        },
        keliling_lingkaran: {
            name: "Keliling Lingkaran",
            inputs: [{ id: 'jari_jari', label: 'Jari-jari (r)' }],
            calculate: (vals) => 2 * Math.PI * vals.jari_jari,
            resultLabel: "Keliling"
        },
        volume_kubus: {
            name: "Volume Kubus",
            inputs: [{ id: 'sisi', label: 'Panjang Sisi (s)' }],
            calculate: (vals) => Math.pow(vals.sisi, 3),
            resultLabel: "Volume"
        },
        pythagoras: {
            name: "Teorema Pythagoras (mencari sisi miring c)",
            inputs: [
                { id: 'sisi_a', label: 'Sisi a' },
                { id: 'sisi_b', label: 'Sisi b' }
            ],
            calculate: (vals) => Math.sqrt(Math.pow(vals.sisi_a, 2) + Math.pow(vals.sisi_b, 2)),
            resultLabel: "Sisi Miring (c)"
        },
        hukum_ohm: {
            name: "Hukum Ohm (V = IR)",
            inputs: [
                { id: 'arus', label: 'Arus (I) dalam Ampere' },
                { id: 'hambatan', label: 'Hambatan (R) dalam Ohm' }
            ],
            calculate: (vals) => vals.arus * vals.hambatan,
            resultLabel: "Tegangan (V)"
        },
        kecepatan: {
            name: "Kecepatan (v = s/t)",
            inputs: [
                { id: 'jarak', label: 'Jarak (s) dalam meter' },
                { id: 'waktu', label: 'Waktu (t) dalam detik' }
            ],
            calculate: (vals) => vals.jarak / vals.waktu,
            resultLabel: "Kecepatan (v)"
        }
        // KAMU BISA MENAMBAHKAN RUMUS BARU DI SINI
    };

    formulaChoice.addEventListener('change', () => {
        const choice = formulaChoice.value;
        formulaInputsContainer.innerHTML = '';
        formulaResult.innerHTML = '';
        
        if (!choice) {
            calculateBtn.style.display = 'none';
            return;
        }

        const formula = formulas[choice];
        formula.inputs.forEach(input => {
            const group = document.createElement('div');
            group.className = 'input-group';
            group.innerHTML = `
                <label for="${input.id}">${input.label}:</label>
                <input type="number" id="${input.id}" placeholder="Masukkan nilai...">
            `;
            formulaInputsContainer.appendChild(group);
        });
        calculateBtn.style.display = 'block';
    });

    calculateBtn.addEventListener('click', () => {
        const choice = formulaChoice.value;
        if (!choice) return;

        const formula = formulas[choice];
        const values = {};
        let allValid = true;

        formula.inputs.forEach(input => {
            const inputEl = document.getElementById(input.id);
            const val = parseFloat(inputEl.value);
            if (isNaN(val)) {
                allValid = false;
            }
            values[input.id] = val;
        });

        if (!allValid) {
            formulaResult.innerHTML = `Harap isi semua kolom dengan angka yang valid.`;
            return;
        }

        const result = formula.calculate(values);
        formulaResult.innerHTML = `
            <strong>${formula.resultLabel}:</strong><br> 
            ${result.toFixed(4)}
        `; // toFixed(4) untuk membatasi 4 angka di belakang koma
    });
});
                                                        
