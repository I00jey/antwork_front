// api 안가져와질 때 쓰세요.. 랜덤하게 캔들생성해줌

function CreateCandle() {
  let YearofDays = [31, 29, 31, 30, 31, 30, 31, 31, 30]; // 24년 1~9월까지 일 수
  const candle = [
    { time: "2024-12-22", open: 30.45, close: 32.51, high: 33.22, low: 29.68 },
  ];
  let pos = 1; // 이전 open 값을 접근하기 위한 값

  for (let i = 0; i < YearofDays.length; i++) {
    for (let j = 0; j < YearofDays[i]; j++) {
      // 랜덤으로 상승, 하락을 판단
      let UpandDown = Math.random() > 0.5 ? "up" : "down";

      let month = i + 1;
      let days = j + 1;
      let openCost = candle[pos - 1].close;

      // 소수점 첫 자리까지만 가져오기 (여기서 변동폭 바꿀 수 있음)
      let randomValue = Math.floor(Math.random() * 30) / 10;

      // 캔들 필요 데이터
      let closeCost = 0;
      let highCost = openCost + randomValue;
      let lowCost = openCost - randomValue;

      if (UpandDown === "up") {
        // 주가 증가
        // closeCost가 openCost와 highCost 사이에 위치하도록 조정
        closeCost =
          openCost +
          Math.floor(Math.random() * (highCost - openCost) * 10) / 10;
      } else {
        // 주가 하락
        // lowCost가 openCost와 highCost 사이에 위치하도록 조정
        closeCost =
          openCost -
          Math.floor(Math.random() * (highCost - openCost) * 10) / 10;
      }

      // 월과 일을 두 자리로 표현
      let formattedMonth = month < 10 ? `0${month}` : month;
      let formattedDays = days < 10 ? `0${days}` : days;

      let data = {
        time: `2024-${formattedMonth}-${formattedDays}`,
        open: openCost,
        close: closeCost,
        high: highCost,
        low: lowCost,
      };
      pos += 1;
      candle.push(data);
    }
  }

  return candle;
}

module.exports = CreateCandle;
