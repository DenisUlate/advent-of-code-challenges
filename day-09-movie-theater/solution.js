const fs = require("fs");

function solve(input) {
	// Paso 1: Parsear el input - convertir cada línea a coordenadas {x, y}
	const tiles = input
		.trim()
		.split("\n")
		.map((line) => {
			const [x, y] = line.split(",").map(Number);
			return { x, y };
		});

	// Paso 2: Encontrar el área máxima probando todos los pares
	let maxArea = 0;

	for (let i = 0; i < tiles.length; i++) {
		for (let j = i + 1; j < tiles.length; j++) {
			const p1 = tiles[i];
			const p2 = tiles[j];

			// Calcular dimensiones del rectángulo (incluyendo bordes)
			const width = Math.abs(p2.x - p1.x) + 1;
			const height = Math.abs(p2.y - p1.y) + 1;
			const area = width * height;

			if (area > maxArea) {
				maxArea = area;
			}
		}
	}

	return maxArea;
}

// Leer el archivo de input y ejecutar
const input = fs.readFileSync("./day-09-input.txt", "utf-8");
const result = solve(input);
console.log("Área máxima:", result);
