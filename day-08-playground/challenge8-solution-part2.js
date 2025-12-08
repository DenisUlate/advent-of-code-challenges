const fs = require("fs");
const path = require("path");

// --- Helper: Union-Find Data Structure ---
class UnionFind {
	constructor(size) {
		this.parent = new Int32Array(size);
		this.size = new Int32Array(size);
		this.numComponents = size; // Track number of disjoint sets
		for (let i = 0; i < size; i++) {
			this.parent[i] = i;
			this.size[i] = 1;
		}
	}

	find(i) {
		if (this.parent[i] === i) {
			return i;
		}
		this.parent[i] = this.find(this.parent[i]);
		return this.parent[i];
	}

	union(i, j) {
		const rootI = this.find(i);
		const rootJ = this.find(j);

		if (rootI !== rootJ) {
			this.parent[rootI] = rootJ;
			this.size[rootJ] += this.size[rootI];
			this.numComponents--; // One less component after merging
			return true;
		}
		return false;
	}
}

function solvePart2() {
	const inputPath = path.join(__dirname, "challenge8-input.txt");
	const fileContent = fs.readFileSync(inputPath, "utf-8");

	// Parse points
	const points = fileContent
		.trim()
		.split("\n")
		.map((line, index) => {
			const [x, y, z] = line.trim().split(",").map(Number);
			return { id: index, x, y, z };
		});

	const n = points.length;
	console.log(`Parsed ${n} points.`);

	// Generate all pairs and calculate squared distances
	const pairs = [];
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const p1 = points[i];
			const p2 = points[j];
			const distSq =
				Math.pow(p1.x - p2.x, 2) +
				Math.pow(p1.y - p2.y, 2) +
				Math.pow(p1.z - p2.z, 2);
			pairs.push({ u: i, v: j, distSq });
		}
	}

	// Sort by distance ascending
	pairs.sort((a, b) => a.distSq - b.distSq);

	const uf = new UnionFind(n);

	// Iterate until all are connected
	for (const pair of pairs) {
		const merged = uf.union(pair.u, pair.v);

		if (merged) {
			// Check if fully connected
			if (uf.numComponents === 1) {
				const p1 = points[pair.u];
				const p2 = points[pair.v];
				console.log(`Last connection between index ${pair.u} and ${pair.v}`);
				console.log(`Coords 1: ${p1.x},${p1.y},${p1.z}`);
				console.log(`Coords 2: ${p2.x},${p2.y},${p2.z}`);

				const result = p1.x * p2.x;
				console.log(`Result (product of X coords): ${result}`);
				return;
			}
		}
	}
}

solvePart2();
