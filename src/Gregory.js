function gregory(year, month) {

    let first = getDayOfTheYear(year, month);
    let dayOfTheMonth = getDayOfTheMonth(year, month, first);
    // console.log(dayOfTheMonth);
  
    // let month = createMonth();
  
    // return month;
  
    // function createMonth() {
    //   let arr = [];
    //   let date = 0;
  
    //   for(let row = 0; row <= 5; row++) {
    //     arr.push(createWeek(row, date));
    //   }
  
    //   return arr;
    // }
  
    // function createWeek(row, date) {
    //   let arr = [];
  
    //   for(let column = 0; column <= 6; column++) {
    //     arr.push(column);
    //   }
  
    //   return arr;
    // }
  
    function getDayOfTheMonth(year, month, first) {
      for(let j = 1; j < month; j++) {
        first += getMonthLength(year, j) % 7;
      }
  
      let day = first % 7; // 입력한 month의 1일의 요일
  
      return day;
    }
  
    function getDayOfTheYear(year, month) {
      let sum = 0;
  
      for (let i = 1583; i < year; i++) {
        if ((i % 4 === 0 && i % 100 !== 0) || i % 400 === 0) {
          // 윤년이라면
          sum += 2;
        } else {
          // 평년이라면
          sum += 1;
        }
      }
  
      const first = (sum + 6) % 7; // 입력한 year의 1월 1일의 요일
  
      return first;
    }
  
    function getMonthLength(year, month) {
      if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12 ) {
        return 31;
      } else if(month === 4 || month === 6 || month === 9 || month === 11) {
        return 30;
      } else {
        if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          return 29;
        } else {
          return 28;
        }
      }
    }
      
  }