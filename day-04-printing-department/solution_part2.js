const fs = require("fs");
const path = require("path");

function solvePart2() {
	try {
		// 1. Leer el archivo de entrada
		const inputPath = path.join(__dirname, "day4-input.txt");
		const rawInput = fs.readFileSync(inputPath, "utf8");

		// Convertir el input en una matriz de caracteres
		let grid = rawInput
			.trim()
			.split("\n")
			.map((row) => row.trim().split(""));

		const height = grid.length;
		const width = grid[0].length;

		let totalRemoved = 0;

		// Definir las 8 direcciones posibles para los vecinos
		const directions = [
			[-1, -1],
			[0, -1],
			[1, -1],
			[-1, 0],
			[1, 0],
			[-1, 1],
			[0, 1],
			[1, 1],
		];

		while (true) {
			const toRemove = [];

			// 2. Recorrer cada celda para encontrar cuáles eliminar en este paso
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					if (grid[y][x] === "@") {
						let neighborRolls = 0;

						// Contar vecinos que son rollos (@)
						for (const [dx, dy] of directions) {
							const nx = x + dx;
							const ny = y + dy;

							if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
								if (grid[ny][nx] === "@") {
									neighborRolls++;
								}
							}
						}

						// Si tiene menos de 4 vecinos rollos, es accesible y se puede eliminar
						if (neighborRolls < 4) {
							toRemove.push({ x, y });
						}
					}
				}
			}

			// 3. Si no hay nada que eliminar, terminamos
			if (toRemove.length === 0) {
				break;
			}

			// 4. Eliminar los rollos identificados (actualizar la cuadrícula)
			for (const { x, y } of toRemove) {
				grid[y][x] = "."; // Marcar como espacio vacío o eliminado
			}

			// 5. Sumar al total
			totalRemoved += toRemove.length;

			// Opcional: Mostrar progreso
			// console.log(`Removed ${toRemove.length} rolls in this step.`);
		}

		console.log(`Total de rollos de papel eliminados (Parte 2): ${totalRemoved}`);
	} catch (error) {
		console.error("Error al leer el archivo o procesar los datos:", error);
	}
}

solvePart2();
