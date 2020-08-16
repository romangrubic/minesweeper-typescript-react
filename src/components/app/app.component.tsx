import React, { useState, useEffect } from 'react';
import './app.styles.scss';
import NumberDisplay from '../number-display/number-display.component';
import { generateCells } from '../../utils/utils';
import { Face, Cell } from '../../utils/utils.types';
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

    // User input form for rows and columns
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setRowNumber(row);
        setColumnNumber(column);
        setNumberOfBombs(bombs);
    };

    useEffect(() => {
        setCells(generateCells(rowNumber, columnNumber, numberOfBombs));
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

    const renderCells = (): React.ReactNode => {
        return cells.map((rowNumber, rowIndex) =>
            rowNumber.map((cell, colIndex) => (
                <Button
                    key={rowIndex + '-' + colIndex}
                    state={cell.state}
                    value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                />
            ))
        );
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
                    <NumberDisplay value={0} />
                    <div className='face'>
                        <span role='img' aria-label='face'>
                            {face}
                        </span>
                    </div>
                    <NumberDisplay value={23} />
                </div>
                <div className='Body' style={bodyGrid}>
                    {renderCells()}
                </div>
            </div>
        </>
    );
};

export default App;
