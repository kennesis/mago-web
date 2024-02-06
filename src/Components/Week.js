import React, { memo } from 'react';
import Day from './Day';

function Week({ 한주, 순서 }) {
    return (
        <div key={순서} className='한주'>
            {한주.map((하루, 순서) => <Day 하루={하루} 순서={순서}/>)}
        </div>
    );
}

export default memo(Week);