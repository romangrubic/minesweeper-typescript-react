import React, { useState } from 'react';
import './app.styles.scss';
import NumberDisplay from '../number-display/number-display.component';
import { generateCells } from '../../utils/utils';
import Button from '../button/button.component';

const App: React.FC = () => {
    // Rows and columns for game
    const rows: number = 9;
    const columns: number = 9;

    const [cells, setCells] = useState(generateCells(rows, columns));

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <Button key={rowIndex + '-' + colIndex} />
            ))
        );
    };

    // Inline style to control grid size
    const bodyGrid = {
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
    };

    // User input form for rows and columns

    return (
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
    );
};

export default App;
