// Quarto: 16 piezas únicas, tablero 4×4
// Cada pieza tiene 4 atributos binarios:
// tall (1) / short (0)
// dark (1) / light (0)
// round (1) / square (0)
// hollow (1) / solid (0)

export const BOARD_SIZE = 4;

// Genera las 16 piezas únicas
export function generatePieces() {
    const pieces = [];
    for (let i = 0; i < 16; i++) {
        pieces.push({
            id: i,
            tall: (i >> 3) & 1,
            dark: (i >> 2) & 1,
            round: (i >> 1) & 1,
            hollow: i & 1,
        });
    }
    return pieces;
}

export function createBoard() {
    return Array.from({
        length: BOARD_SIZE
    }, () => Array(BOARD_SIZE).fill(null));
}

// Coloca una pieza en el tablero
export function placePiece(board, row, col, piece) {
    if (board[row][col] !== null) return null;
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = piece;
    return newBoard;
}

// Verifica victoria: 4 en línea que compartan al menos 1 atributo
export function checkWin(board) {
    const lines = getLines(board);

    for (const line of lines) {
        if (line.some(cell => cell === null)) continue;

        const attrs = ['tall', 'dark', 'round', 'hollow'];
        for (const attr of attrs) {
            const values = line.map(cell => cell[attr]);
            if (values.every(v => v === 1) || values.every(v => v === 0)) {
                return {
                    won: true,
                    attr,
                    value: values[0],
                    line: getLineCoords(lines.indexOf(line)),
                };
            }
        }
    }

    // Empate
    const isFull = board.every(row => row.every(cell => cell !== null));
    if (isFull) return {
        won: false,
        draw: true
    };

    return null;
}

// Obtiene todas las líneas posibles (filas, columnas, diagonales)
function getLines(board) {
    const lines = [];

    // Filas
    for (let r = 0; r < BOARD_SIZE; r++) {
        lines.push(board[r]);
    }
    // Columnas
    for (let c = 0; c < BOARD_SIZE; c++) {
        lines.push(board.map(row => row[c]));
    }
    // Diagonales
    lines.push([board[0][0], board[1][1], board[2][2], board[3][3]]);
    lines.push([board[0][3], board[1][2], board[2][1], board[3][0]]);

    return lines;
}

// Coordenadas de cada línea para resaltar
function getLineCoords(lineIndex) {
    if (lineIndex < 4) {
        // Fila
        return [
            [lineIndex, 0],
            [lineIndex, 1],
            [lineIndex, 2],
            [lineIndex, 3]
        ];
    } else if (lineIndex < 8) {
        // Columna
        const c = lineIndex - 4;
        return [
            [0, c],
            [1, c],
            [2, c],
            [3, c]
        ];
    } else if (lineIndex === 8) {
        return [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3]
        ];
    } else {
        return [
            [0, 3],
            [1, 2],
            [2, 1],
            [3, 0]
        ];
    }
}

// Obtiene el nombre legible de un atributo
export function getAttrName(attr, value) {
    const names = {
        tall: ['Baja', 'Alta'],
        dark: ['Clara', 'Oscura'],
        round: ['Cuadrada', 'Redonda'],
        hollow: ['Sólida', 'Hueca'],
    };
    return names[attr][value];
}