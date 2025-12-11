const fs = require("fs");

// Paso 1: Leer el archivo de input (limpiando \r de Windows)
const input = fs.readFileSync("./day-11-reactor-input.txt", "utf-8").trim().replace(/\r/g, "");

// Paso 2: Parsear el input y construir el grafo
function buildGraph(input) {
	const graph = {};

	for (const line of input.split("\n")) {
		// Cada línea tiene formato: "dispositivo: conexion1 conexion2 ..."
		const [device, connectionsStr] = line.split(": ");
		const connections = connectionsStr.split(" ");

		// Guardar las conexiones en el grafo
		graph[device] = connections;
	}

	return graph;
}

const graph = buildGraph(input);

// Paso 3: Buscar todos los caminos de 'you' a 'out' usando DFS
function countPaths(graph, start, end) {
	let pathCount = 0;

	// Función recursiva DFS
	function dfs(currentNode) {
		// Caso base: llegamos al destino
		if (currentNode === end) {
			pathCount++;
			return;
		}

		// Si el nodo no tiene conexiones salientes, terminamos esta rama
		if (!graph[currentNode]) {
			return;
		}

		// Exploramos cada conexión del nodo actual
		for (const neighbor of graph[currentNode]) {
			dfs(neighbor);
		}
	}

	dfs(start);
	return pathCount;
}

// Ejecutar la búsqueda
const totalPaths = countPaths(graph, "you", "out");
console.log("Número total de caminos de 'you' a 'out':", totalPaths);
