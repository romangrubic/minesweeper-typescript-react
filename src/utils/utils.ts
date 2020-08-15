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
    // Numbers for each cell depending on how many bombs in adjacent cells
    for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columnNumber; columnIndex++) {
            const currentCell = cells[rowIndex][columnIndex];
            if (currentCell.value === CellValue.bomb) {
                continue;
            }

            // Here we check if current field has a adjacent field.
            // Cell at 0,0 doesn't have top fields and left and bottomLeft
            const topLeftBomb =
                rowIndex > 0 && columnIndex > 0
                    ? cells[rowIndex - 1][columnIndex - 1]
                    : null;
            const topBomb =
                rowIndex > 0 ? cells[rowIndex - 1][columnIndex] : null;
            const topRightBomb =
                rowIndex > 0 && columnIndex < columnNumber
                    ? cells[rowIndex - 1][columnIndex + 1]
                    : null;
            const leftBomb =
                columnIndex > 0 ? cells[rowIndex][columnIndex - 1] : null;
            const rightBomb =
                columnIndex < columnNumber
                    ? cells[rowIndex][columnIndex + 1]
                    : null;
            const bottomLeftBomb =
                rowIndex < rowNumber - 1 && columnIndex > 0
                    ? cells[rowIndex + 1][columnIndex - 1]
                    : null;
            const bottomBomb =
                rowIndex < rowNumber - 1
                    ? cells[rowIndex + 1][columnIndex]
                    : null;
            const bottomRightBomb =
                rowIndex < rowNumber - 1 && columnIndex < rowNumber - 1
                    ? cells[rowIndex + 1][columnIndex + 1]
                    : null;

            // Instead of writing eight same if checks,
            // I have placed them in array and loop through with map function
            const adjacentFields = [
                topLeftBomb,
                topBomb,
                topRightBomb,
                leftBomb,
                rightBomb,
                bottomLeftBomb,
                bottomBomb,
                bottomRightBomb,
            ];

            let numberOfBombs = 0;

            // We add bombTotal for each adjacent bomb field
            adjacentFields.map((field) => {
                if (field && field.value === CellValue.bomb) {
                    return numberOfBombs++;
                }
            });

            // Set the state.value to the number of adjacent bomb fields
            if (numberOfBombs > 0) {
                cells[rowIndex][columnIndex] = {
                    ...currentCell,
                    value: numberOfBombs,
                };
            }
        }
    }

    return cells;
};
