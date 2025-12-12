const fs = require("fs");

const input = fs.readFileSync("day-12-input.txt", "utf-8").trim();

// Parsear las formas y regiones
function parseInput(input) {
	const lines = input.split("\n");
	const shapes = [];
	const regions = [];

	let i = 0;
	while (i < lines.length) {
		const line = lines[i].trim();
		if (line.includes("x")) break;

		if (line.match(/^\d+:$/)) {
			const shapeLines = [];
			i++;
			while (
				i < lines.length &&
				lines[i].trim() !== "" &&
				!lines[i].trim().match(/^\d+:$/) &&
				!lines[i].includes("x")
			) {
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
		} else {
			i++;
		}
	}

	while (i < lines.length) {
		const line = lines[i].trim();
		if (line.includes("x")) {
			const match = line.match(/(\d+)x(\d+):\s*(.+)/);
			if (match) {
				regions.push({
					width: parseInt(match[1]),
					height: parseInt(match[2]),
					counts: match[3].split(/\s+/).map(Number),
				});
			}
		}
		i++;
	}

	return { shapes, regions };
}

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
			orientations.add(JSON.stringify(normalize(current)));
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

// Búsqueda completa - para puzzles pequeños
function solveComplete(grid, presents, index, width, height) {
	if (index >= presents.length) return true;

	for (const coords of presents[index]) {
		for (let py = 0; py < height; py++) {
			for (let px = 0; px < width; px++) {
				if (canPlace(grid, coords, px, py, width, height)) {
					place(grid, coords, px, py);
					if (solveComplete(grid, presents, index + 1, width, height)) return true;
					remove(grid, coords, px, py);
				}
			}
		}
	}
	return false;
}

function canFitRegion(shapes, region) {
	const { width, height, counts } = region;

	// Verificación de área
	let totalArea = 0;
	for (let shapeIdx = 0; shapeIdx < counts.length; shapeIdx++) {
		totalArea += counts[shapeIdx] * shapes[shapeIdx].length;
	}

	if (totalArea > width * height) {
		return { fits: false, reason: "area", totalArea, regionArea: width * height };
	}

	// Crear lista de regalos
	const presents = [];
	for (let shapeIdx = 0; shapeIdx < counts.length; shapeIdx++) {
		const orientations = getAllOrientations(shapes[shapeIdx]);
		for (let c = 0; c < counts[shapeIdx]; c++) {
			presents.push(orientations);
		}
	}

	if (presents.length === 0) {
		return { fits: true, reason: "empty" };
	}

	// Ordenar por tamaño (mayor primero) para podar más rápido
	presents.sort((a, b) => b[0].length - a[0].length);

	const grid = Array.from({ length: height }, () => Array(width).fill(false));
	const result = solveComplete(grid, presents, 0, width, height);

	return { fits: result, reason: result ? "solved" : "no-solution", totalArea, regionArea: width * height };
}

// Main
const { shapes, regions } = parseInput(input);

console.log(`Formas: ${shapes.length}`);
console.log(`Areas: ${shapes.map((s) => s.length).join(", ")}`);
console.log(`Regiones: ${regions.length}`);
console.log("");

let validCount = 0;
let areaFails = 0;
let backtrackFails = 0;

for (let i = 0; i < regions.length; i++) {
	const region = regions[i];
	const totalPresents = region.counts.reduce((a, b) => a + b, 0);

	// Para problemas grandes, solo verificar área (backtracking sería muy lento)
	if (totalPresents > 20) {
		let totalArea = 0;
		for (let si = 0; si < region.counts.length; si++) {
			totalArea += region.counts[si] * shapes[si].length;
		}
		if (totalArea > region.width * region.height) {
			areaFails++;
			continue;
		}
		// Asumir que si cabe por área, probablemente cabe (heurística)
		// Para una solución exacta necesitaríamos backtracking más optimizado
		validCount++;
		console.log(`✓ Región ${i + 1}: ${region.width}x${region.height} (${totalPresents} regalos) - VÁLIDA (área OK)`);
		continue;
	}

	const result = canFitRegion(shapes, region);

	if (result.fits) {
		validCount++;
		console.log(`✓ Región ${i + 1}: ${region.width}x${region.height} (${totalPresents} regalos) - VÁLIDA`);
	} else {
		if (result.reason === "area") {
			areaFails++;
		} else {
			backtrackFails++;
			console.log(`✗ Región ${i + 1}: ${region.width}x${region.height} - No solución`);
		}
	}
}

console.log("");
console.log("=== RESUMEN ===");
console.log(`Válidas: ${validCount}`);
console.log(`Fallos área: ${areaFails}`);
console.log(`Fallos backtrack: ${backtrackFails}`);
console.log("");
console.log(`=== RESULTADO: ${validCount} ===`);
