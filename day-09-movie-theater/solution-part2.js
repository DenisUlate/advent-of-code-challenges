const fs = require("fs");

function solve(input) {
	const tiles = input
		.trim()
		.split("\n")
		.map((line) => {
			const [x, y] = line.split(",").map(Number);
			return { x, y };
		});

	const horizontalSegments = [];
	const verticalSegments = [];

	for (let i = 0; i < tiles.length; i++) {
		const current = tiles[i];
		const next = tiles[(i + 1) % tiles.length];

		if (current.y === next.y) {
			horizontalSegments.push({
				y: current.y,
				x1: Math.min(current.x, next.x),
				x2: Math.max(current.x, next.x),
			});
		} else {
			verticalSegments.push({
				x: current.x,
				y1: Math.min(current.y, next.y),
				y2: Math.max(current.y, next.y),
			});
		}
	}

	function isOnBorder(px, py) {
		for (const seg of horizontalSegments) {
			if (py === seg.y && px >= seg.x1 && px <= seg.x2) return true;
		}
		for (const seg of verticalSegments) {
			if (px === seg.x && py >= seg.y1 && py <= seg.y2) return true;
		}
		return false;
	}

	function isInsidePolygon(px, py) {
		let crossings = 0;
		for (const seg of verticalSegments) {
			if (seg.x > px && py >= seg.y1 && py < seg.y2) {
				crossings++;
			}
		}
		return crossings % 2 === 1;
	}

	function isRedOrGreen(px, py) {
		return isOnBorder(px, py) || isInsidePolygon(px, py);
	}

	function isRectangleValid(x1, y1, x2, y2) {
		// Verificar las 4 esquinas
		if (!isRedOrGreen(x1, y1)) return false;
		if (!isRedOrGreen(x1, y2)) return false;
		if (!isRedOrGreen(x2, y1)) return false;
		if (!isRedOrGreen(x2, y2)) return false;

		// Verificar todos los puntos de los 4 bordes del rectángulo
		for (let x = x1; x <= x2; x++) {
			if (!isRedOrGreen(x, y1)) return false;
			if (!isRedOrGreen(x, y2)) return false;
		}
		for (let y = y1; y <= y2; y++) {
			if (!isRedOrGreen(x1, y)) return false;
			if (!isRedOrGreen(x2, y)) return false;
		}

		// Verificar puntos internos con muestreo
		// Para rectángulos grandes, muestrear cada ~100 unidades
		const sampleStep = Math.max(1, Math.floor(Math.min(x2 - x1, y2 - y1) / 10));
		for (let x = x1; x <= x2; x += sampleStep) {
			for (let y = y1; y <= y2; y += sampleStep) {
				if (!isRedOrGreen(x, y)) return false;
			}
		}

		return true;
	}

	let maxArea = 0;
	let validRectangles = 0;

	for (let i = 0; i < tiles.length; i++) {
		for (let j = i + 1; j < tiles.length; j++) {
			const p1 = tiles[i];
			const p2 = tiles[j];

			const x1 = Math.min(p1.x, p2.x);
			const x2 = Math.max(p1.x, p2.x);
			const y1 = Math.min(p1.y, p2.y);
			const y2 = Math.max(p1.y, p2.y);

			if (isRectangleValid(x1, y1, x2, y2)) {
				validRectangles++;
				const area = (x2 - x1 + 1) * (y2 - y1 + 1);
				if (area > maxArea) {
					maxArea = area;
				}
			}
		}
	}

	console.log(`Total de rectángulos válidos: ${validRectangles}`);
	return maxArea;
}

const input = fs.readFileSync("./day-09-input.txt", "utf-8");
const parsedTiles = input
	.trim()
	.split("\n")
	.map((line) => {
		const [x, y] = line.split(",").map(Number);
		return { x, y };
	});
console.log("Número de baldosas rojas:", parsedTiles.length);

const result = solve(input);
console.log("Área máxima (parte 2):", result);
