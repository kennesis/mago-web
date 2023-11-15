import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
// import * as _ from 'lodash';
import './App.css';

const 달력 = '마고력';
// let 육십갑자 = '계묘';
let 서기 = 2023;
let 단기 = 서기 + 2333;
let 환웅기원 = 서기 + 3898;

const 기준 = {
  마고력: {
    해: 서기,
    달: 13,
    날: '설',
  },
  그레고리력: {
    해: 서기,
    달: 11,
    날: 22
  },
  음력: {
    해: 서기,
    달: 10,
    날: 10
  },
  절기: '소설'
}

function 시작요일(하늘, 땅) {
  let 요일 = 0;

  for(let i = 1; i <= 하늘; i++) {
    if(i % 4 === 0) {
      요일 += 2;
    }
    else 요일 += 1;
  }

  if(하늘 % 4 === 0) {
    if(땅 > 0) 요일 += 1;
  } else {
    요일 += 1;
  }

  return 요일 % 7;
}

function 개천부터세다() {
  let 모든날 = [];

  for(let 하늘 = 환웅기원 - 1; 하늘 < 환웅기원 + 40; 하늘++) {
    모든날.push(한해를세다(하늘));
  }

  return 모든날;
}

function 한해를세다(하늘) {
  let 한해 = [];

  for(let 땅 = 0; 땅 < 소력().사.수; 땅++) {
    한해.push(한달을세다(하늘, 땅));
  }

  return 한해;
}

function 한달을세다(하늘, 땅) {
  let 한달 = [];
  let 판 = 0;
  let 날 = 0;
  let 시작 = false;

  if(하늘 % 4 === 0 && 땅 === 0) {
    판 = 1;
  }

  let 추가열 = 시작요일(하늘, 땅) === 6 && 판 === 1 ? true : false;

  for(let 해 = 0; 해 <= 소력().기.수 + 추가열; 해++) {
    let 한주 = [];

    for(let 달 = 0; 달 < 소력().요.수; 달++) {
      if(해 === 0 && !시작) {
        if(달 === 시작요일(하늘, 땅)) {
          시작 = true;
        } else {
          한주.push(하루를세다(하늘, 땅, 해, 달, 날, 판));
          continue;
        }
      }

      한주.push(하루를세다(하늘, 땅, 해, 달, 날, 판));
      날++;

    }

    한달.push(한주);
  }

  return {
    한달,
    날짜: {
      해: 하늘,
      달: 땅
    }
  };
}

function 하루를세다(하늘, 땅, 해, 달, 날, 판) {
  let 휴일 = false;
  let 설 = false;
  
  if(땅 === 0 && 해 === 0 && 달 === 시작요일(하늘, 땅) && 날 === 0) {
    설 = true;
  }

  if(날 <= 0 || 날 > (소력().기.수 * 소력().요.수) + 판) {
    날 = null;
  }

  return {
    날짜: 날,
    설,
    휴일
  };
}

function 소력() {
  const 사 = {
    이름: '년',
    수: 13
  };
  const 기 = {
    이름: '월',
    수: 4
  };
  const 요 = {
    이름: '일',
    수: 7,
    요일: [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ]
  };
  const 복 = {
    호칭: '요의 끝'
  }

  return {
    사,
    기,
    요,
    복
  };
}

// function 모두그리다(모든날) {
//   return (
//     <div className='모든날'>
//       {모든날.map((한해, 순서) => 한해를그리다(한해, 순서))}
//     </div>
//   );
// }

// function 한해를그리다(한해, 순서) {
//   return (
//     <div key={순서} className='한해'>
//       {한해.map((한달, 순서) => 한달을그리다(한달, 순서))}
//     </div>
//   );
// }

function 한달을그리다(한달, 순서, style, 해, 해설정, 달, 달설정) {
  const ref = useRef();

  useEffect(() => {
    const instance = ref.current;

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // entry.target.style.backgroundColor = 'lightgreen';
          // console.log(entry.target);
          해설정(`${한달.날짜.해}년`);
          if(한달.날짜.달 === 0) {
            해설정(`${한달.날짜.해}(${한달.날짜.해 - 1})년`);
            달설정('정한달');
          } 
          else 달설정(`${한달.날짜.달}월`);
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
  }, [한달.날짜.해, 해, 한달.날짜.달, 달, 해설정, 달설정]);

  return (
    <div key={순서} className='한달' style={style} ref={ref}>
      {한달.한달.map((한주, 순서) => 한주를그리다(한주, 순서))}
    </div>
  );
}

function 한주를그리다(한주, 순서) {
  return (
    <div key={순서} className='한주'>
        {한주.map((하루, 순서) => 하루를그리다(하루, 순서))}
    </div>
  );
}

function 하루를그리다(하루, 순서) {
  let color = 'black';

  if(하루.설) color = 'red';

  const style = {
    color
  }

  return (
    <div
      key={순서}
      className='하루'
      style={style}
    >
      <div key={순서}>{하루.설 ? '설' : 하루.날짜}</div>
    </div>
  );
}

// function 오늘날짜구하기() {
//   const 오늘인가 = new Date();
//   const 오늘 = `${오늘인가.getFullYear()}년 ${오늘인가.getMonth() + 1}월 ${오늘인가.getDate()}일`;
//   // console.log(오늘);
//   return 오늘;
// }

function 요일구하기(날짜) {
  let 요일 = '';
  switch (날짜) {
    case 0:
      요일 = '해';
      break;
    case 1:
      요일 = '달';
      break;
    case 2:
      요일 = '화성';
      break;
    case 3:
      요일 = '수성';
      break;
    case 4:
      요일 = '목성';
      break;
    case 5:
      요일 = '금성';
      break;
    case 6:
      요일 = '토성';
      break;
  
    default:
      break;
  }
  return 요일;
}

// 오늘을 어떻게 알 것인가?

function App() {
  const [ 해, 해설정 ] = useState();
  const [ 달, 달설정 ] = useState(0);
  // const [ 기준달력, 기준달력설정 ] = useState('마고력');
  let [ data ] = useState(개천부터세다().flat());
  const headerRef = useRef();
  const listRef = useRef();

  // console.log(data);
  // gregory(2022, 9);

  useLayoutEffect(() => {
    const instance = listRef.current;
    if(instance) instance.scrollToItem(5);
  }, []);

  const scrollToday = useCallback(e => {
    listRef.current.scrollToItem(5);
  }, []);

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
          
          <h2 className='달력이름' style={{ alignSelf: 'center', margin: '0px auto' }}>
            {달력}
          </h2>

          <button className='오늘' onClick={scrollToday}>오늘</button>

        </div>

        <h3>단기 {해} {달}</h3>

        <div className='요일'>
          { 소력().요.요일.map((날짜, 순서) => {
            const 요일 = 요일구하기(날짜);
            let color = 'black';

            if(요일 === '해') color = 'red';
            else if(요일 === '토성') color = 'blue';
            
            const style = {
              color,
              width: 30,
              textAlign: 'center'
            }

            return <div key={순서} style={style}>{요일구하기(날짜)}</div>;
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
