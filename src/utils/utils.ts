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

            let numberOfBombs = 0;

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

            if (topLeftBomb && topLeftBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topBomb && topBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topRightBomb && topRightBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftBomb && leftBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightBomb && rightBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomLeftBomb && bottomLeftBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomBomb && bottomBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomRightBomb && bottomRightBomb.value === CellValue.bomb) {
                numberOfBombs++;
            }
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
