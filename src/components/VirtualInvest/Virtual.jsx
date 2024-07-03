// App.js
import '../../styles/Virtual.scss';
import React, { useState, useEffect } from 'react';
import { getConvertData, volumeArr } from './BybitAPI';
import Candle from './Candle';
import SellBtn from './SellOrder';
import Order from './BuyOrder';
import Detail from './showDetail';
import MyResponsiveLine from './userChart';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { showRecord } from '../../services/apiService';
import ProfitAndLoss from './ProfitAndLoss';
import SelectSymbol from './SelectSymbol';

import { userInfo } from '../../services/apiService';

let yearofDay = 365; //bybit api 데이터는 시간이 역순이므로 slice도 역순으로 해야함
let totalTurn = 180; //턴 표기를 위한 변수 (const index랑 같아야함)
let initialAccount = 3000000; //초기 금액

const numberWithCommas = (numberString) => {
  if (typeof numberString === 'number') {
    numberString = numberString.toFixed(2);
  }
  if (typeof numberString !== 'string') {
    numberString = String(numberString);
  }

  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Virtual = () => {
  const [index, setIndex] = useState(180); //시작 캔들 개수
  const [data, setData] = useState([]); //api로 가져온 데이터
  const [volume, setVolume] = useState([]); // api로 가져온 볼륨데이터
  const [currentCost, setCurrentCost] = useState(0); //현재 가격
  const [currentProfit, setCurrentProfit] = useState(0); //현재 이익
  const [prevInvest, setPrevInvest] = useState(0); // 이전 투자금액 -> profit 계산에 사용

  const account = useSelector((state) => state.account).toFixed(2); //잔고 (소수 둘째자리)
  const [formatted_account, setFormatted] = useState(numberWithCommas(account));
  const [myturn, setMyturn] = useState(0); //현재까지 진행된 턴 계산

  const cookie = useCookies(['jwtCookie']);
  const navigate = useNavigate(); //페이지 이동
  const notLogin = () => {
    navigate('/signin');
  };

  //아래는 투자종목 다양화
  const [symbol, setSymbol] = useState(() => {
    const storedSymbol = localStorage.getItem('selectedSymbol');
    return storedSymbol || 'BTCUSDT'; // localStorage에 값이 없으면 'BTCUSDT'를 기본값으로 사용
  });

  // 페이지가 로드될 때 localStorage에서 값 가져오기
  useEffect(() => {
    const storedSymbol = localStorage.getItem('selectedSymbol');
    if (!storedSymbol) {
      // localStorage에 selectedSymbol이 없다면 기본값 'BTCUSDT'를 추가
      localStorage.setItem('selectedSymbol', 'BTCUSDT');
      setSymbol('BTCUSDT');
    } else {
      setSymbol(storedSymbol);
    }
  }, [setSymbol]);

  // 다음턴 버튼 클릭 시, bybit api 통신
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getConvertData(symbol); // 데이터가 로딩될 때까지 대기
        const resVol = await volumeArr;
        setData(result.slice(index, yearofDay));
        setVolume(resVol.slice(index, yearofDay));
        setCurrentCost(data[data.length - 1].close);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [index]);

  // account 값이 변경될 때마다 formatted_account도 갱신
  useEffect(() => {
    setFormatted(numberWithCommas(account));

    let per = (Math.abs(account - initialAccount) / initialAccount) * 100; //
    per = per.toFixed(2);

    const str =
      account >= initialAccount ? '+' + String(per) : '-' + String(per); //pro가 음수일 경우 - 부호를 달 필요 없음

    setCurrentProfit(str);
  }, [account, prevInvest, currentProfit]);

  // 초기 부터 currentValue 설정
  useEffect(() => {
    setCurrentCost(data[data.length - 1]?.close);
  }, [data]);

  const updatePrevInvest = (prev) => {
    setPrevInvest(prev);
  };

  const nextTurn = async () => {
    setIndex(index - 1);
    const newData = data.slice(index, yearofDay);
    const newVol = data.slice(index, yearofDay);
    setData(newData);
    setVolume(newVol);
    setMyturn(myturn + 1);
  };

  const candleProps = {
    data: data.sort((a, b) => new Date(a.time) - new Date(b.time)),
    colors: {
      backgroundColor: 'white',
      lineColor: '#2962FF',
      textColor: 'black',
      areaTopColor: '#2962FF',
      areaBottomColor: 'rgba(41, 98, 255, 0.28)',
    },
    volumeArr: volume.sort((a, b) => new Date(a.time) - new Date(b.time)),
    symbolName: symbol,
  };

  // 모달창
  const [openSellModal, setOpenSellModal] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const showSellModal = () => {
    setOpenSellModal(true);
  };

  const closeSellModal = () => {
    setOpenSellModal(false);
  };

  const showBuyModal = () => {
    setOpenBuyModal(true);
  };

  const closeBuyModal = () => {
    setOpenBuyModal(false);
  };

  // detail 컴포넌트에 데이터 넘겨주기
  const [detailData, setDetailData] = useState({});
  const showDetailModal = async () => {
    setOpenDetailModal(true);
    // 모달 클릭 시 이벤트 -> axios 요청필요 -> apiService에서 가져오기 ('/virtual/record')
    if (cookie[0].jwtCookie) {
      try {
        const response = await showRecord();
        if (response) {
          const { profit, win, loss, profitArray } = response; //db 데이터 받아오기
          // console.log(
          //   'profit, win, loss, ProfitAndLoss',
          //   profit,
          //   win,
          //   loss,
          //   profitArray
          // );
          setDetailData({ profit, win, loss, profitArray });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('로그인이 필요함');
      notLogin();
    }
  };

  const closeDetailModal = () => {
    setOpenDetailModal(false);
  };

  const stock = useSelector((state) => state.stock); //보유주식 수
  const purchasePrice = useSelector((state) => state.purchasePrice); //보유주식 평단가

  const [userNickname, setuserNickname] = useState('');
  const [userId, setUserId] = useState('');
  const jwtCookie = useCookies(['jwtCookie']);
  useEffect(() => {
    const tokenId = jwtCookie['jwtCookie'];
    // console.log('tokenId', tokenId);
    const getUserInfo = async () => {
      try {
        const response = await userInfo({ id: tokenId });
        setuserNickname(response.info.user_nickname);
        setUserId(response.info.user_id);
      } catch (error) {
        console.log('사용자 정보 가져오기 에러', error);
      }
    };
    getUserInfo();
  }, []);

  return (
    <div className="invest-wrapper">
      <div className="invest-chart">
        <Candle {...candleProps} />
      </div>

      <div className="invest-input">
        <div className="status-Box">
          <button onClick={showDetailModal} className="resetBtn">
            <p>
              <span className="material-symbols-outlined"> 기록보기search</span>
            </p>
          </button>
          {openDetailModal && (
            <Detail
              close={closeDetailModal}
              response={detailData}
              user={userNickname}
              userid={userId}
            />
          )}
          <ProfitAndLoss />
        </div>
        <div className="selectSymbolBox">
          <SelectSymbol symbol={symbol} setSymbol={setSymbol} />
        </div>
        <div className="mainContentBox">
          <div className="currentCostBox">
            <p className="smallTitle">현재 가격</p>
            <p>
              <span>{currentCost}</span> $
            </p>
          </div>
          <div className="btn-wapper">
            <div className="tradingBtnBox">
              <button className="buy Btn" onClick={showBuyModal}>
                매수
              </button>
              {openBuyModal && (
                <Order
                  currentVal={currentCost}
                  prevInvest={prevInvest}
                  updatePrevInvest={updatePrevInvest}
                  close={closeBuyModal}
                />
              )}

              <button className="sell Btn" onClick={showSellModal}>
                매도
              </button>
              {openSellModal && (
                <SellBtn
                  currentVal={currentCost}
                  prevInvest={prevInvest}
                  updatePrevInvest={updatePrevInvest}
                  close={closeSellModal}
                />
              )}
            </div>
            <div className="nextBtnBox">
              <button className="next Btn" onClick={nextTurn}>
                <p style={{}}>
                  <span className="material-symbols-outlined">skip_next</span>
                </p>

                <p>
                  {myturn} / {totalTurn}
                </p>
              </button>
            </div>
          </div>
          <div className="currentStock">
            <div>
              <p className="smallTitle">내 주식 현황</p>
              <p>
                <span>{stock}</span> 주
              </p>
            </div>
            <div>
              <p className="smallTitle"> 평단가</p>
              <p>
                <span>{Number(purchasePrice).toFixed(2)}</span> $
              </p>
            </div>
          </div>
          <div className="totalMoney">
            <p className="smallTitle">잔액 ({currentProfit} %)</p>
            <p>
              <span>{formatted_account}</span> $
            </p>
          </div>

          <div className="investMoney">
            <p className="smallTitle">보유자산</p>
            <p>
              <span>
                {numberWithCommas(Number(purchasePrice).toFixed(3) * stock)}
              </span>
              $
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Virtual;
