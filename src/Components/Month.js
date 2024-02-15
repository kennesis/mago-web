import React, { useRef, useEffect, memo } from 'react';
import Week from './Week';

function Month({ 한달, 순서, style, 해설정, 달설정 }) {
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
          key={`month${순서}`}
          className='한달'
          style={style}
          ref={ref}
          year={한달.날짜.해}
          month={한달.날짜.달}
        >
          {한달.한달.map((한주, 순서) => <Week key={`week${순서}`} 한주={한주} 순서={순서}/>)}
        </div>
    );
  }

  export default memo(Month);