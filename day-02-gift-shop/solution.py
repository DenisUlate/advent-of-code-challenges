def solve():
    # Leer el archivo de entrada
    with open('day02-input.txt', 'r') as f:
        content = f.read().strip()
    
    # Parsear los rangos
    # El formato es "start-end,start-end,..."
    ranges_raw = content.split(',')
    ranges = []
    max_val = 0
    
    for r in ranges_raw:
        if not r.strip():
            continue
        start_s, end_s = r.split('-')
        start = int(start_s)
        end = int(end_s)
        ranges.append((start, end))
        if end > max_val:
            max_val = end
            
    print(f"Max value in ranges: {max_val}")
    
    # Generar IDs inválidos
    # Un ID inválido es una secuencia repetida dos veces (ej: 123123)
    # Esto significa que el número tiene longitud par 2*L
    # Y es de la forma B * (10^L + 1) donde B es un número de L dígitos
    
    invalid_ids = []
    
    # Determinar la longitud máxima de la base
    # Si max_val es 9277548385 (10 dígitos), la base B tiene hasta 5 dígitos.
    max_digits = len(str(max_val))
    max_base_digits = max_digits // 2
    
    for L in range(1, max_base_digits + 1):
        # B va desde 10^(L-1) hasta 10^L - 1
        start_base = 10**(L-1)
        end_base = 10**L # range es exclusivo al final
        
        multiplier = 10**L + 1
        
        for B in range(start_base, end_base):
            candidate = B * multiplier
            invalid_ids.append(candidate)
            
    print(f"Generated {len(invalid_ids)} candidate invalid IDs.")
    
    # Filtrar y sumar
    total_sum = 0
    found_count = 0
    
    # Usamos un set para evitar duplicados si los rangos se solapan (aunque no deberían)
    # Pero iteramos sobre los candidatos y chequeamos rangos, así que si un candidato está en múltiples rangos
    # solo deberíamos contarlo una vez?
    # La instrucción dice: "find all of the invalid IDs that appear in the given ranges".
    # Si un ID aparece en dos rangos superpuestos, sigue siendo UN ID inválido único.
    # Así que simplemente sumamos si está en CUALQUIER rango.
    
    for val in invalid_ids:
        in_range = False
        for start, end in ranges:
            if start <= val <= end:
                in_range = True
                break
        
        if in_range:
            total_sum += val
            found_count += 1
            
    print(f"Found {found_count} invalid IDs within ranges.")
    print(f"Total sum: {total_sum}")

if __name__ == "__main__":
    solve()
