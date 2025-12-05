def solve():
    with open('day5-input.txt', 'r') as f:
        content = f.read()

    # Split into ranges and ids
    parts = content.strip().split('\n\n')
    ranges_lines = parts[0].splitlines()
    ids_lines = parts[1].splitlines()

    # Parse ranges
    ranges = []
    for line in ranges_lines:
        start, end = map(int, line.split('-'))
        ranges.append((start, end))

    # Parse IDs
    ids = []
    for line in ids_lines:
        ids.append(int(line))

    fresh_count = 0
    
    for ingredient_id in ids:
        is_fresh = False
        for start, end in ranges:
            if start <= ingredient_id <= end:
                is_fresh = True
                break
        
        if is_fresh:
            fresh_count += 1

    print(f"Fresh ingredients count: {fresh_count}")

if __name__ == "__main__":
    solve()
