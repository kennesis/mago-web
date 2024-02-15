import React, { useId, memo } from 'react';
import Day from './Day';

function Week({ 한주, 순서 }) {
    const id = useId();

    return (
        <div key={`week${순서}${id}`} className='한주'>
            {한주.map((하루, 순서) => <Day key={`day${순서}${id}`} 하루={하루} 순서={순서} />)}
        </div>
    );
}

export default memo(Week);