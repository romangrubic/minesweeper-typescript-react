import { CellValue, CellState, Cell } from './utils.types';

export const generateCells = (
    rowNumber: number,
    columnNumber: number,
    numberOfBombs: number
): Cell[][] => {
    let cells: Cell[][] = [];

    // Generating all cells
    for (let row = 0; row < rowNumber; row++) {
        cells.push([]);
        for (let col = 0; col < columnNumber; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open,
            });
        }
    }

    // Randomly put X bombs from user input
    let bombsPlaced = 0;
    while (bombsPlaced < numberOfBombs) {
        const randomRow = Math.floor(Math.random() * rowNumber);
        const randomColumn = Math.floor(Math.random() * columnNumber);

        // We don't want to put two or more bombs on the sam spot
        const currentCell = cells[randomRow][randomColumn];
        if (currentCell.value !== CellValue.bomb) {
            cells[randomRow][randomColumn] = {
                ...cells[randomRow][randomColumn],
                value: CellValue.bomb,
            };
            bombsPlaced++;
        }
    }

    return cells;
};
