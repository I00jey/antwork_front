// // BybitAPI.js

// const { RestClientV5 } = require('bybit-api');
// const volumeArr = [];

// const client = new RestClientV5({
//   testnet: true,
// });

// let convertData = []; // 초기에 빈 배열로 선언

// const fetchData = async (symbol) => {
//   try {
//     convertData = []; // 초기에 빈 배열로 선언
//     // volumeArr.length = 0

//     const response = await client.getKline({
//       category: 'inverse',
//       symbol: symbol,
//       interval: 'D',
//       start: 1640995200000,
//       end: 1672531199000,
//       limit: 365,
//     });

//     const bybitCandleData = response.result.list;

//     // 데이터 변환
//     bybitCandleData.forEach((candle) => {
//       const [timestamp, open, high, low, close, volume, turnover] = candle;
//       const time = new Date(Number(timestamp)).toISOString().slice(0, 10);

//       volumeArr.push({
//         time,
//         value: volume,
//         color: '#ABBAFF', //볼륨 색상변경
//       });

//       convertData.push({
//         time,
//         open: parseFloat(open),
//         high: parseFloat(high),
//         low: parseFloat(low),
//         close: parseFloat(close),
//       });
//     });

//     return convertData;
//   } catch (error) {
//     console.error(error);
//     throw error; // 오류 발생 시 다시 던짐
//   }
// };

// module.exports = {
//   getConvertData: fetchData,
//   volumeArr: volumeArr,
// };


// ------------------------------------------------
// BybitAPI.js:50 TypeError: (0 , axios_1.default) is not a function
//  bybit-api 라이브러리 내부에서 axios import 방식이 꼬여서 오류 발생
const axios = require('axios');
const volumeArr = [];

const fetchData = async (symbol) => {
  try {
    volumeArr.length = 0;

    const response = await axios.get('https://api-testnet.bybit.com/v5/market/kline', {
      params: {
        category: 'linear',
        symbol: symbol,
        interval: 'D',
        start: 1640995200000,
        end: 1672531199000,
        limit: 365,
      },
    });

    const resData = response.data;

    // 응답 유효성 검사
    if (resData.retCode !== 0 || !resData.result || !resData.result.list) {
      throw new Error(`Bybit API 실패: ${resData.retMsg}`);
    }

    const bybitCandleData = resData.result.list;
    const convertData = [];

    bybitCandleData.forEach((candle) => {
      const [timestamp, open, high, low, close, volume] = candle;
      const time = new Date(Number(timestamp)).toISOString().slice(0, 10);

      volumeArr.push({
        time,
        value: volume,
        color: '#ABBAFF',
      });

      convertData.push({
        time,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
      });
    });

    return convertData;
  } catch (error) {
    console.error('Bybit API 오류 ->', error.message || error);
    throw error;
  }
};

module.exports = {
  getConvertData: fetchData,
  volumeArr: volumeArr,
};
