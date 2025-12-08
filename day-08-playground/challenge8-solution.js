const fs = require("fs");
const path = require("path");

// --- Helper: Union-Find Data Structure ---
class UnionFind {
	constructor(size) {
		// parent[i] points to the parent of node i
		this.parent = new Int32Array(size);
		// size[i] stores the size of the set rooted at i
		this.size = new Int32Array(size);
		for (let i = 0; i < size; i++) {
			this.parent[i] = i;
			this.size[i] = 1;
		}
	}

	// Find the representative (root) of the set strictly
	find(i) {
		if (this.parent[i] === i) {
			return i;
		}
		// Path compression for efficiency
		this.parent[i] = this.find(this.parent[i]);
		return this.parent[i];
	}

	// Union the sets containing i and j
	union(i, j) {
		const rootI = this.find(i);
		const rootJ = this.find(j);

		if (rootI !== rootJ) {
			// Merge smaller tree into larger tree usually, but here arbitrary is fine
			// Or simple linking:
			this.parent[rootI] = rootJ;
			this.size[rootJ] += this.size[rootI];
			return true; // Merged
		}
		return false; // Already connected
	}

	// Get size of the component that i belongs to
	getSize(i) {
		return this.size[this.find(i)];
	}
}

function solve() {
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
	// (Squared is enough for sorting and avoids expensive sqrt)
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

	// Take top 1000 pairs
	const connectionsToMake = 1000;
	const topPairs = pairs.slice(0, connectionsToMake);

	// Process connections using Union-Find
	const uf = new UnionFind(n);

	for (const pair of topPairs) {
		uf.union(pair.u, pair.v);
	}

	// Collect all unique component sizes
	// We iterate over all nodes, find their root, and store the size of that root.
	// Using a Map or Set to count unique roots.
	const rootMap = new Map(); // rootId -> size
	for (let i = 0; i < n; i++) {
		const root = uf.find(i);
		if (!rootMap.has(root)) {
			rootMap.set(root, uf.getSize(root));
		}
	}

	const sizes = Array.from(rootMap.values());

	// Sort sizes descending
	sizes.sort((a, b) => b - a);

	console.log("Top sizes:", sizes.slice(0, 5));

	if (sizes.length < 3) {
		console.error("Less than 3 circuits found!");
		return;
	}

	const result = sizes[0] * sizes[1] * sizes[2];
	console.log(`Result (product of top 3): ${result}`);
}

solve();
