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
function countPathsWithRequiredNodes(graph, start, end, requiredNodes) {
	let pathCount = 0;

	// Función recursiva DFS que rastrea el camino actual
	function dfs(currentNode, path) {
		// Añadimos el nodo actual al camino
		path.push(currentNode);

		// Caso base: llegamos al destino
		if (currentNode === end) {
			// Verificamos si el camino contiene TODOS los nodos requeridos
			const hasAllRequired = requiredNodes.every((node) => path.includes(node));
			if (hasAllRequired) {
				pathCount++;
			}
			path.pop(); // Backtrack
			return;
		}

		// Si el nodo no tiene conexiones salientes, terminamos esta rama
		if (!graph[currentNode]) {
			path.pop(); // Backtrack
			return;
		}

		// Exploramos cada conexión del nodo actual
		for (const neighbor of graph[currentNode]) {
			dfs(neighbor, path);
		}

		path.pop(); // Backtrack al salir de este nodo
	}

	dfs(start, []);
	return pathCount;
}

// Ejecutar la búsqueda para Part 2
const requiredNodes = ["dac", "fft"];
const totalPaths = countPathsWithRequiredNodes(graph, "svr", "out", requiredNodes);
console.log("Caminos de 'svr' a 'out' que pasan por 'dac' y 'fft':", totalPaths);
