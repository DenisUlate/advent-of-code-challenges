const fs = require("fs");

const input = fs.readFileSync("./day-10-input.txt", "utf-8").trim().split("\n");

function parseLine(line) {
	const buttonMatches = line.match(/\([\d,]+\)/g);
	const buttons = buttonMatches.map((btn) => {
		const inner = btn.slice(1, -1);
		return inner.split(",").map(Number);
	});
	const joltageMatch = line.match(/\{([\d,]+)\}/);
	const joltage = joltageMatch[1].split(",").map(Number);
	return { buttons, joltage };
}

function solveMachine(buttons, target) {
	const numRows = target.length; // Number of counters (equations)
	const numCols = buttons.length; // Number of buttons (variables)

	// Build matrix A (transposed: columns are buttons effects)
	// A[row][col] is 1 if button col affects counter row
	const matrix = [];
	for (let r = 0; r < numRows; r++) {
		const row = [];
		for (let c = 0; c < numCols; c++) {
			row.push(buttons[c].includes(r) ? 1 : 0);
		}
		row.push(target[r]); // Augmented column
		matrix.push(row);
	}

	// Gaussian Elimination
	let pivotRow = 0;
	const pivots = new Array(numCols).fill(-1); // Stores row index for each col variable

	for (let col = 0; col < numCols && pivotRow < numRows; col++) {
		// Find pivot
		let sel = pivotRow;
		while (sel < numRows && matrix[sel][col] === 0) sel++;

		if (sel === numRows) continue; // No pivot in this column (free variable)

		// Swap rows
		[matrix[pivotRow], matrix[sel]] = [matrix[sel], matrix[pivotRow]];
		pivots[col] = pivotRow;

		// Normalize pivot row (not needed here since values are 1, but generally good)
		// Since we are doing integer arithmetic initially, but division might introduce fractions.
		// Let's stick to floating point JS numbers and check integers at end,
		// OR better: use fractional arithmetic if needed.
		// But simplest is standard float Guassian, then check for integer/epsilon.

		const pivotVal = matrix[pivotRow][col];
		for (let j = col; j <= numCols; j++) {
			matrix[pivotRow][j] /= pivotVal;
		}

		// Eliminate other rows
		for (let r = 0; r < numRows; r++) {
			if (r !== pivotRow && matrix[r][col] !== 0) {
				const factor = matrix[r][col];
				for (let j = col; j <= numCols; j++) {
					matrix[r][j] -= factor * matrix[pivotRow][j];
				}
			}
		}
		pivotRow++;
	}

	// Check for inconsistency (0 = non-zero)
	for (let r = pivotRow; r < numRows; r++) {
		if (Math.abs(matrix[r][numCols]) > 1e-9) return -1; // No solution
	}

	// Identify free variables
	const freeVars = []; // indices of free columns
	const basicVars = []; // indices of basic columns
	for (let c = 0; c < numCols; c++) {
		if (pivots[c] === -1) freeVars.push(c);
		else basicVars.push(c);
	}

	// Bounds for free variables
	const bounds = new Array(numCols).fill(Infinity);
	for (let c = 0; c < numCols; c++) {
		// Each button c contributes to some counters.
		// For each counter r affected by c: x_c <= target[r] (since others >= 0)
		// Wait, original target.
		for (let r = 0; r < numRows; r++) {
			if (buttons[c].includes(r)) {
				bounds[c] = Math.min(bounds[c], target[r]);
			}
		}
	}

	let minTotal = Infinity;

	// Helper for recursion on free variables
	function search(freeIdx, currentAssignment) {
		if (freeIdx === freeVars.length) {
			// All free vars assigned, calculate basic vars
			// Back substitution is already done by Gauss-Jordan (matrix is diagonal-ish)
			// For each basic var x_c:
			// x_c + sum(matrix[row_of_c][free] * x_free) = matrix[row_of_c][last]
			// x_c = matrix[row_of_c][last] - sum(...)

			let currentSum = 0;
			const finalAssignment = [...currentAssignment];
			let possible = true;

			for (let c = 0; c < numCols; c++) {
				if (pivots[c] !== -1) {
					// Basic variable
					const r = pivots[c];
					let val = matrix[r][numCols];
					for (const f of freeVars) {
						val -= matrix[r][f] * finalAssignment[f];
					}

					// check integer and non-negative
					if (val < -1e-9 || Math.abs(Math.round(val) - val) > 1e-9) {
						possible = false;
						break;
					}
					finalAssignment[c] = Math.round(val);
				}
				currentSum += finalAssignment[c];
			}

			if (possible) {
				if (currentSum < minTotal) minTotal = currentSum;
			}
			return;
		}

		const fVar = freeVars[freeIdx];
		// Ensure bounds are safe?
		// We can just iterate 0 to bounds[fVar].
		// To optimize, maybe check bounds?
		// Note: bounds[fVar] acts as a loose valid range.

		for (let val = 0; val <= bounds[fVar]; val++) {
			currentAssignment[fVar] = val;
			search(freeIdx + 1, currentAssignment);
			currentAssignment[fVar] = undefined;
		}
	}

	const initialAssignment = new Array(numCols).fill(0);
	search(0, initialAssignment);

	return minTotal === Infinity ? -1 : minTotal;
}

let grandTotal = 0;

for (let i = 0; i < input.length; i++) {
	const line = input[i].trim();
	if (!line) continue;
	const { buttons, joltage } = parseLine(line);

	const sol = solveMachine(buttons, joltage);
	if (sol !== -1) {
		grandTotal += sol;
		console.log(`Machine ${i + 1}: ${sol}`);
	} else {
		console.log(`Machine ${i + 1}: No solution`);
	}
}

console.log(`Final Result: ${grandTotal}`);
