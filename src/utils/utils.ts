import { CellValue, CellState, Cell } from './utils.types';

// We use this function multiple times!
// Here we check if current field has a adjacent field.
const grabAllAdjacentCells = (
    cells: Cell[][],
    rowIndex: number,
    columnIndex: number,
    rowNumber: number,
    columnNumber: number
): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
} => {
    const topLeftCell =
        rowIndex > 0 && columnIndex > 0
            ? cells[rowIndex - 1][columnIndex - 1]
            : null;
    const topCell = rowIndex > 0 ? cells[rowIndex - 1][columnIndex] : null;
    const topRightCell =
        rowIndex > 0 && columnIndex < columnNumber - 1
            ? cells[rowIndex - 1][columnIndex + 1]
            : null;
    const leftCell = columnIndex > 0 ? cells[rowIndex][columnIndex - 1] : null;
    const rightCell =
        columnIndex < columnNumber - 1
            ? cells[rowIndex][columnIndex + 1]
            : null;
    const bottomLeftCell =
        rowIndex < rowNumber - 1 && columnIndex > 0
            ? cells[rowIndex + 1][columnIndex - 1]
            : null;
    const bottomCell =
        rowIndex < rowNumber - 1 ? cells[rowIndex + 1][columnIndex] : null;
    const bottomRightCell =
        rowIndex < rowNumber - 1 && columnIndex < columnNumber - 1
            ? cells[rowIndex + 1][columnIndex + 1]
            : null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    };
};

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
            // Here we check if current field has a adjacent field.
            // Cell at 0,0 doesn't have top fields and left and bottomLeft
            const {
                topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell,
            } = grabAllAdjacentCells(
                cells,
                rowIndex,
                columnIndex,
                rowNumber,
                columnNumber
            );

            // Instead of writing eight same if checks,
            // I have placed them in array and loop through with map function
            const adjacentFields = [
                topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell,
            ];

            // We add bombTotal for each adjacent bomb field
            adjacentFields.map((field) => {
                if (field?.value === CellValue.bomb) {
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

export const openAdjacentCells = (
    cells: Cell[][],
    rowParam: number,
    columnParam: number,
    rowNumber: number,
    columnNumber: number
): Cell[][] => {
    const currentCell = cells[rowParam][columnParam];

    if (
        currentCell.state === CellState.visible ||
        currentCell.state === CellState.flagged
    ) {
        return cells;
    }

    let newCells = cells.slice();
    newCells[rowParam][columnParam].state = CellState.visible;

    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    } = grabAllAdjacentCells(
        cells,
        rowParam,
        columnParam,
        rowNumber,
        columnNumber
    );

    //
    if (
        topLeftCell?.state === CellState.open &&
        topLeftCell.value !== CellValue.bomb
    ) {
        if (topLeftCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam - 1,
                columnParam - 1,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam - 1][columnParam - 1].state = CellState.visible;
        }
    }
    //
    if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
        if (topCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam - 1,
                columnParam,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam - 1][columnParam].state = CellState.visible;
        }
    }
    //
    if (
        topRightCell?.state === CellState.open &&
        topRightCell.value !== CellValue.bomb
    ) {
        if (topRightCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam - 1,
                columnParam + 1,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam - 1][columnParam + 1].state = CellState.visible;
        }
    }
    //
    if (
        leftCell?.state === CellState.open &&
        leftCell.value !== CellValue.bomb
    ) {
        if (leftCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam,
                columnParam - 1,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam][columnParam - 1].state = CellState.visible;
        }
    }
    //
    if (
        rightCell?.state === CellState.open &&
        rightCell.value !== CellValue.bomb
    ) {
        if (rightCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam,
                columnParam + 1,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam][columnParam + 1].state = CellState.visible;
        }
    }
    //
    if (
        bottomLeftCell?.state === CellState.open &&
        bottomLeftCell.value !== CellValue.bomb
    ) {
        if (bottomLeftCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam + 1,
                columnParam - 1,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam - 1][columnParam - 1].state = CellState.visible;
        }
    }
    //
    if (
        bottomCell?.state === CellState.open &&
        bottomCell.value !== CellValue.bomb
    ) {
        if (bottomCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam + 1,
                columnParam,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam + 1][columnParam].state = CellState.visible;
        }
    }
    //
    if (
        bottomRightCell?.state === CellState.open &&
        bottomRightCell.value !== CellValue.bomb
    ) {
        if (bottomRightCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam + 1,
                columnParam + 1,
                rowNumber,
                columnNumber
            );
        } else {
            newCells[rowParam + 1][columnParam + 1].state = CellState.visible;
        }
    }

    return newCells;
};
