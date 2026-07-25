/* ============================================================
   area-perimeter.js- Complete Area, Perimeter & Volume Calculator
   Supports: 10x 2D shapes + 6x 3D shapes
   ============================================================ */

let currentDimension = '2d';
let currentShape = null;

// Shape data with formulas and input fields
const shapeData = {
    // ==================== 2D SHAPES ====================
    square: {
        name: 'Square',
        dimension: '2d',
        icon: 'tabler:square',
        fields: [
            { id: 'side', label: 'Side (a)', placeholder: 'e.g., 5', unit: 'units' }
        ],
        calculate: (values) => {
            const a = values.side;
            return {
                area: a * a,
                perimeter: 4 * a,
                formulas: {
                    area: 'Area = a²',
                    perimeter: 'Perimeter = 4a'
                }
            };
        }
    },
    rectangle: {
        name: 'Rectangle',
        dimension: '2d',
        icon: 'tabler:layout',
        fields: [
            { id: 'length', label: 'Length (l)', placeholder: 'e.g., 8', unit: 'units' },
            { id: 'breadth', label: 'Breadth (b)', placeholder: 'e.g., 5', unit: 'units' }
        ],
        calculate: (values) => {
            const l = values.length;
            const b = values.breadth;
            return {
                area: l * b,
                perimeter: 2 * (l + b),
                formulas: {
                    area: 'Area = l × b',
                    perimeter: 'Perimeter = 2(l + b)'
                }
            };
        }
    },
    triangle: {
        name: 'Triangle (General)',
        dimension: '2d',
        icon: 'tabler:triangle',
        fields: [
            { id: 'base', label: 'Base (b)', placeholder: 'e.g., 10', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 6', unit: 'units' },
            { id: 'side_a', label: 'Side a', placeholder: 'e.g., 7', unit: 'units' },
            { id: 'side_b', label: 'Side b', placeholder: 'e.g., 8', unit: 'units' },
            { id: 'side_c', label: 'Side c', placeholder: 'e.g., 9', unit: 'units' }
        ],
        calculate: (values) => {
            const b = values.base;
            const h = values.height;
            const a = values.side_a;
            const sideB = values.side_b;
            const c = values.side_c;
            return {
                area: 0.5 * b * h,
                perimeter: a + sideB + c,
                formulas: {
                    area: 'Area = ½ × base × height',
                    perimeter: 'Perimeter = a + b + c'
                }
            };
        }
    },
    'right-triangle': {
        name: 'Right Triangle',
        dimension: '2d',
        icon: 'tabler:triangle',
        fields: [
            { id: 'base', label: 'Base (b)', placeholder: 'e.g., 6', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 8', unit: 'units' }
        ],
        calculate: (values) => {
            const b = values.base;
            const h = values.height;
            const hypo = Math.sqrt(b * b + h * h);
            return {
                area: 0.5 * b * h,
                perimeter: b + h + hypo,
                formulas: {
                    area: 'Area = ½ × base × height',
                    perimeter: 'Perimeter = base + height + hypotenuse'
                }
            };
        }
    },
    'equilateral-triangle': {
        name: 'Equilateral Triangle',
        dimension: '2d',
        icon: 'tabler:triangle',
        fields: [
            { id: 'side', label: 'Side (a)', placeholder: 'e.g., 6', unit: 'units' }
        ],
        calculate: (values) => {
            const a = values.side;
            return {
                area: (Math.sqrt(3) / 4) * a * a,
                perimeter: 3 * a,
                formulas: {
                    area: 'Area = (√3/4) × a²',
                    perimeter: 'Perimeter = 3a'
                }
            };
        }
    },
    circle: {
        name: 'Circle',
        dimension: '2d',
        icon: 'tabler:circle',
        fields: [
            { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 7', unit: 'units' }
        ],
        calculate: (values) => {
            const r = values.radius;
            const pi = Math.PI;
            return {
                area: pi * r * r,
                circumference: 2 * pi * r,
                formulas: {
                    area: 'Area = πr²',
                    circumference: 'Circumference = 2πr'
                }
            };
        }
    },
    semicircle: {
        name: 'Semicircle',
        dimension: '2d',
        icon: 'tabler:semicircle',
        fields: [
            { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 7', unit: 'units' }
        ],
        calculate: (values) => {
            const r = values.radius;
            const pi = Math.PI;
            return {
                area: (pi * r * r) / 2,
                perimeter: pi * r + 2 * r,
                formulas: {
                    area: 'Area = ½πr²',
                    perimeter: 'Perimeter = πr + 2r'
                }
            };
        }
    },
    parallelogram: {
        name: 'Parallelogram',
        dimension: '2d',
        icon: 'tabler:shape',
        fields: [
            { id: 'base', label: 'Base (b)', placeholder: 'e.g., 10', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 6', unit: 'units' },
            { id: 'side', label: 'Side (a)', placeholder: 'e.g., 7', unit: 'units' }
        ],
        calculate: (values) => {
            const b = values.base;
            const h = values.height;
            const a = values.side;
            return {
                area: b * h,
                perimeter: 2 * (a + b),
                formulas: {
                    area: 'Area = base × height',
                    perimeter: 'Perimeter = 2(a + b)'
                }
            };
        }
    },
    rhombus: {
        name: 'Rhombus',
        dimension: '2d',
        icon: 'tabler:diamond',
        fields: [
            { id: 'diagonal1', label: 'Diagonal 1 (d₁)', placeholder: 'e.g., 8', unit: 'units' },
            { id: 'diagonal2', label: 'Diagonal 2 (d₂)', placeholder: 'e.g., 6', unit: 'units' },
            { id: 'side', label: 'Side (a)', placeholder: 'e.g., 5', unit: 'units' }
        ],
        calculate: (values) => {
            const d1 = values.diagonal1;
            const d2 = values.diagonal2;
            const a = values.side;
            return {
                area: 0.5 * d1 * d2,
                perimeter: 4 * a,
                formulas: {
                    area: 'Area = ½ × d₁ × d₂',
                    perimeter: 'Perimeter = 4a'
                }
            };
        }
    },
    trapezium: {
        name: 'Trapezium',
        dimension: '2d',
        icon: 'tabler:shape',
        fields: [
            { id: 'base1', label: 'Base 1 (a)', placeholder: 'e.g., 10', unit: 'units' },
            { id: 'base2', label: 'Base 2 (b)', placeholder: 'e.g., 6', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 5', unit: 'units' },
            { id: 'side1', label: 'Side 1 (c)', placeholder: 'e.g., 4', unit: 'units' },
            { id: 'side2', label: 'Side 2 (d)', placeholder: 'e.g., 5', unit: 'units' }
        ],
        calculate: (values) => {
            const a = values.base1;
            const b = values.base2;
            const h = values.height;
            const c = values.side1;
            const d = values.side2;
            return {
                area: 0.5 * (a + b) * h,
                perimeter: a + b + c + d,
                formulas: {
                    area: 'Area = ½ × (a + b) × h',
                    perimeter: 'Perimeter = a + b + c + d'
                }
            };
        }
    },

    // ==================== 3D SHAPES ====================
    cube: {
        name: 'Cube',
        dimension: '3d',
        icon: 'tabler:cube',
        fields: [
            { id: 'side', label: 'Side (a)', placeholder: 'e.g., 5', unit: 'units' }
        ],
        calculate: (values) => {
            const a = values.side;
            return {
                volume: a * a * a,
                surfaceArea: 6 * a * a,
                formulas: {
                    volume: 'Volume = a³',
                    surfaceArea: 'Surface Area = 6a²'
                }
            };
        }
    },
    cuboid: {
        name: 'Cuboid',
        dimension: '3d',
        icon: 'tabler:box',
        fields: [
            { id: 'length', label: 'Length (l)', placeholder: 'e.g., 8', unit: 'units' },
            { id: 'breadth', label: 'Breadth (b)', placeholder: 'e.g., 5', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 3', unit: 'units' }
        ],
        calculate: (values) => {
            const l = values.length;
            const b = values.breadth;
            const h = values.height;
            return {
                volume: l * b * h,
                surfaceArea: 2 * (l * b + b * h + l * h),
                formulas: {
                    volume: 'Volume = l × b × h',
                    surfaceArea: 'Surface Area = 2(lb + bh + lh)'
                }
            };
        }
    },
    cylinder: {
        name: 'Cylinder',
        dimension: '3d',
        icon: 'tabler:cylinder',
        fields: [
            { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 7', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 10', unit: 'units' }
        ],
        calculate: (values) => {
            const r = values.radius;
            const h = values.height;
            const pi = Math.PI;
            return {
                volume: pi * r * r * h,
                curvedSurface: 2 * pi * r * h,
                totalSurface: 2 * pi * r * (r + h),
                formulas: {
                    volume: 'Volume = πr²h',
                    curvedSurface: 'CSA = 2πrh',
                    totalSurface: 'TSA = 2πr(r + h)'
                }
            };
        }
    },
    cone: {
        name: 'Cone',
        dimension: '3d',
        icon: 'tabler:cone',
        fields: [
            { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 7', unit: 'units' },
            { id: 'height', label: 'Height (h)', placeholder: 'e.g., 24', unit: 'units' }
        ],
        calculate: (values) => {
            const r = values.radius;
            const h = values.height;
            const l = Math.sqrt(r * r + h * h);
            const pi = Math.PI;
            return {
                volume: (pi * r * r * h) / 3,
                curvedSurface: pi * r * l,
                totalSurface: pi * r * (r + l),
                formulas: {
                    volume: 'Volume = ⅓πr²h',
                    curvedSurface: 'CSA = πrl',
                    totalSurface: 'TSA = πr(r + l)'
                }
            };
        }
    },
    sphere: {
        name: 'Sphere',
        dimension: '3d',
        icon: 'tabler:sphere',
        fields: [
            { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 7', unit: 'units' }
        ],
        calculate: (values) => {
            const r = values.radius;
            const pi = Math.PI;
            return {
                volume: (4 / 3) * pi * r * r * r,
                surfaceArea: 4 * pi * r * r,
                formulas: {
                    volume: 'Volume = ⁴⁄₃πr³',
                    surfaceArea: 'Surface Area = 4πr²'
                }
            };
        }
    },
    hemisphere: {
        name: 'Hemisphere',
        dimension: '3d',
        icon: 'tabler:circle-half',
        fields: [
            { id: 'radius', label: 'Radius (r)', placeholder: 'e.g., 7', unit: 'units' }
        ],
        calculate: (values) => {
            const r = values.radius;
            const pi = Math.PI;
            return {
                volume: (2 / 3) * pi * r * r * r,
                curvedSurface: 2 * pi * r * r,
                totalSurface: 3 * pi * r * r,
                formulas: {
                    volume: 'Volume = ⅔πr³',
                    curvedSurface: 'CSA = 2πr²',
                    totalSurface: 'TSA = 3πr²'
                }
            };
        }
    }
};

// Switch between 2D and 3D views
function switchDimension(dimension) {
    currentDimension = dimension;

    // Update tabs
    document.querySelectorAll('.dimension-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-dim="${dimension}"]`).classList.add('active');

    // Show/hide shape grids
    const shapes2d = document.getElementById('shapes-2d');
    const shapes3d = document.getElementById('shapes-3d');

    if (dimension === '2d') {
        shapes2d.classList.remove('hidden');
        shapes3d.classList.add('hidden');
    } else {
        shapes2d.classList.add('hidden');
        shapes3d.classList.remove('hidden');
    }

    // Hide input area and result
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('result-area').innerHTML = '';
    document.getElementById('formula-ref').classList.add('hidden');

    // Remove selected class from all shapes
    document.querySelectorAll('.shape-card').forEach(card => {
        card.classList.remove('selected');
    });

    currentShape = null;
}

// Select a shape
function selectShape(shapeId) {
    currentShape = shapeId;
    const shape = shapeData[shapeId];

    if (!shape) return;

    // Update selected class
    document.querySelectorAll('.shape-card').forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('data-shape') === shapeId) {
            card.classList.add('selected');
        }
    });

    // Build input fields
    const inputFieldsDiv = document.getElementById('input-fields');
    const shapeTitle = document.getElementById('shape-title');

    shapeTitle.innerHTML = `
        <span class="iconify" data-icon="${shape.icon}" data-width="24"></span>
        ${shape.name}
    `;

    let fieldsHtml = '';
    shape.fields.forEach((field, idx) => {
        fieldsHtml += `
            <div class="input-row">
                <label>
                    <span class="iconify" data-icon="tabler:arrow-right" data-width="14"></span>
                    ${field.label}
                </label>
                <input type="number" id="field-${field.id}" class="calc-input" 
                       placeholder="${field.placeholder}" step="any" />
                <small style="color: var(--color-muted); font-size: 0.7rem;">${field.unit}</small>
            </div>
        `;
    });

    inputFieldsDiv.innerHTML = fieldsHtml;

    // Show input area
    document.getElementById('input-area').classList.remove('hidden');
    document.getElementById('result-area').innerHTML = '';

    // Show formula reference
    showFormulaReference(shapeId);

    // Add enter key support
    addEnterKeyListeners();
}

// Show formula reference
function showFormulaReference(shapeId) {
    const shape = shapeData[shapeId];
    if (!shape) return;

    const formulaContent = document.getElementById('formula-content');
    let formulasHtml = '';

    if (shape.dimension === '2d') {
        if (shapeId === 'circle') {
            formulasHtml = `
                <div> <strong>${shape.name} Formulas:</strong></div>
                <div>• Area = πr²</div>
                <div>• Circumference = 2πr</div>
                <div>• π = 3.14159...</div>
            `;
        } else if (shapeId === 'semicircle') {
            formulasHtml = `
                <div> <strong>${shape.name} Formulas:</strong></div>
                <div>• Area = ½πr²</div>
                <div>• Perimeter = πr + 2r</div>
                <div>• π = 3.14159...</div>
            `;
        } else if (shapeId === 'equilateral-triangle') {
            formulasHtml = `
                <div> <strong>${shape.name} Formulas:</strong></div>
                <div>• Area = (√3/4) × a²</div>
                <div>• Perimeter = 3a</div>
                <div>• √3 = 1.732...</div>
            `;
        } else {
            formulasHtml = `
                <div> <strong>${shape.name} Formulas:</strong></div>
                <div>• Area = ${shape.calculate({}).formulas.area || 'N/A'}</div>
                <div>• Perimeter = ${shape.calculate({}).formulas.perimeter || shape.calculate({}).formulas.circumference || 'N/A'}</div>
            `;
        }
    } else {
        const sample = shape.calculate({ radius: 1, height: 1, side: 1 });
        formulasHtml = `
            <div><strong>${shape.name} Formulas:</strong></div>
            <div>• Volume = ${sample.formulas.volume || 'N/A'}</div>
        `;
        if (sample.formulas.surfaceArea) {
            formulasHtml += `<div>• Surface Area = ${sample.formulas.surfaceArea}</div>`;
        }
        if (sample.formulas.curvedSurface) {
            formulasHtml += `<div>• Curved Surface Area = ${sample.formulas.curvedSurface}</div>`;
        }
        if (sample.formulas.totalSurface) {
            formulasHtml += `<div>• Total Surface Area = ${sample.formulas.totalSurface}</div>`;
        }
        formulasHtml += `<div>• π = 3.14159...</div>`;
    }

    formulaContent.innerHTML = formulasHtml;
    document.getElementById('formula-ref').classList.remove('hidden');
}

// Format number for display
function formatNumber(num) {
    if (isNaN(num)) return '0';
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return parseFloat(num.toFixed(4)).toString();
}

// Calculate the selected shape
function calculateShape() {
    if (!currentShape) {
        document.getElementById('result-area').innerHTML = `
            <div class="error-box">
                <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
                Please select a shape first!
            </div>
        `;
        return;
    }

    const shape = shapeData[currentShape];
    const values = {};
    let isValid = true;
    let missingFields = [];

    // Collect all values
    for (let field of shape.fields) {
        const input = document.getElementById(`field-${field.id}`);
        if (!input) continue;

        const value = parseFloat(input.value.trim());

        if (isNaN(value)) {
            isValid = false;
            missingFields.push(field.label);
            input.style.borderColor = 'var(--color-error-border)';
        } else {
            values[field.id] = value;
            input.style.borderColor = '';
        }
    }

    if (!isValid) {
        document.getElementById('result-area').innerHTML = `
            <div class="error-box">
                <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
                Please fill all required fields: ${missingFields.join(', ')}
            </div>
        `;
        return;
    }

    // Calculate results
    const results = shape.calculate(values);

    // Display results
    displayResults(shape, results);
}

// Display calculation results
function displayResults(shape, results) {
    const area = document.getElementById('result-area');
    let resultsHtml = '';

    if (shape.dimension === '2d') {
        // 2D Results
        resultsHtml = `
            <div class="results-two-col">
                <div class="result-card">
                    <div class="result-card-title">
                        <span class="iconify" data-icon="tabler:chart-area" data-width="14"></span>
                        AREA
                    </div>
                    <div class="result-card-value">${formatNumber(results.area)}<span class="result-card-unit"> sq units</span></div>
                    <div class="result-card-detail">Formula: ${results.formulas.area}</div>
                </div>
                <div class="result-card">
                    <div class="result-card-title">
                        <span class="iconify" data-icon="tabler:chart-line" data-width="14"></span>
                        ${results.circumference ? 'CIRCUMFERENCE' : 'PERIMETER'}
                    </div>
                    <div class="result-card-value">${formatNumber(results.perimeter || results.circumference)}<span class="result-card-unit"> units</span></div>
                    <div class="result-card-detail">Formula: ${results.formulas.perimeter || results.formulas.circumference}</div>
                </div>
            </div>
        `;

        // Add step-by-step explanation
        resultsHtml += `
            <div class="result-card" style="background: var(--color-surface);">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:list-numbers" data-width="14"></span>
                    Step-by-Step Solution
                </div>
                <div class="result-card-detail">
                    ${getStepByStep2D(shape, results)}
                </div>
            </div>
        `;
    } else {
        // 3D Results
        resultsHtml = `
            <div class="result-card">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:cube" data-width="14"></span>
                    VOLUME
                </div>
                <div class="result-card-value">${formatNumber(results.volume)}<span class="result-card-unit"> cubic units</span></div>
                <div class="result-card-detail">Formula: ${results.formulas.volume}</div>
            </div>
        `;

        // Add surface area results
        if (results.surfaceArea) {
            resultsHtml += `
                <div class="result-card">
                    <div class="result-card-title">
                        <span class="iconify" data-icon="tabler:layout" data-width="14"></span>
                        TOTAL SURFACE AREA
                    </div>
                    <div class="result-card-value">${formatNumber(results.surfaceArea)}<span class="result-card-unit"> sq units</span></div>
                    <div class="result-card-detail">Formula: ${results.formulas.surfaceArea}</div>
                </div>
            `;
        }

        if (results.curvedSurface) {
            resultsHtml += `
                <div class="result-card">
                    <div class="result-card-title">
                        <span class="iconify" data-icon="tabler:chart-area" data-width="14"></span>
                        CURVED SURFACE AREA
                    </div>
                    <div class="result-card-value">${formatNumber(results.curvedSurface)}<span class="result-card-unit"> sq units</span></div>
                    <div class="result-card-detail">Formula: ${results.formulas.curvedSurface}</div>
                </div>
            `;
        }

        if (results.totalSurface) {
            resultsHtml += `
                <div class="result-card">
                    <div class="result-card-title">
                        <span class="iconify" data-icon="tabler:layout-grid" data-width="14"></span>
                        TOTAL SURFACE AREA
                    </div>
                    <div class="result-card-value">${formatNumber(results.totalSurface)}<span class="result-card-unit"> sq units</span></div>
                    <div class="result-card-detail">Formula: ${results.formulas.totalSurface}</div>
                </div>
            `;
        }

        // Add step-by-step explanation
        resultsHtml += `
            <div class="result-card" style="background: var(--color-surface);">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:list-numbers" data-width="14"></span>
                    Step-by-Step Solution
                </div>
                <div class="result-card-detail">
                    ${getStepByStep3D(shape, results)}
                </div>
            </div>
        `;
    }

    area.innerHTML = resultsHtml;
}

// Step by step for 2D shapes
function getStepByStep2D(shape, results) {
    const name = shape.name;
    let steps = '';

    if (name === 'Square') {
        steps = `Step 1: Area = side² = ${results.area} sq units<br>
                 Step 2: Perimeter = 4 × side = ${results.perimeter} units`;
    } else if (name === 'Rectangle') {
        steps = `Step 1: Area = length × breadth = ${results.area} sq units<br>
                 Step 2: Perimeter = 2 × (length + breadth) = ${results.perimeter} units`;
    } else if (name === 'Circle') {
        steps = `Step 1: Area = π × r² = ${results.area} sq units<br>
                 Step 2: Circumference = 2 × π × r = ${results.circumference} units<br>
                 Note: π ≈ 3.14159`;
    } else if (name === 'Triangle (General)') {
        steps = `Step 1: Area = ½ × base × height = ${results.area} sq units<br>
                 Step 2: Perimeter = side a + side b + side c = ${results.perimeter} units`;
    } else if (name === 'Right Triangle') {
        steps = `Step 1: Area = ½ × base × height = ${results.area} sq units<br>
                 Step 2: Hypotenuse = √(base² + height²)<br>
                 Step 3: Perimeter = base + height + hypotenuse = ${results.perimeter} units`;
    } else if (name === 'Equilateral Triangle') {
        steps = `Step 1: Area = (√3/4) × side² = ${results.area} sq units<br>
                 Step 2: Perimeter = 3 × side = ${results.perimeter} units<br>
                 Note: √3 ≈ 1.732`;
    } else {
        steps = `Area = ${results.area} sq units<br>
                 Perimeter = ${results.perimeter || results.circumference} units`;
    }

    return steps;
}

// Step by step for 3D shapes
function getStepByStep3D(shape, results) {
    const name = shape.name;
    let steps = '';

    if (name === 'Cube') {
        steps = `Step 1: Volume = side³ = ${results.volume} cubic units<br>
                 Step 2: Surface Area = 6 × side² = ${results.surfaceArea} sq units`;
    } else if (name === 'Cuboid') {
        steps = `Step 1: Volume = length × breadth × height = ${results.volume} cubic units<br>
                 Step 2: Surface Area = 2(lb + bh + lh) = ${results.surfaceArea} sq units`;
    } else if (name === 'Cylinder') {
        steps = `Step 1: Volume = π × r² × h = ${results.volume} cubic units<br>
                 Step 2: Curved Surface Area = 2 × π × r × h = ${results.curvedSurface} sq units<br>
                 Step 3: Total Surface Area = 2πr(r + h) = ${results.totalSurface} sq units<br>
                 Note: π ≈ 3.14159`;
    } else if (name === 'Cone') {
        steps = `Step 1: Slant Height (l) = √(r² + h²)<br>
                 Step 2: Volume = ⅓ × π × r² × h = ${results.volume} cubic units<br>
                 Step 3: Curved Surface Area = π × r × l = ${results.curvedSurface} sq units<br>
                 Step 4: Total Surface Area = πr(r + l) = ${results.totalSurface} sq units<br>
                 Note: π ≈ 3.14159`;
    } else if (name === 'Sphere') {
        steps = `Step 1: Volume = ⁴⁄₃ × π × r³ = ${results.volume} cubic units<br>
                 Step 2: Surface Area = 4 × π × r² = ${results.surfaceArea} sq units<br>
                 Note: π ≈ 3.14159`;
    } else if (name === 'Hemisphere') {
        steps = `Step 1: Volume = ⅔ × π × r³ = ${results.volume} cubic units<br>
                 Step 2: Curved Surface Area = 2 × π × r² = ${results.curvedSurface} sq units<br>
                 Step 3: Total Surface Area = 3 × π × r² = ${results.totalSurface} sq units<br>
                 Note: π ≈ 3.14159`;
    } else {
        steps = `Volume = ${results.volume} cubic units`;
    }

    return steps;
}

// Clear all inputs
function clearShape() {
    if (!currentShape) return;

    // Clear all input fields
    const shape = shapeData[currentShape];
    if (shape) {
        shape.fields.forEach(field => {
            const input = document.getElementById(`field-${field.id}`);
            if (input) {
                input.value = '';
                input.style.borderColor = '';
            }
        });
    }

    // Clear result area
    document.getElementById('result-area').innerHTML = '';
}

// Add enter key listeners
function addEnterKeyListeners() {
    const inputs = document.querySelectorAll('#input-fields input');
    inputs.forEach(input => {
        input.removeEventListener('keydown', handleEnterKey);
        input.addEventListener('keydown', handleEnterKey);
    });
}

function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculateShape();
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    // Set default active tab
    switchDimension('2d');
});