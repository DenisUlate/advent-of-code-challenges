const fs = require("fs");

function solve() {
	try {
		const input = fs.readFileSync("day07-input.txt", "utf8");
		const lines = input.split(/\r?\n/).filter((line) => line.length > 0);

		if (lines.length === 0) return;

		const height = lines.length;
		const width = lines[0].length;

		// Current row counts. Index c holds the number of timelines at column c in the current row.
		// Initialize with 0n (BigInt)
		let counts = new Array(width).fill(0n);
		let completedTimelines = 0n;

		// Find Start S and initialize counts
		// We scan the whole grid for S, but realistically S is likely at the top.
		// If S is at row r, we can just start the simulation from top, and add 1 to counts when we hit row r?
		// No, simpler: Initialize counts to 0. When we iterate row r, if we find S, we ADD 1 to its count before processing?
		// Or finding S beforehand and initing the array?
		// If S is at row 0, init array has 1 at S.
		// If S is at row 10, rows 0-9 are empty.
		// Let's just iterate rows. At the start of processing row r, check if S is there.

		// Actually, if S is at (r, c), it *emits* a beam.
		// The beam *enters* (r, c). Wait. "Incoming tachyon beam extends downward from S".
		// This implies the beam starts AT S.
		// So at the beginning of the simulation (before processing row r), if S is in row r, we add 1 to that slot.
		// BUT wait. If S is at (0, 7).
		// Processing Row 0:
		//   Inject 1 at counts[7].
		//   Process counts[7] (which is S):
		//     Since S acts like '.', it passes to nextRow[7].
		// This seems correct.

		// Optimization: Pre-find S coordinates to avoid scanning every row char-by-char if we want,
		// but scanning is cheap for this grid size.

		for (let r = 0; r < height; r++) {
			// 1. Inject Source beam if S is in this row
			for (let c = 0; c < width; c++) {
				if (lines[r][c] === "S") {
					counts[c] += 1n; // Add a timeline start
				}
			}

			let nextRowCounts = new Array(width).fill(0n);

			for (let c = 0; c < width; c++) {
				const count = counts[c];
				if (count === 0n) continue;

				const char = lines[r][c];

				if (char === "^") {
					// Splits to Left and Right
					// Left (c-1)
					if (c - 1 < 0) {
						completedTimelines += count;
					} else {
						nextRowCounts[c - 1] += count;
					}

					// Right (c+1)
					if (c + 1 >= width) {
						completedTimelines += count;
					} else {
						nextRowCounts[c + 1] += count; // Use c+1 here, checked carefully
					}
				} else {
					// '.' or 'S' or anything else passes straight down
					// Straight (c)
					// If this passes straight down, it goes to nextRowCounts[c]
					// If it's the last row, it will be added to completedTimelines AFTER the loop?
					// No, nextRowCounts represents the input to row r+1.
					// If r is the last row, nextRowCounts corresponds to "exiting the bottom".
					nextRowCounts[c] += count;
				}
			}

			counts = nextRowCounts;
		}

		// After the loop, 'counts' holds the beams that would enter row `height`.
		// These have all exited the bottom of the manifold.
		for (let c = 0; c < width; c++) {
			completedTimelines += counts[c];
		}

		console.log("Total Timelines:", completedTimelines.toString());
	} catch (err) {
		console.error("Error:", err);
	}
}

solve();
