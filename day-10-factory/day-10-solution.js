const fs = require("fs");

// Leer el input
const input = fs.readFileSync("./day-10-input.txt", "utf-8").trim().split("\n");

/**
 * Parsea una línea del input y extrae:
 * - target: array de booleans (true = luz encendida)
 * - buttons: array de arrays, cada uno con los índices de luces que alterna
 */
function parseLine(line) {
	// Extraer el diagrama de luces [.##.]
	const lightMatch = line.match(/\[([.#]+)\]/);
	const lightDiagram = lightMatch[1];
	const target = lightDiagram.split("").map((c) => c === "#");

	// Extraer los botones (x,y,z) - solo los que están en paréntesis, no llaves
	const buttonMatches = line.match(/\([\d,]+\)/g);
	const buttons = buttonMatches.map((btn) => {
		const inner = btn.slice(1, -1); // quitar paréntesis
		return inner.split(",").map(Number);
	});

	return { target, buttons, numLights: target.length };
}

/**
 * Aplica un conjunto de botones y retorna el estado resultante.
 * Cada botón alterna las luces que indica.
 */
function applyButtons(numLights, buttons, buttonMask) {
	const state = new Array(numLights).fill(false);

	for (let i = 0; i < buttons.length; i++) {
		if (buttonMask & (1 << i)) {
			// Este botón está presionado
			for (const lightIdx of buttons[i]) {
				state[lightIdx] = !state[lightIdx];
			}
		}
	}

	return state;
}

/**
 * Compara dos estados de luces
 */
function statesEqual(state1, state2) {
	if (state1.length !== state2.length) return false;
	for (let i = 0; i < state1.length; i++) {
		if (state1[i] !== state2[i]) return false;
	}
	return true;
}

/**
 * Cuenta los bits en 1 de un número (número de botones presionados)
 */
function countBits(n) {
	let count = 0;
	while (n > 0) {
		count += n & 1;
		n >>= 1;
	}
	return count;
}

/**
 * Encuentra el mínimo número de botones necesarios para alcanzar el target.
 * Usa búsqueda por fuerza bruta con optimización por número de bits.
 */
function findMinPresses(target, buttons, numLights) {
	const totalButtons = buttons.length;

	// Para pocos botones, podemos usar fuerza bruta
	// Probamos desde 0 botones hasta todos los botones
	for (let numPresses = 0; numPresses <= totalButtons; numPresses++) {
		// Generar todas las combinaciones de exactamente numPresses botones
		const found = findCombination(target, buttons, numLights, totalButtons, numPresses);
		if (found !== -1) {
			return numPresses;
		}
	}

	return -1; // No se encontró solución
}

/**
 * Busca si existe una combinación de exactamente k botones que alcance el target
 */
function findCombination(target, buttons, numLights, totalButtons, k) {
	// Iterar sobre todas las máscaras con exactamente k bits en 1
	for (let mask = 0; mask < 1 << totalButtons; mask++) {
		if (countBits(mask) === k) {
			const state = applyButtons(numLights, buttons, mask);
			if (statesEqual(state, target)) {
				return mask;
			}
		}
	}
	return -1;
}

// Procesar todas las máquinas
let totalPresses = 0;

for (let i = 0; i < input.length; i++) {
	const line = input[i].trim();
	if (!line) continue;

	const { target, buttons, numLights } = parseLine(line);
	const minPresses = findMinPresses(target, buttons, numLights);

	console.log(`Máquina ${i + 1}: ${minPresses} pulsaciones`);

	if (minPresses === -1) {
		console.log(`  ⚠️ No se encontró solución para la máquina ${i + 1}`);
	} else {
		totalPresses += minPresses;
	}
}

console.log(`\n✅ Total de pulsaciones mínimas: ${totalPresses}`);
