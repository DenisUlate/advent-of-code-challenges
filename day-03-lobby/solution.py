def solve():
    total_joltage = 0
    
    try:
        with open('day03-input.txt', 'r') as f:
            lines = f.readlines()
            
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            max_bank_joltage = 0
            
            # Iterate through each digit to be the first digit
            for i in range(len(line)):
                # Ensure the character is a digit
                if not line[i].isdigit():
                    continue
                    
                first_digit = int(line[i])
                
                # Iterate through subsequent digits to be the second digit
                for j in range(i + 1, len(line)):
                    if not line[j].isdigit():
                        continue
                        
                    second_digit = int(line[j])
                    
                    # Form the two-digit number
                    current_joltage = first_digit * 10 + second_digit
                    
                    if current_joltage > max_bank_joltage:
                        max_bank_joltage = current_joltage
            
            total_joltage += max_bank_joltage
            
        print(f"Total output joltage: {total_joltage}")

    except FileNotFoundError:
        print("Error: day03-input.txt not found.")

if __name__ == "__main__":
    solve()
