import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { addDays, setYear, setMonth, setDate } from 'date-fns';
// import { countSolarTerms } from './Lunar-main/src/index.ts';
import './App.css';
import Week from './Components/Week';
const holidayKR = require('holiday-kr');

const 사 = 13;
const 기 = 4;
const 요 = 7;

let 서기 = new Date().getFullYear();
let 단기 = 서기 + 2333;

function 판(년) {
  return 년 % 4 === 1;
}

function 시작요일(년, 월) {
  let 요일 = 0;

  for(let i = 1; i <= 년; i++) {
    if(판(i)) {
      요일 += 2;
    }
    else 요일 += 1;
  }

  if(판(년)) {
    if(월 > 0) 요일 += 1;
  } else {
    요일 += 1;
  }

  return (요일 + 2) % 요;
}

function 양력휴일구하기(양력) {
  const 년 = 양력.getFullYear();
  const 월 = 양력.getMonth() + 1;
  const 일 = 양력.getDate();

  if(월 === 1 && 일 === 1) return '신정';
  else if(월 === 3 && 일 === 1) return '삼일절';
  else if(월 === 5 && 일 === 5) return '어린이날';
  else if(월 === 6 && 일 === 6) return '현충일';
  else if(월 === 8 && 일 === 15) return '광복절';
  else if(월 === 10 && 일 === 3) return '개천절';
  else if(월 === 10 && 일 === 9) return '한글날';
  else if(월 === 12 && 일 === 25) return '성탄절';
  else if(년 === 2024 && 월 === 4 && 일 === 10) return '22대 국회의원선거';
  else return null;
}

function 음력휴일구하기(양력, 음력) {
  function 설날전날구하기() {
    const seolnal = holidayKR.getSolar(양력.getFullYear(), 1, 1, 음력.isLeapMonth);
    const 설날 = new Date(seolnal.year, seolnal.month - 1, seolnal.day);
    const 오늘 = new Date(양력.getFullYear(), 양력.getMonth(), 양력.getDate());
    return 오늘.getTime() === 설날.getTime() - 86400000;
  }
  
  if(설날전날구하기()) return ' ';
  else if(음력.month === 1 && 음력.day === 1) return '설날';  
  else if(음력.month === 1 && 음력.day === 2) return ' ';
  else if(음력.month === 4 && 음력.day === 8) return '부처님오신날';
  else if(음력.month === 8 && 음력.day === 14) return ' ';
  else if(음력.month === 8 && 음력.day === 15) return '한가위';
  else if(음력.month === 8 && 음력.day === 16) return ' ';
  else return null;
}

function 대체휴일구하기(양력, 음력) {
  const 년 = 양력.getFullYear();
  const 월 = 양력.getMonth() + 1;
  const 일 = 양력.getDate();
  // const 요일 = 양력.getDay();

  if(음력.month === 1 && 음력.day === 3) {
    if(음력.dayOfWeek === '월') return '대체휴일';
    else if(음력.dayOfWeek === '화') return '대체휴일';
    else if(음력.dayOfWeek === '수') return '대체휴일';
  }
  if(음력.month === 8 && 음력.day === 17) {
    if(음력.dayOfWeek === '월') return '대체휴일';
    else if(음력.dayOfWeek === '화') return '대체휴일';
    else if(음력.dayOfWeek === '수') return '대체휴일';
  }
  if(년 === 2028 && 월 === 10 && 일 === 5) return '대체휴일';
}

function 임시공휴일구하기(양력) {
  const 년 = 양력.getFullYear();
  const 월 = 양력.getMonth() + 1;
  const 일 = 양력.getDate();

  if(년 === 2023 && 월 === 10 && 일 === 2) return '임시공휴일';
  if(년 === 2020 && 월 === 8 && 일 === 17) return '임시공휴일';
  if(년 === 2017 && 월 === 10 && 일 === 2) return '임시공휴일';
  if(년 === 2017 && 월 === 5 && 일 === 9) return '임시공휴일';
  if(년 === 2016 && 월 === 5 && 일 === 6) return '임시공휴일';
  if(년 === 2015 && 월 === 8 && 일 === 14) return '임시공휴일';
  if(년 === 2002 && 월 === 7 && 일 === 1) return '임시공휴일';

}

function 기념일구하기(양력, 음력) {
  // const 년 = 양력.getFullYear();
  const 월 = 양력.getMonth() + 1;
  const 일 = 양력.getDate();

  if(월 === 3 && 일 === 3) return '삼월삼짓날';
  else if(월 === 4 && 일 === 5) return '식목일';
  else if(월 === 5 && 일 === 8) return '어버이날';
  else if(월 === 5 && 일 === 15) return '스승의날';
  else if(월 === 7 && 일 === 17) return '제헌절';
  else if(음력.month === 9 && 음력.day === 9) return '구월귀일';
}

function 달이름(달) {
  switch (달) {
    case 0:
      return '정한달';
    case 1:
      return '1월 해오름달';
    case 2:
      return '2월 시샘달';
    case 3:
      return '3월 물오름달';
    case 4:
      return '4월 잎새달';
    case 5:
      return '5월 푸른달';
    case 6:
      return '6월 누리달';
    case 7:
      return '7월 견우직녀달';
    case 8:
      return '8월 타오름달';
    case 9:
      return '9월 열매달';
    case 10:
      return '10월 하늘연달';
    case 11:
      return '11월 마름달';
    case 12:
      return '12월 매듭달';
    default:
      return 달;
  }
  
}

function 한해를세다(년, 오늘) {

  let 한해 = [];
  // TODO 기준 날짜를 정하기
  let 양력 = setDate(setMonth(setYear(오늘, 년 - 2333 - 1), 10), 21);
  // const 절기들 = countSolarTerms(양력, addDays(setYear(양력, 년 - 2333), 2));

  function 한달을세다(월) {

    let 한달 = [];
    let 시작 = false;

    function 하루를세다(주, 일) {
      const 하루 = {};
      let 날 = (주 * 요) + 일 - 시작요일(년, 월);
      
      if(월 === 0 && 주 === 0 && 일 === 시작요일(년, 월) && 날 === 0) {
        하루.설 = true;
        양력 = addDays(양력, 1);

        const 음력 = holidayKR.getLunar(양력);
        
        하루.음력 = `음${음력.month}.${음력.day}`;
      }
    
      if(날 <= 0 || 날 > (기 * 요) + (판(년) && 월 === 0 ? 1 : 0)) {
        날 = null;
      } else {
        양력 = addDays(양력, 1);

        const 음력 = holidayKR.getLunar(양력);
        
        if(!(월 === 0) && 날 === 1) 하루.음력 = `음${음력.month}.${음력.day}`;
        if(음력.day === 1) 하루.음력 = `음${음력.month}.${음력.day}`;
        if(음력.day === 15) 하루.음력 = `음${음력.month}.${음력.day}`;
        if(음력.month === 4 && 음력.day === 8) 하루.음력 = `음${음력.month}.${음력.day}`;
        if(음력.month === 9 && 음력.day === 9) 하루.음력 = `음${음력.month}.${음력.day}`;

        const 양력휴일 = 양력휴일구하기(양력);
        const 음력휴일 = 음력휴일구하기(양력, 음력);
        const 대체휴일 = 대체휴일구하기(양력, 음력);
        const 임시공휴일 = 임시공휴일구하기(양력);
        const 기념일 = 기념일구하기(양력, 음력);

        if(양력휴일) 하루.양력휴일 = 양력휴일;
        if(음력휴일) 하루.음력휴일 = 음력휴일;
        if(대체휴일) 하루.대체휴일 = 대체휴일;
        if(임시공휴일) 하루.임시공휴일 = 임시공휴일;
        if(기념일) 하루.기념일 = 기념일;
      }

      if(날 && 양력.getFullYear() === 오늘.getFullYear() && 양력.getMonth() === 오늘.getMonth() && 양력.getDate() === 오늘.getDate()) {
        하루.선택날짜 = true;
      }
    
      하루.표시날짜 = 날;
      하루.양력날짜 = (하루.설 || 날 > 0) && 날 <= (기 * 요) + (판(년) && 월 === 0 ? 1 : 0) ? 양력 : null;

      // TODO 하루마다 찾는 것이 아닌 데이터에 병합시키기.
      // const 절기 = 절기들.find(item => 양력.getFullYear() === item.date.getFullYear() && 양력.getMonth() === item.date.getMonth() && 양력.getDate() === item.date.getDate());

      // if(절기 && 하루.양력날짜) 하루.절기 = 절기.label;
    
      return 하루;
    }
  
    let 추가열 = 시작요일(년, 월) === 6 && 판(년);
  
    for(let 주 = 0; 주 <= 4 + 추가열; 주++) {
      let 한주 = [];
  
      for(let 일 = 0; 일 < 요; 일++) {

        if(주 === 0 && !시작) {
          if(일 === 시작요일(년, 월)) {
            시작 = true;
          } else {
            한주.push(하루를세다(주, 일));
            continue;
          }
        }
  
        한주.push(하루를세다(주, 일));
      }
  
      한달.push(한주);
    }
  
    return {
      한달,
      날짜: {
        해: 년,
        달: 월
      }
    };
  }

  for(let 월 = 0; 월 < 사; 월++) {
    한해.push(한달을세다(월));
  }

  return 한해;
}

function 한달을그리다(한달, 순서, style, 해, 해설정, 달, 달설정) {
  const ref = useRef();

  useEffect(() => {
    const instance = ref.current;

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // entry.target.style.backgroundColor = 'lightgreen';
          해설정(한달.날짜.해);
          달설정(한달.날짜.달);
        } else {
          // entry.target.style.backgroundColor = 'lightblue';
        }
      });
    };

    const options = {
      root: null, // 루트 요소 (기본: viewport)
      rootMargin: '0px',
      threshold: 0.5, // 50% 가시성 이상일 때 콜백 실행
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    observer.observe(instance);
    
    return () => {
      observer.unobserve(instance);
    };
  }, [한달.날짜.해, 한달.날짜.달, 해설정, 달설정]);

  return (
      <div
        key={순서}
        className='한달'
        style={style}
        ref={ref}
        year={한달.날짜.해}
        month={한달.날짜.달}
      >
        {한달.한달.map((한주, 순서) => <Week 한주={한주} 순서={순서}/>)}
      </div>
  );
}

function App() {

  const 오늘 = new Date();
  const 년 = 오늘.getFullYear();
  const 월 = 오늘.getMonth();
  const 일 = 오늘.getDate();

  const [ data ] = useState(() => {
    return 한해를세다(단기, new Date()).flat();
  });

  const findToday = useCallback(e => {
    const today = data?.find(element => {
        const today2 = element.한달.flat().find(item => {
          if(item.양력날짜) {
            return item.양력날짜.getFullYear() === 년 && item.양력날짜.getMonth() === 월 && item.양력날짜.getDate() === 일;
          }
          else return null;
        })
        return today2;
      }
    );
    return today;
  }, [ data, 년, 월, 일 ]);

  const [ 해, 해설정 ] = useState(findToday().날짜.해);
  const [ 달, 달설정 ] = useState(findToday().날짜.달);
  
  const headerRef = useRef(null);
  const listRef = useRef(null);

  const scrollToday = useCallback(e => {
    if(listRef.current) {
      const index = data.findIndex(element => {
          const index2 = element.한달.flat().findIndex(item => {
            if(item.양력날짜) {
              return item.양력날짜.getFullYear() === 년 && item.양력날짜.getMonth() === 월 && item.양력날짜.getDate() === 일;
            }
            else return false;
          })
          return index2 >= 0;
        }
      );  
      listRef.current.scrollToItem(index);
    }
  }, [data, 년, 월, 일]);

  useEffect(() => {
    scrollToday();
  }, [ scrollToday ]);

  return (
    <div className='달력'>

      <div className='헤더' ref={headerRef}>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '10px'
          }}
        >

          <button className='메뉴'>메뉴</button>
          
          <h2 className='달'>
            {달이름(달)}
          </h2>

          <button className='오늘' onClick={scrollToday}>오늘</button>

        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: '10px',
            paddingRight: '10px'
          }}
        >

          <div className='년월'>단기 {달 === 0 ? `${해}(${해 - 1})` : 해}년</div>

          <div className='년월'>{달 === 0 ? `${해 - 2333}(${해 - 1 - 2333})` : 해 - 2333}년</div>

        </div>

        <div className='요일'>
          { ['해', '달', '화성', '수성', '목성', '금성', '토성'].map((요일, 순서) => {
            let color;

            if(순서 === 0) color = 'rgba(255, 0, 0, 0.7)';
            else if(순서 === 6) color = 'cornflowerblue';
            
            const style = {
              color,
              width: 30,
              textAlign: 'center'
            }

            return <div key={순서} style={style}>{요일}</div>;
          }) }
        </div>

      </div>

      <AutoSizer>
        {({ height, width }) => (
          <List
            className='모든날'
            width={width}
            height={height - headerRef.current.clientHeight}
            itemCount={data.length}
            itemSize={height - headerRef.current.clientHeight}
            itemData={data}
            ref={listRef}
            // onScroll={handleScroll}
          >
            {({ data, index, style }) => {
              return (
                한달을그리다(
                  data[index],
                  index,
                  style,
                  해,
                  해설정,
                  달,
                  달설정
                )
              );
            }}
          </List>
        )}
      </AutoSizer>

    </div>
  );
}

export default App;
