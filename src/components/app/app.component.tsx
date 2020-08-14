import React from 'react';
import './app.styles.scss';
import NumberDisplay from '../number-display/number-display.component';

const App: React.FC = () => {
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
            <div className='Body'>Body</div>
        </div>
    );
};

export default App;
