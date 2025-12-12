const fs = require("fs");

// Paso 1: Leer el archivo de input (limpiando \r de Windows)
const input = fs.readFileSync("./day-11-reactor-input.txt", "utf-8").trim().replace(/\r/g, "");

// Paso 2: Parsear el input y construir el grafo
function buildGraph(input) {
	const graph = {};

	for (const line of input.split("\n")) {
		const [device, connectionsStr] = line.split(": ");
		const connections = connectionsStr.split(" ");
		graph[device] = connections;
	}

	return graph;
}

const graph = buildGraph(input);

// Paso 3: Buscar caminos de 'svr' a 'out' que pasen por AMBOS 'dac' y 'fft'
// Optimización: DFS con Memoización (Programación Dinámica)
function countPathsWithRequiredNodesOptimized(graph, start, end, requiredNodes) {
	const memo = new Map();

	// Convertimos requiredNodes a un Set para búsqueda rápida (aunque son pocos)
	const requiredSet = new Set(requiredNodes);

	function dfs(currentNode, foundMask) {
		// foundMask es un bitmask o string que representa qué nodos requeridos ya se han encontrado
		// 0: ninguno, 1: dac found, 2: fft found, 3: both found (si mapeamos dac->bit0, fft->bit1)

		// Generamos una clave única para el estado: NodoActual + MáscaraDeEncontrados
		const stateKey = `${currentNode}:${foundMask}`;

		if (memo.has(stateKey)) {
			return memo.get(stateKey);
		}

		// Caso base: llegamos al destino
		if (currentNode === end) {
			// Verificamos si la máscara indica que encontramos todos
			// Asumimos que la máscara 3 (binario 11) significa que encontramos los 2 nodos requeridos
			if (foundMask === 3) {
				return 1;
			}
			return 0;
		}

		if (!graph[currentNode]) {
			return 0;
		}

		let totalPaths = 0;

		for (const neighbor of graph[currentNode]) {
			let newMask = foundMask;

			// Actualizamos la máscara si el vecino es uno de los nodos requeridos
			if (neighbor === "dac") newMask |= 1; // Bit 0 para 'dac'
			if (neighbor === "fft") newMask |= 2; // Bit 1 para 'fft'

			totalPaths += dfs(neighbor, newMask);
		}

		// Guardamos en memo
		memo.set(stateKey, totalPaths);
		return totalPaths;
	}

	// Estado inicial: revisamos si start es uno de los nodos requeridos (poco probable pero correcto)
	let initialMask = 0;
	if (start === "dac") initialMask |= 1;
	if (start === "fft") initialMask |= 2;

	return dfs(start, initialMask);
}

// Ejecutar la búsqueda para Part 2
const requiredNodes = ["dac", "fft"];
console.time("Execution Time");
const totalPaths = countPathsWithRequiredNodesOptimized(graph, "svr", "out", requiredNodes);
console.timeEnd("Execution Time");

console.log("Caminos de 'svr' a 'out' que pasan por 'dac' y 'fft':", totalPaths);
