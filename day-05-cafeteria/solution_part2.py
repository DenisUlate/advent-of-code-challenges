def solve():
    with open('day5-input.txt', 'r') as f:
        content = f.read()

    # Split into ranges and ids (we only need ranges for part 2)
    parts = content.strip().split('\n\n')
    ranges_lines = parts[0].splitlines()

    # Parse ranges
    ranges = []
    for line in ranges_lines:
        start, end = map(int, line.split('-'))
        ranges.append((start, end))

    # Sort ranges by start value
    ranges.sort(key=lambda x: x[0])

    merged_ranges = []
    if not ranges:
        print(0)
        return

    # Start with the first range
    current_start, current_end = ranges[0]

    for i in range(1, len(ranges)):
        next_start, next_end = ranges[i]

        # Check for overlap or adjacency
        # Since we are counting integers, [1, 2] and [3, 4] can be merged into [1, 4]
        # because the count is the same.
        if next_start <= current_end + 1:
            current_end = max(current_end, next_end)
        else:
            merged_ranges.append((current_start, current_end))
            current_start, current_end = next_start, next_end

    # Append the last range
    merged_ranges.append((current_start, current_end))

    total_fresh_count = 0
    for start, end in merged_ranges:
        total_fresh_count += (end - start + 1)

    print(f"Total fresh ingredient IDs: {total_fresh_count}")

if __name__ == "__main__":
    solve()
