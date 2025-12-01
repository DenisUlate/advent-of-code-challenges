# Day 1: Secret Entrance - Solution

def solve_safe_password(instructions):
    """
    Simula el dial de la caja fuerte y cuenta cuántas veces apunta a 0.
    
    Args:
        instructions: Lista de instrucciones (ej: ['R27', 'L47', ...])
    
    Returns:
        Número de veces que el dial apunta a 0
    """
    position = 50  # Posición inicial
    count_zeros = 0
    
    for instruction in instructions:
        direction = instruction[0]
        distance = int(instruction[1:])
        
        if direction == 'R':
            # Rotar a la derecha (hacia números mayores)
            position = (position + distance) % 100
        else:  # direction == 'L'
            # Rotar a la izquierda (hacia números menores)
            position = (position - distance) % 100
        
        # Verificar si apuntamos a 0
        if position == 0:
            count_zeros += 1
    
    return count_zeros


def solve_safe_password_part2(instructions):
    """
    Simula el dial de la caja fuerte y cuenta cuántas veces apunta a 0,
    incluyendo los pasos intermedios.
    
    Args:
        instructions: Lista de instrucciones (ej: ['R27', 'L47', ...])
    
    Returns:
        Número de veces que el dial apunta a 0
    """
    position = 50  # Posición inicial
    count_zeros = 0
    
    for instruction in instructions:
        direction = instruction[0]
        distance = int(instruction[1:])
        
        # Iterar paso a paso para contar cada vez que pasamos por 0
        for _ in range(distance):
            if direction == 'R':
                position = (position + 1) % 100
            else:  # direction == 'L'
                position = (position - 1) % 100
            
            if position == 0:
                count_zeros += 1
                
    return count_zeros


# Leer el archivo de entrada
with open('puzzle-input.txt', 'r') as f:
    instructions = [line.strip() for line in f if line.strip()]

# Resolver el puzzle Parte 1
password_p1 = solve_safe_password(instructions)
print(f"La contraseña (Parte 1) es: {password_p1}")

# Resolver el puzzle Parte 2
password_p2 = solve_safe_password_part2(instructions)
print(f"La contraseña (Parte 2) es: {password_p2}")
