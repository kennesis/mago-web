import React, { useId, memo } from 'react';

function Day({ 하루, 순서 }) {
    // console.log(표시날짜);
    const { 설, 표시날짜, 양력날짜, 음력, 양력휴일, 음력휴일, 대체휴일, 임시공휴일, 기념일, 명절, 절기, 선택날짜 } = 하루;
    const id = useId();

    let color;
    let border = '0px';

    if(순서 === 0) {
        color = 'rgba(255, 0, 0, 0.8)';
    } else if(순서 === 6) {
        color = 'cornflowerblue';
    }

    if(양력휴일 || 음력휴일 || 대체휴일 || 임시공휴일) {
        color = 'rgba(255, 0, 0, 0.8)';
    }    

    if(선택날짜) {
        border = '2px solid gray';
    }

    return (
        <div
            key={`day${순서}${id}`}
            style={{
                border,
                borderRadius: 5,
                padding: border === '0px' ? 5: 3
            }}
        >
            <div style={{ color: 설 ? 'rgba(255, 0, 0, 0.8)' : color, fontSize: 15, fontWeight: '700' }}>{설 && "설(旦)"}{표시날짜}</div>
            <div style={{ color, fontSize: 10 }}>
                { 양력날짜 && `${양력날짜.getMonth() + 1}.${양력날짜.getDate()}` }  
            </div>
            {음력 && <div style={{ color, fontSize: 10 }}>{음력}</div>}                
            {양력휴일 && <div className="휴일 특별한날">{양력휴일}</div>}
            {음력휴일 && <div className="휴일 특별한날">{음력휴일}</div>}
            {대체휴일 && <div className="휴일 특별한날">{대체휴일}</div>}
            {임시공휴일 && <div className="휴일 특별한날">{임시공휴일}</div>}
            {절기 && <div className="절기 특별한날">{절기}</div>}
            {명절 && <div className="명절 특별한날">{명절}</div>}
            {기념일 && <div className="기념일 특별한날">{기념일}</div>}
        </div>
    );
}

export default memo(Day);