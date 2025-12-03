def solve():
    # Leer el archivo de entrada
    with open('day02-input.txt', 'r') as f:
        content = f.read().strip()
    
    # Parsear los rangos
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
    
    # Generar IDs inválidos con las nuevas reglas
    # ID es inválido si es una secuencia repetida al menos 2 veces.
    
    invalid_ids = set()
    
    max_digits = len(str(max_val))
    # La longitud de la base L puede ser desde 1 hasta max_digits // 2
    # (porque se repite al menos 2 veces)
    
    for L in range(1, (max_digits // 2) + 1):
        start_base = 10**(L-1)
        end_base = 10**L 
        
        for B in range(start_base, end_base):
            s_base = str(B)
            
            # Repetir la base k veces
            # Empezamos con k=2
            k = 2
            while True:
                candidate_str = s_base * k
                if len(candidate_str) > max_digits:
                    break
                
                candidate_val = int(candidate_str)
                
                # Optimización: si el candidato ya es mayor que el max_val global,
                # y como al aumentar k el número crece, podemos parar para este B?
                # Cuidado: 9 repetido 2 veces es 99. 9 repetido 3 veces es 999.
                # Sí, crece monótonamente.
                if candidate_val > max_val:
                    break
                
                invalid_ids.add(candidate_val)
                k += 1
                
    print(f"Generated {len(invalid_ids)} unique candidate invalid IDs.")
    
    # Filtrar y sumar
    total_sum = 0
    found_count = 0
    
    # Ordenamos para procesar (opcional, pero ordenado es mejor para debug)
    sorted_candidates = sorted(list(invalid_ids))
    
    for val in sorted_candidates:
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
