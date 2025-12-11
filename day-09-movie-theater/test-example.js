const fs = require("fs");

function solve(input) {
	const tiles = input
		.trim()
		.split("\n")
		.map((line) => {
			const [x, y] = line.split(",").map(Number);
			return { x, y };
		});

	console.log("Baldosas:", tiles);

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

	console.log("Segmentos horizontales:", horizontalSegments);
	console.log("Segmentos verticales:", verticalSegments);

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

		// Verificar el centro y puntos intermedios
		const cx = Math.floor((x1 + x2) / 2);
		const cy = Math.floor((y1 + y2) / 2);
		if (!isRedOrGreen(cx, cy)) return false;
		if (!isRedOrGreen(cx, y1)) return false;
		if (!isRedOrGreen(cx, y2)) return false;
		if (!isRedOrGreen(x1, cy)) return false;
		if (!isRedOrGreen(x2, cy)) return false;

		return true;
	}

	let maxArea = 0;
	let validRectangles = 0;
	let maxRect = null;

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
					maxRect = { x1, y1, x2, y2 };
					console.log(`Nuevo máximo: ${area} - De (${x1},${y1}) a (${x2},${y2})`);
				}
			}
		}
	}

	console.log(`\nTotal de rectángulos válidos: ${validRectangles}`);
	console.log(`Rectángulo máximo: (${maxRect.x1},${maxRect.y1}) a (${maxRect.x2},${maxRect.y2})`);
	return maxArea;
}

const input = fs.readFileSync("./example-input.txt", "utf-8");
const result = solve(input);
console.log(`\nÁrea máxima (parte 2): ${result}`);
console.log("Esperado: 24");
