const fs = require("fs");

function solve() {
	const input = fs.readFileSync("day07-input.txt", "utf8");
	const lines = input.split(/\r?\n/).filter((line) => line.length > 0);
	const height = lines.length;
	const width = lines[0].length;

	let beams = new Set();

	// Find Start
	let startFound = false;
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (lines[r][c] === "S") {
				beams.add(c);
				startFound = true; // Optimization: assume only one start, but maybe we should scan
				// Assuming beams start dropping from the row OF 'S'.
				// If S is at row 0, we process row 0.
			}
		}
	}

	// Actually, usually 'S' is on the top or beams enter.
	// The previous example showed S inside the grid.
	// The beam moves DOWN.
	// So if S is at (r, c), the beam enters (r, c) and then falls to (r+1, c).
	// The loop should handle row by row.
	// But wait, if S is at row 10, rows 0-9 have no beams.
	// But my loop over rows will handle empty sets correctly.
	// The only issue is finding S first.
	// Or we can just iterate all rows and check for S?
	// No, S is just a source. If we iterate row 0 to N, we need to pick up S when we hit its row.
	// But S produces a beam *downward*.
	// So at row `r_s`, we have a beam at `c_s`.
	// It passes through `r_s` and enters `r_s + 1`.

	// Revised logic:
	// Iterate rows 0 to height-1.
	// At start of loop for row `r`, we have `beams` (Set of cols entering this row).
	// ALSO check for 'S' in this row and ADD it to `beams`?
	// "Incoming tachyon beam extends downward FROM S".
	// So at row of S, beam starts.

	// Let's restart beams logic strictly.
	beams = new Set();
	let splitCount = 0;

	for (let r = 0; r < height; r++) {
		// 1. Check for any NEW beams starting at this row (S)
		for (let c = 0; c < width; c++) {
			if (lines[r][c] === "S") {
				beams.add(c);
			}
		}

		// 2. Process current beams at this row
		let nextRowBeams = new Set();

		for (let c of beams) {
			if (c < 0 || c >= width) continue; // Out of bounds

			const char = lines[r][c];

			if (char === "^") {
				splitCount++;
				// Split outcomes go to next row, cols left and right
				nextRowBeams.add(c - 1);
				nextRowBeams.add(c + 1);
			} else {
				// S or . or anything else (assuming just pass through)
				// Beam continues straight down
				nextRowBeams.add(c);
			}
		}

		beams = nextRowBeams;
	}

	console.log("Total Splits:", splitCount);
}

solve();
