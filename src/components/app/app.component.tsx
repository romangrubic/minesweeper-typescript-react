import React, { useState, useEffect } from 'react';
import './app.styles.scss';
import NumberDisplay from '../number-display/number-display.component';
import { generateCells, openAdjacentCells } from '../../utils/utils';
import { Face, Cell, CellState, CellValue } from '../../utils/utils.types';
import Button from '../button/button.component';

const App: React.FC = () => {
    // Rows and columns for game
    const [row, setRow] = useState<number>(10);
    const [column, setColumn] = useState<number>(10);
    const [bombs, setBombs] = useState<number>(10);
    const [rowNumber, setRowNumber] = useState<number>(row);
    const [columnNumber, setColumnNumber] = useState<number>(column);
    const [numberOfBombs, setNumberOfBombs] = useState<number>(bombs);
    const [cells, setCells] = useState<Cell[][]>(
        generateCells(rowNumber, columnNumber, numberOfBombs)
    );
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [start, setStart] = useState<boolean>(false);
    const [flags, setFlags] = useState<number>(numberOfBombs);
    const [lose, setLose] = useState<boolean>(false);
    const [win, setWin] = useState<boolean>(false);

    // User input form for rows and columns
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setRowNumber(row);
        setColumnNumber(column);
        setNumberOfBombs(bombs);
        handleFaceClick();
    };

    useEffect(() => {
        setCells(generateCells(rowNumber, columnNumber, numberOfBombs));
        setFlags(numberOfBombs);
    }, [rowNumber, columnNumber, numberOfBombs]);

    // Inline style to control grid size
    const bodyGrid = {
        display: 'grid',
        gridTemplateRows: `repeat(${rowNumber}, 1fr)`,
        gridTemplateColumns: `repeat(${columnNumber}, 1fr)`,
    };

    // When we click on the button face changes
    useEffect(() => {
        const handleMousedown = (): void => {
            setFace(Face.surprise);
        };
        const handleMouseup = (): void => {
            setFace(Face.smile);
        };
        window.addEventListener('mousedown', handleMousedown);
        window.addEventListener('mouseup', handleMouseup);

        return () => {
            window.removeEventListener('mousedown', handleMousedown);
            window.removeEventListener('mouseup', handleMouseup);
        };
    }, []);

    // Start timer
    useEffect(() => {
        if (start && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [start, time]);

    // Lost condition
    useEffect(() => {
        if (lose) {
            setFace(Face.lose);
            setStart(false);
        }
    }, [lose]);

    // Win
    useEffect(() => {
        if (win) {
            setStart(false);
            setFace(Face.win);
        }
    }, [win]);
    // Start game
    const handleGameStart = (
        rowParam: number,
        columnParam: number
    ) => (): void => {
        if (win || lose) {
            return;
        }
        if (!start) {
            setStart(true);
        }

        const currentCell = cells[rowParam][columnParam];
        let newCells = cells.slice();

        if (
            currentCell.state === CellState.flagged ||
            currentCell.state === CellState.visible
        ) {
            return;
        }
        if (currentCell.value === CellValue.bomb) {
            setLose(true);
            newCells[rowParam][columnParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
            return;
        } else if (currentCell.value === CellValue.none) {
            newCells = openAdjacentCells(
                newCells,
                rowParam,
                columnParam,
                rowNumber,
                columnNumber
            );
            setCells(newCells);
        } else {
            newCells[rowParam][columnParam].state = CellState.visible;
        }
        // Check to see if user won
        let safeOpenCellsExists = false;
        for (let row = 0; row < rowNumber; row++) {
            for (let col = 0; col < columnNumber; col++) {
                const currentCell = newCells[row][col];

                if (
                    currentCell.value !== CellValue.bomb &&
                    currentCell.state === CellState.open
                ) {
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }

        if (!safeOpenCellsExists) {
            newCells = newCells.map((row) =>
                row.map((cell) => {
                    if (cell.value === CellValue.bomb) {
                        return {
                            ...cell,
                            state: CellState.flagged,
                        };
                    }
                    return cell;
                })
            );
            setWin(true);
        }
        setCells(newCells);
    };

    // Right click to set flags
    const handleCellContext = (rowParam: number, columnParam: number) => (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void => {
        e.preventDefault();

        if (!start) {
            return;
        }
        const currentCells = cells.slice();
        const currentCell = cells[rowParam][columnParam];

        if (currentCell.state === CellState.visible) {
            return;
        } else if (currentCell.state === CellState.open) {
            currentCells[rowParam][columnParam].state = CellState.flagged;
            setCells(currentCells);
            setFlags(flags - 1);
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][columnParam].state = CellState.open;
            setCells(currentCells);
            setFlags(flags + 1);
        }
    };

    const renderCells = (): React.ReactNode => {
        return cells.map((rowNumber, rowIndex) =>
            rowNumber.map((cell, colIndex) => (
                <Button
                    key={rowIndex + '-' + colIndex}
                    state={cell.state}
                    value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                    red={cell.red}
                    onClick={handleGameStart}
                    onContext={handleCellContext}
                />
            ))
        );
    };

    // BoardReset
    const handleFaceClick = (): void => {
        setStart(false);
        setTime(0);
        setCells(generateCells(rowNumber, columnNumber, numberOfBombs));
        setLose(false);
        setWin(false);
        setFlags(numberOfBombs);
    };

    // Show all bombs
    const showAllBombs = (): Cell[][] => {
        const currentCells = cells.slice();
        return currentCells.map((row) =>
            row.map((cell) => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.visible,
                    };
                }
                return cell;
            })
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='form'>
                <h2>Set difficulty</h2>
                <div>
                    <label>Rows (max 15) </label>
                    <input
                        type='number'
                        value={row}
                        max={15}
                        min={5}
                        required
                        onChange={(e) => setRow(parseInt(e.target.value))}
                        placeholder='Number of rows'
                    />
                </div>
                <div>
                    <label>Columns (max 35) </label>
                    <input
                        type='number'
                        value={column}
                        max={35}
                        min={10}
                        required
                        onChange={(e) => setColumn(parseInt(e.target.value))}
                        placeholder='Number of columns'
                    />
                </div>
                <div>
                    <label>Bombs (max of (rows * columns) - 1) </label>
                    <input
                        type='number'
                        value={bombs}
                        min={1}
                        max={row * column - 1}
                        required
                        onChange={(e) => setBombs(parseInt(e.target.value))}
                        placeholder='Number of bombs'
                    />
                </div>
                <button type='submit'>Confirm</button>
            </form>
            <div className='App'>
                <div className='Header'>
                    <NumberDisplay value={flags} />
                    <div className='face' onClick={handleFaceClick}>
                        <span role='img' aria-label='face'>
                            {face}
                        </span>
                    </div>
                    <NumberDisplay value={time} />
                </div>
                <div className='Body' style={bodyGrid}>
                    {renderCells()}
                </div>
            </div>
        </>
    );
};

export default App;
