const fs = require("fs");
const path = require("path");

function solve() {
	try {
		// 1. Leer el archivo de entrada
		const inputPath = path.join(__dirname, "day4-input.txt");
		const rawInput = fs.readFileSync(inputPath, "utf8");

		// Convertir el input en una matriz de caracteres, eliminando espacios en blanco extra
		const grid = rawInput
			.trim()
			.split("\n")
			.map((row) => row.trim().split(""));

		const height = grid.length;
		const width = grid[0].length;

		let accessibleCount = 0;

		// Definir las 8 direcciones posibles para los vecinos (dx, dy)
		// Arriba-Izquierda, Arriba, Arriba-Derecha, Izquierda, Derecha, Abajo-Izquierda, Abajo, Abajo-Derecha
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

		// 2. Recorrer cada celda de la cuadrícula
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// Solo nos interesan los rollos de papel (@)
				if (grid[y][x] === "@") {
					let neighborRolls = 0;

					// 3. Revisar los 8 vecinos
					for (const [dx, dy] of directions) {
						const nx = x + dx;
						const ny = y + dy;

						// Verificar que el vecino esté dentro de los límites del mapa
						if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
							if (grid[ny][nx] === "@") {
								neighborRolls++;
							}
						}
					}

					// 4. Aplicar la regla: accesible si tiene menos de 4 vecinos que sean rollos
					if (neighborRolls < 4) {
						accessibleCount++;
					}
				}
			}
		}

		console.log(`Total de rollos de papel accesibles: ${accessibleCount}`);
	} catch (error) {
		console.error("Error al leer el archivo o procesar los datos:", error);
	}
}

solve();
