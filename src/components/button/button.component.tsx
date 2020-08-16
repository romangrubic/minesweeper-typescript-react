import React from 'react';
import './button.styles.scss';
import { CellState, CellValue } from '../../utils/utils.types';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    onClick(rowParam: number, columnParam: number): (...args: any[]) => void;
    onContext(rowParam: number, columnParam: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({
    row,
    col,
    state,
    value,
    onClick,
    onContext,
}) => {
    const renderContent = (): React.ReactNode => {
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return (
                    <span role='img' aria-label='bomb'>
                        💣
                    </span>
                );
            } else if (value === CellValue.none) {
                return null;
            }
            return value;
        } else if (state === CellState.flagged) {
            return (
                <span role='img' aria-label='flag'>
                    🚩
                </span>
            );
        }
        return null;
    };
    return (
        <div
            className={`button ${
                state === CellState.visible ? 'visible' : ''
            } value-${value}`}
            onClick={onClick(row, col)}
            onContextMenu={onContext(row, col)}
        >
            {renderContent()}
        </div>
    );
};

export default Button;
