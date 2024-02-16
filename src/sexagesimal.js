export default function 일진구하기(date) {
    // 천간과 지지 배열을 정의합니다.
    const 천간 = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const 지지 = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

    // 날짜에서 년, 월, 일을 추출합니다.
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let c;
    let y;
    let m = month;

    if(m === 1 || m === 2) {
        y = year - 1;
        m += 12;
    } else {
        y = year;
    }

    c = parseInt((y + '').substring(0, 2));
    y = parseInt((y + '').substring(2, 4));

    const n = ((44 * c) + 최대정수(c, 4) + (5 * y) + 최대정수(y, 4) + (30 * m) + 최대정수(((3 * m) - 7), 5) + day + 38) % 60;

    // 간과 지를 계산합니다.
    let ganIndex = n % 10;
    let jiIndex = n % 12;
    
    // 결과를 반환합니다.
    return 천간[ganIndex] + 지지[jiIndex];
}

function 최대정수(x, a) {
    return Math.floor((x / a));
}

// 현재 날짜와 시간을 사용하여 일진을 계산합니다.
// const currentDate = new Date('1991-12-29');
// const 일진 = 일진구하기(currentDate);
// console.log('현재 일진: ', 일진);
