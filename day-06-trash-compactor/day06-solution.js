const fs = require("fs");
const path = require("path");

function solve() {
	const inputPath = path.join(__dirname, "day06-input.txt");
	const fileContent = fs.readFileSync(inputPath, "utf-8");

	// Split into lines and remove any trailing newline at the very end of file
	const lines = fileContent.split(/\r?\n/);
	if (lines.length === 0) return;

	// We need to handle potential varying line lengths effectively,
	// although the problem implies a grid. We'll pad to max length just in case.
	const maxLength = Math.max(...lines.map((l) => l.length));
	const paddedLines = lines.map((l) => l.padEnd(maxLength, " "));

	// We'll iterate through columns to find problems.
	// Problems are separated by a full column of spaces.
	const problems = [];
	let currentBlockStart = -1;

	for (let col = 0; col < maxLength; col++) {
		// Check if this column is empty (all spaces)
		let isSeparator = true;
		for (const line of paddedLines) {
			if (line[col] !== " ") {
				isSeparator = false;
				break;
			}
		}

		if (isSeparator) {
			// If we were tracking a block, this ends it
			if (currentBlockStart !== -1) {
				problems.push({ start: currentBlockStart, end: col });
				currentBlockStart = -1;
			}
		} else {
			// If we weren't tracking a block, this starts one
			if (currentBlockStart === -1) {
				currentBlockStart = col;
			}
		}
	}

	// If the last block went to the end of the line
	if (currentBlockStart !== -1) {
		problems.push({ start: currentBlockStart, end: maxLength });
	}

	let grandTotal = 0;

	for (const problem of problems) {
		const { start, end } = problem;
		const blockLines = paddedLines.map((l) => l.slice(start, end));

		// The operator is in the last row that has content in this block
		// Actually, instructions say "at the bottom of the problem is the symbol".
		// Let's find the operator and the numbers.
		// We can parse each line of the block.

		// According to instructions:
		// "Each problem's numbers are arranged vertically"
		// "at the bottom of the problem is the symbol"

		// Let's extract all non-empty tokens from this block
		let numbers = [];
		let operator = null;

		// We scan from top to bottom
		// The last non-empty thing we find should be the operator + or *
		// Everything before that should be numbers.

		const tokens = [];
		for (const line of blockLines) {
			const trimmed = line.trim();
			if (trimmed) {
				tokens.push(trimmed);
			}
		}

		if (tokens.length === 0) continue;

		// The last token is the operator
		const lastToken = tokens[tokens.length - 1];

		if (lastToken === "+" || lastToken === "*") {
			operator = lastToken;
			// The rest are numbers
			numbers = tokens.slice(0, tokens.length - 1).map(Number);
		} else {
			// Maybe the operator is technically on the last line of the FILE, not just the block?
			// Based on the example:
			// 123
			//  45
			//   6
			// *
			// It seems strictly vertical. The operator is the last item.
			console.warn("Could not find valid operator for block:", tokens);
			continue;
		}

		// Perform operation
		let result = 0;
		if (operator === "+") {
			result = numbers.reduce((acc, val) => acc + val, 0);
		} else if (operator === "*") {
			result = numbers.reduce((acc, val) => acc * val, 1);
		}

		grandTotal += result;
	}

	console.log("Grand Total:", grandTotal);
}

solve();
