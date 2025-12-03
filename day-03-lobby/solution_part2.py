def solve():
    total_joltage = 0
    
    try:
        with open('day03-input.txt', 'r') as f:
            lines = f.readlines()
            
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if len(line) < 12:
                print(f"Skipping line '{line}': length {len(line)} is less than 12.")
                continue

            # We need to pick 12 digits
            digits_needed = 12
            current_index = 0
            result_digits = []
            
            while digits_needed > 0:
                # The range of valid indices for the next digit
                # We must leave (digits_needed - 1) characters after the chosen one.
                # So the last valid index is len(line) - digits_needed.
                # Python slice end is exclusive, so +1.
                search_end = len(line) - digits_needed + 1
                
                # Find the max digit in the valid range
                max_digit = '0'
                found_index = -1
                
                # Iterate through the valid range to find the max digit and its first occurrence
                for i in range(current_index, search_end):
                    if line[i] > max_digit:
                        max_digit = line[i]
                        found_index = i
                    # Optimization: If we find a '9', it's the max possible, so we can stop early
                    # because we want the first occurrence of the max digit.
                    if max_digit == '9':
                        break
                
                # If we didn't find a '9', we need to make sure we have the *first* occurrence of the max_digit found.
                # The loop above updates found_index whenever it finds a strictly greater digit.
                # But if we have "8...8", the first 8 sets max_digit to 8. The second 8 is not > 8, so found_index stays at the first one.
                # This is correct behavior for "first occurrence".
                
                result_digits.append(max_digit)
                current_index = found_index + 1
                digits_needed -= 1
            
            # Convert list of chars to int
            bank_joltage = int("".join(result_digits))
            total_joltage += bank_joltage
            
        print(f"Total output joltage: {total_joltage}")

    except FileNotFoundError:
        print("Error: day03-input.txt not found.")

if __name__ == "__main__":
    solve()
