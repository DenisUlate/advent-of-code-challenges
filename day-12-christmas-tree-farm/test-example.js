// Test con el ejemplo del problema
const testInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

function normalize(coords) {
	if (coords.length === 0) return coords;
	const minX = Math.min(...coords.map((c) => c[0]));
	const minY = Math.min(...coords.map((c) => c[1]));
	return coords.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

function rotate90(coords) {
	return coords.map(([x, y]) => [-y, x]);
}
function flipH(coords) {
	return coords.map(([x, y]) => [-x, y]);
}

function getAllOrientations(coords) {
	const orientations = new Set();
	let current = coords;
	for (let flip = 0; flip < 2; flip++) {
		for (let rot = 0; rot < 4; rot++) {
			const normalized = normalize(current);
			orientations.add(JSON.stringify(normalized));
			current = rotate90(current);
		}
		current = flipH(coords);
	}
	return Array.from(orientations).map((s) => JSON.parse(s));
}

function canPlace(grid, coords, px, py, width, height) {
	for (const [x, y] of coords) {
		const nx = px + x,
			ny = py + y;
		if (nx < 0 || nx >= width || ny < 0 || ny >= height) return false;
		if (grid[ny][nx]) return false;
	}
	return true;
}

function place(grid, coords, px, py) {
	for (const [x, y] of coords) grid[py + y][px + x] = true;
}

function remove(grid, coords, px, py) {
	for (const [x, y] of coords) grid[py + y][px + x] = false;
}

// Versión simple: probar todas las posiciones
function solve(grid, presents, index, width, height) {
	if (index >= presents.length) return true;

	for (const coords of presents[index]) {
		for (let py = 0; py < height; py++) {
			for (let px = 0; px < width; px++) {
				if (canPlace(grid, coords, px, py, width, height)) {
					place(grid, coords, px, py);
					if (solve(grid, presents, index + 1, width, height)) return true;
					remove(grid, coords, px, py);
				}
			}
		}
	}
	return false;
}

// Parse
const lines = testInput.split("\n");
const shapes = [];
let i = 0;
while (i < lines.length && !lines[i].includes("x")) {
	const line = lines[i].trim();
	if (line.match(/^\d+:/)) {
		const shapeLines = [];
		i++;
		while (i < lines.length && lines[i].trim() !== "" && !lines[i].trim().match(/^\d+:/) && !lines[i].includes("x")) {
			shapeLines.push(lines[i]);
			i++;
		}
		const coords = [];
		for (let y = 0; y < shapeLines.length; y++) {
			for (let x = 0; x < shapeLines[y].length; x++) {
				if (shapeLines[y][x] === "#") coords.push([x, y]);
			}
		}
		shapes.push(coords);
	} else i++;
}

const regions = [];
while (i < lines.length) {
	const match = lines[i].match(/(\d+)x(\d+):\s*(.+)/);
	if (match) {
		regions.push({
			width: parseInt(match[1]),
			height: parseInt(match[2]),
			counts: match[3].split(/\s+/).map(Number),
		});
	}
	i++;
}

console.log("Formas:", shapes.length);
shapes.forEach((s, idx) => console.log(`  Forma ${idx}: area=${s.length}`));

let valid = 0;
regions.forEach((r, idx) => {
	const presents = [];
	let totalArea = 0;
	for (let si = 0; si < r.counts.length; si++) {
		totalArea += r.counts[si] * shapes[si].length;
		const orientations = getAllOrientations(shapes[si]);
		for (let c = 0; c < r.counts[si]; c++) presents.push(orientations);
	}

	console.log(`\nRegion ${idx + 1}: ${r.width}x${r.height} area=${r.width * r.height} needed=${totalArea}`);
	console.log(`  Regalos: ${presents.length}`);

	if (totalArea > r.width * r.height) {
		console.log("  -> FAIL (area)");
		return;
	}

	const grid = Array.from({ length: r.height }, () => Array(r.width).fill(false));

	console.log("  Buscando solución...");
	if (solve(grid, presents, 0, r.width, r.height)) {
		console.log("  -> PASS");
		valid++;
	} else {
		console.log("  -> FAIL (no solution)");
	}
});

console.log("\n=== Result:", valid, "===");
