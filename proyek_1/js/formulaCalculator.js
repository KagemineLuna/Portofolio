export function initFormulaCalculator() {
    const formulaChoice = document.getElementById('formula-choice');
    const formulaInputsContainer = document.getElementById('formula-inputs');
    const calculateBtn = document.getElementById('calculate-formula');
    const formulaResult = document.getElementById('formula-result');

    const formulas = {
        luas_lingkaran: {
            name: "Luas Lingkaran",
            description: "Luas lingkaran dihitung dengan rumus π × r², di mana r adalah jari-jari lingkaran.",
            inputs: [{ id: 'jari_jari', label: 'Jari-jari (r)', unit: 'satuan' }],
            calculate: (vals) => Math.PI * Math.pow(vals.jari_jari, 2),
            resultLabel: "Luas",
            resultUnit: "satuan²"
        },
        keliling_lingkaran: {
            name: "Keliling Lingkaran",
            description: "Keliling lingkaran dihitung dengan rumus 2 × π × r, di mana r adalah jari-jari lingkaran.",
            inputs: [{ id: 'jari_jari', label: 'Jari-jari (r)', unit: 'satuan' }],
            calculate: (vals) => 2 * Math.PI * vals.jari_jari,
            resultLabel: "Keliling",
            resultUnit: "satuan"
        },
        volume_kubus: {
            name: "Volume Kubus",
            description: "Volume kubus dihitung dengan rumus s³, di mana s adalah panjang sisi kubus.",
            inputs: [{ id: 'sisi', label: 'Panjang Sisi (s)', unit: 'satuan' }],
            calculate: (vals) => Math.pow(vals.sisi, 3),
            resultLabel: "Volume",
            resultUnit: "satuan³"
        },
        pythagoras: {
            name: "Teorema Pythagoras",
            description: "Menghitung sisi miring (c) segitiga siku-siku dengan rumus c = √(a² + b²).",
            inputs: [
                { id: 'sisi_a', label: 'Sisi a', unit: 'satuan' },
                { id: 'sisi_b', label: 'Sisi b', unit: 'satuan' }
            ],
            calculate: (vals) => Math.sqrt(Math.pow(vals.sisi_a, 2) + Math.pow(vals.sisi_b, 2)),
            resultLabel: "Sisi Miring (c)",
            resultUnit: "satuan"
        },
        luas_segitiga: {
            name: "Luas Segitiga",
            description: "Luas segitiga dihitung dengan rumus ½ × alas × tinggi.",
            inputs: [
                { id: 'alas', label: 'Alas', unit: 'satuan' },
                { id: 'tinggi', label: 'Tinggi', unit: 'satuan' }
            ],
            calculate: (vals) => 0.5 * vals.alas * vals.tinggi,
            resultLabel: "Luas",
            resultUnit: "satuan²"
        },
        hukum_ohm: {
            name: "Hukum Ohm",
            description: "Menghitung tegangan (V) dengan rumus V = I × R, di mana I adalah arus dan R adalah hambatan.",
            inputs: [
                { id: 'arus', label: 'Arus (I)', unit: 'Ampere' },
                { id: 'hambatan', label: 'Hambatan (R)', unit: 'Ohm' }
            ],
            calculate: (vals) => vals.arus * vals.hambatan,
            resultLabel: "Tegangan (V)",
            resultUnit: "Volt"
        },
        kecepatan: {
            name: "Kecepatan",
            description: "Menghitung kecepatan (v) dengan rumus v = s / t, di mana s adalah jarak dan t adalah waktu.",
            inputs: [
                { id: 'jarak', label: 'Jarak (s)', unit: 'meter' },
                { id: 'waktu', label: 'Waktu (t)', unit: 'detik' }
            ],
            calculate: (vals) => vals.jarak / vals.waktu,
            resultLabel: "Kecepatan (v)",
            resultUnit: "m/s"
        },
        energi_kinetik: {
            name: "Energi Kinetik",
            description: "Menghitung energi kinetik dengan rumus Ek = ½ × m × v², di mana m adalah massa dan v adalah kecepatan.",
            inputs: [
                { id: 'massa', label: 'Massa (m)', unit: 'kg' },
                { id: 'kecepatan', label: 'Kecepatan (v)', unit: 'm/s' }
            ],
            calculate: (vals) => 0.5 * vals.massa * Math.pow(vals.kecepatan, 2),
            resultLabel: "Energi Kinetik",
            resultUnit: "Joule"
        },
        persamaan_kuadrat: {
            name: "Persamaan Kuadrat",
            description: "Menghitung akar-akar persamaan kuadrat ax² + bx + c = 0 menggunakan rumus kuadrat.",
            inputs: [
                { id: 'a', label: 'Koefisien a', unit: '' },
                { id: 'b', label: 'Koefisien b', unit: '' },
                { id: 'c', label: 'Koefisien c', unit: '' }
            ],
            calculate: (vals) => {
                const discriminant = Math.pow(vals.b, 2) - 4 * vals.a * vals.c;
                if (discriminant < 0) {
                    return {
                        type: 'complex',
                        realPart: -vals.b / (2 * vals.a),
                        imaginaryPart: Math.sqrt(-discriminant) / (2 * vals.a)
                    };
                } else {
                    return {
                        type: 'real',
                        root1: (-vals.b + Math.sqrt(discriminant)) / (2 * vals.a),
                        root2: (-vals.b - Math.sqrt(discriminant)) / (2 * vals.a)
                    };
                }
            },
            resultLabel: "Akar-akar Persamaan",
            resultUnit: ""
        }
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
                <label for="${input.id}">${input.label} (${input.unit}):</label>
                <input type="number" id="${input.id}" placeholder="Masukkan nilai..." step="any">
            `;
            formulaInputsContainer.appendChild(group);
        });
        
        // Add formula description
        const desc = document.createElement('div');
        desc.className = 'formula-description';
        desc.textContent = formula.description;
        formulaInputsContainer.appendChild(desc);
        
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
                inputEl.style.borderColor = 'var(--danger-key-bg)';
            } else {
                values[input.id] = val;
                inputEl.style.borderColor = 'var(--border-color)';
            }
        });

        if (!allValid) {
            formulaResult.innerHTML = `<span style="color: var(--danger-key-bg)">Harap isi semua kolom dengan angka yang valid.</span>`;
            return;
        }

        const result = formula.calculate(values);
        
        if (formula.name === 'Persamaan Kuadrat') {
            if (result.type === 'complex') {
                formulaResult.innerHTML = `
                    <strong>${formula.resultLabel}:</strong><br>
                    x₁ = ${result.realPart.toFixed(4)} + ${result.imaginaryPart.toFixed(4)}i<br>
                    x₂ = ${result.realPart.toFixed(4)} - ${result.imaginaryPart.toFixed(4)}i<br>
                    <em>(Akar imajiner)</em>
                `;
            } else {
                formulaResult.innerHTML = `
                    <strong>${formula.resultLabel}:</strong><br>
                    x₁ = ${result.root1.toFixed(4)}<br>
                    x₂ = ${result.root2.toFixed(4)}
                `;
            }
        } else {
            const formattedResult = Number.isInteger(result) ? 
                result : result.toFixed(4);
            formulaResult.innerHTML = `
                <strong>${formula.resultLabel}:</strong> ${formattedResult} ${formula.resultUnit}
            `;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFormulaCalculator);