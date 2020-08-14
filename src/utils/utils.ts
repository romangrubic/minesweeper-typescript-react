import { CellValue, CellState, Cell } from './utils.types';

export const generateCells = (
    rowNumber: number,
    columnRow: number
): Cell[][] => {
    const cells: Cell[][] = [];

    for (let row = 0; row < rowNumber; row++) {
        cells.push([]);
        for (let col = 0; col < columnRow; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open,
            });
        }
    }

    return cells;
};
