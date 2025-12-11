const fs = require("fs");

// Leer el input debug
const input = fs
	.readFileSync("./day-10-input-small.txt", "utf-8")
	.trim()
	.split("\n");

/**
 * Parsea una línea del input y extrae:
 * - buttons: array de arrays, cada uno con los índices de contadores que incrementa
 * - joltage: array con los valores objetivo de joltaje
 */
function parseLine(line) {
	// Ignorar el diagrama de luces [...] - solo importa para parte 1

	// Extraer los botones (x,y,z) - solo los que están en paréntesis
	const buttonMatches = line.match(/\([\d,]+\)/g);
	const buttons = buttonMatches.map((btn) => {
		const inner = btn.slice(1, -1); // quitar paréntesis
		return inner.split(",").map(Number);
	});

	// Extraer los requisitos de joltaje {x,y,z}
	const joltageMatch = line.match(/\{([\d,]+)\}/);
	const joltage = joltageMatch[1].split(",").map(Number);

	return { buttons, joltage };
}

/**
 * Resuelve usando búsqueda DFS con poda.
 * Para cada botón, probamos diferentes cantidades de pulsaciones (0 hasta el máximo útil).
 */
function solveDFS(buttons, target) {
	const numCounters = target.length;
	const numButtons = buttons.length;

	// Convertir botones a efectos en contadores
	const effects = buttons.map((btn) => {
		const effect = new Array(numCounters).fill(0);
		for (const idx of btn) {
			if (idx < numCounters) {
				effect[idx] = 1;
			}
		}
		return effect;
	});

	let best = Infinity;

	function dfs(btnIdx, state, presses) {
		// Poda: si ya superamos el mejor resultado, abandonar
		if (presses >= best) return;

		// Si alcanzamos el objetivo, actualizar mejor resultado
		if (state.every((v, i) => v === target[i])) {
			best = presses;
			return;
		}

		// Si procesamos todos los botones sin alcanzar el objetivo, terminar
		if (btnIdx >= numButtons) return;

		// Si algún contador excede el objetivo, esta rama no es válida
		if (state.some((v, i) => v > target[i])) return;

		const effect = effects[btnIdx];

		// Calcular el máximo de pulsaciones útiles para este botón
		let maxPresses = Infinity;
		for (let i = 0; i < numCounters; i++) {
			if (effect[i] > 0) {
				const remaining = target[i] - state[i];
				maxPresses = Math.min(maxPresses, remaining);
			}
		}

		// Si el botón no afecta a ningún contador, no tiene sentido presionarlo
		if (maxPresses === Infinity) maxPresses = 0;

		// Probar diferentes cantidades de pulsaciones (de más a menos para encontrar soluciones rápido)
		for (let p = maxPresses; p >= 0; p--) {
			const newState = state.map((v, i) => v + effect[i] * p);
			dfs(btnIdx + 1, newState, presses + p);
		}
	}

	const initialState = new Array(numCounters).fill(0);
	dfs(0, initialState, 0);

	return best === Infinity ? -1 : best;
}

// Procesar todas las máquinas
let totalPresses = 0;
let machineCount = 0;

for (let i = 0; i < input.length; i++) {
	const line = input[i].trim();
	if (!line) continue;

	machineCount++;
	const { buttons, joltage } = parseLine(line);
	console.log(`Processing Machine ${machineCount}...`);
	const minPresses = solveDFS(buttons, joltage);

	console.log(`Máquina ${machineCount}: ${minPresses} pulsaciones`);

	if (minPresses === -1) {
		console.log(`  ⚠️ No se encontró solución para la máquina ${machineCount}`);
	} else {
		totalPresses += minPresses;
	}
}

console.log(`\n✅ Total de pulsaciones mínimas (Parte 2): ${totalPresses}`);
