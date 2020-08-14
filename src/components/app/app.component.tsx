import React, { useState, useEffect } from 'react';
import './app.styles.scss';
import NumberDisplay from '../number-display/number-display.component';
import { generateCells } from '../../utils/utils';
import Button from '../button/button.component';

const App: React.FC = () => {
    // Rows and columns for game
    const [row, setRow] = useState<number>(10);
    const [column, setColumn] = useState<number>(10);
    const [rowNumber, setRowNumber] = useState<number>(10);
    const [columnNumber, setColumnNumber] = useState<number>(10);
    const [cells, setCells] = useState(generateCells(rowNumber, columnNumber));

    // User input form for rows and columns
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setRowNumber(row);
        setColumnNumber(column);
    };

    useEffect(() => {
        setCells(generateCells(rowNumber, columnNumber));
    }, [rowNumber, columnNumber]);

    // Inline style to control grid size
    const bodyGrid = {
        display: 'grid',
        gridTemplateRows: `repeat(${rowNumber}, 1fr)`,
        gridTemplateColumns: `repeat(${columnNumber}, 1fr)`,
    };

    const renderCells = (): React.ReactNode => {
        return cells.map((rowNumber, rowIndex) =>
            rowNumber.map((cell, colIndex) => (
                <Button key={rowIndex + '-' + colIndex} />
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
                <button type='submit'>Confirm</button>
            </form>
            <div className='App'>
                <div className='Header'>
                    <NumberDisplay value={0} />
                    <div className='face'>
                        <span role='img' aria-label='face'>
                            😁
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
