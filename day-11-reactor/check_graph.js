const fs = require("fs");

const input = fs
	.readFileSync("./day-11-reactor-input.txt", "utf-8")
	.trim()
	.replace(/\r/g, "");

const graph = {};
for (const line of input.split("\n")) {
	const [device, connectionsStr] = line.split(": ");
	graph[device] = connectionsStr.split(" ");
}

console.log("Nodes:", Object.keys(graph).length);

// Check for cycles
const visited = new Set();
const recStack = new Set();
let hasCycle = false;

function isCyclic(node) {
	if (!graph[node]) return false;
	if (recStack.has(node)) return true;
	if (visited.has(node)) return false;

	visited.add(node);
	recStack.add(node);

	for (const neighbor of graph[node]) {
		if (isCyclic(neighbor)) return true;
	}

	recStack.delete(node);
	return false;
}

for (const node in graph) {
	if (isCyclic(node)) {
		hasCycle = true;
		break;
	}
}

console.log("Has Cycle:", hasCycle);
