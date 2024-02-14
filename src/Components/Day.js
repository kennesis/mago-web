import React, { memo } from 'react';

function Day({ 하루, 순서 }) {
    // console.log(표시날짜);
    const { 설, 표시날짜, 양력날짜, 음력, 양력휴일, 음력휴일, 대체휴일, 임시공휴일, 기념일, 명절, 절기, 선택날짜 } = 하루;

    let color = 'black';
    let border = '0px';

    if(순서 === 0) {
        color = 'rgba(255, 0, 0, 0.8)';
    } else if(순서 === 6) {
        color = 'cornflowerblue';
    }

    if(양력휴일 || 음력휴일 || 대체휴일 || 임시공휴일) {
        color = 'rgba(255, 0, 0, 0.8)';
    };

    if(선택날짜) {
        border = '2px solid gray';
    }

    return (
        <div
            key={`day${순서}`}
            style={{
                border,
                borderRadius: 5,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: border === '0px' ? 5: 3
            }}
        >
            <div style={{ color: 설 ? 'rgba(255, 0, 0, 0.8)' : color, fontSize: 15, fontWeight: '700' }}>{설 && "설(旦)"}{표시날짜}</div>
            <div style={{ color, fontSize: 11 }}>
            {
                양력날짜 && `${양력날짜.getMonth() + 1}.${양력날짜.getDate()}`
            }  
            </div>
            {음력 && <div style={{ color, fontSize: 11 }}>{음력}</div>}                
            {양력휴일 && <div style={{ color, fontSize: 11 }}>{양력휴일}</div>}
            {음력휴일 && <div style={{ color, fontSize: 11 }}>{음력휴일}</div>}
            {대체휴일 && <div style={{ color, fontSize: 11 }}>{대체휴일}</div>}
            {임시공휴일 && <div style={{ color, fontSize: 11 }}>{임시공휴일}</div>}
            {명절 && <div style={{ color: 'rgba(255, 0, 0, 0.8)', fontSize: 14 }}>{명절}</div>}
            {절기 && <div style={{ color, fontSize: 14 }}>{절기}</div>}
            {기념일 && <div style={{ color, fontSize: 14 }}>{기념일}</div>}
        </div>
    );
}

export default memo(Day);