const fs = require("fs");
const path = require("path");

function solve() {
	const inputPath = path.join(__dirname, "day06-input.txt");
	const fileContent = fs.readFileSync(inputPath, "utf-8");

	const lines = fileContent.split(/\r?\n/);
	if (lines.length === 0) return;

	const maxLength = Math.max(...lines.map((l) => l.length));
	const paddedLines = lines.map((l) => l.padEnd(maxLength, " "));

	// Identify problem blocks columns
	const problems = [];
	let currentBlockStart = -1;

	for (let col = 0; col < maxLength; col++) {
		let isSeparator = true;
		for (const line of paddedLines) {
			if (line[col] !== " ") {
				isSeparator = false;
				break;
			}
		}

		if (isSeparator) {
			if (currentBlockStart !== -1) {
				problems.push({ start: currentBlockStart, end: col });
				currentBlockStart = -1;
			}
		} else {
			if (currentBlockStart === -1) {
				currentBlockStart = col;
			}
		}
	}

	if (currentBlockStart !== -1) {
		problems.push({ start: currentBlockStart, end: maxLength });
	}

	let grandTotal = 0;

	for (const problem of problems) {
		const { start, end } = problem;
		const blockWidth = end - start;

		// Find operator in this block
		let operator = null;
		for (let col = start; col < end; col++) {
			for (const line of paddedLines) {
				const char = line[col];
				if (char === "+" || char === "*") {
					operator = char;
					break;
				}
			}
			if (operator) break;
		}

		if (!operator) {
			console.warn("No operator found for block starting at", start);
			continue;
		}

		const numbers = [];

		// Scan each column in the block to find numbers
		for (let col = start; col < end; col++) {
			let colStr = "";
			for (const line of paddedLines) {
				colStr += line[col];
			}

			// Extract digits only
			const digits = colStr.replace(/\D/g, "");
			if (digits.length > 0) {
				numbers.push(parseInt(digits, 10));
			}
		}

		let result = 0;
		if (operator === "+") {
			result = numbers.reduce((acc, val) => acc + val, 0);
		} else if (operator === "*") {
			result = numbers.reduce((acc, val) => acc * val, 1);
		}

		grandTotal += result;
	}

	console.log("Grand Total Part 2:", grandTotal);
}

solve();
