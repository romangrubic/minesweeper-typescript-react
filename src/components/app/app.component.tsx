import React, { useState, useEffect } from 'react';
import './app.styles.scss';
import NumberDisplay from '../number-display/number-display.component';
import { generateCells } from '../../utils/utils';
import { Face, Cell, CellState } from '../../utils/utils.types';
import Button from '../button/button.component';

const App: React.FC = () => {
    // Rows and columns for game
    const [row, setRow] = useState<number>(10);
    const [column, setColumn] = useState<number>(20);
    const [bombs, setBombs] = useState<number>(10);
    const [rowNumber, setRowNumber] = useState<number>(10);
    const [columnNumber, setColumnNumber] = useState<number>(20);
    const [numberOfBombs, setNumberOfBombs] = useState<number>(10);
    const [cells, setCells] = useState<Cell[][]>(
        generateCells(rowNumber, columnNumber, numberOfBombs)
    );
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [start, setStart] = useState<boolean>(false);
    const [flags, setFlags] = useState<number>(numberOfBombs);

    // User input form for rows and columns
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setRowNumber(row);
        setColumnNumber(column);
        setNumberOfBombs(bombs);
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

    // Start game
    const handleGameStart = (
        rowParam: number,
        columnParam: number
    ) => (): void => {
        if (!start) {
            setStart(true);
        }
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
                    onClick={handleGameStart}
                    onContext={handleCellContext}
                />
            ))
        );
    };

    // BoardReset
    const handleFaceClick = (): void => {
        if (start) {
            setStart(false);
            setTime(0);
            setCells(generateCells(rowNumber, columnNumber, numberOfBombs));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type='number'
                    value={row}
                    required
                    onChange={(e) => setRow(parseInt(e.target.value))}
                    placeholder='Number of rows'
                />
                <input
                    type='number'
                    value={column}
                    required
                    onChange={(e) => setColumn(parseInt(e.target.value))}
                    placeholder='Number of columns'
                />
                <input
                    type='number'
                    value={bombs}
                    required
                    onChange={(e) => setBombs(parseInt(e.target.value))}
                    placeholder='Number of bombs'
                />
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
