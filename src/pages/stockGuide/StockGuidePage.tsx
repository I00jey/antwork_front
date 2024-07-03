import { useEffect, useState } from 'react';
import TrandingViewWidget from '../../components/stockGuide/TrandingViewWidget';
import './../../styles/StockGuide.scss';
import Virtual from '../../components/VirtualInvest/Virtual';
import { GetWord } from '../../services/apiService';
import TradeOrder from '../../components/stockGuide/TradeOrder';
import TradeBuy from '../../components/stockGuide/TradeBuy';
import TradeSell from '../../components/stockGuide/TradeSell';
import TradeModify from '../../components/stockGuide/TradeModify';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const StockGuidePage = () => {
  const [isToggle, setIsToggle] = useState(false);
  const [explain, setExplain] = useState('뜻을 확인하려면 단어를 선택하세요.');
  const [trade, setTrade] = useState('buy');
  const location = useLocation();

  const handleClick = async (word: string) => {
    try {
      const response = await GetWord(word);
      // console.log(response.data.explanation);
      // return response.data.explanation;
      setExplain(response.data.explanation);
    } catch (error: any) {
      console.error('DB에 없는 단어입니다.');
    }
  };
  const toggleClick = () => {
    setIsToggle((prevIsToggle) => !prevIsToggle);
    if (isToggle) {
      setIsToggle(false);
    } else {
      setIsToggle(true);
    }
  };

  useEffect(() => {
    setIsToggle(false);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>개미운동 : 주식길잡이</title>
      </Helmet>
      <div className="outer-wrapper">
        <div className="guide-title">
          주식 길잡이{' '}
          {isToggle === true && (
            <div className="guide-help-box">
              증권사 어플과 유사한 호가창이에요. 궁금한 단어를 클릭하면 뜻이
              나와요!
              <br />
              (현재 보이는 호가창은 1월 25일 오후 12시 40분 기준입니다.)
            </div>
          )}
          <div className="guide-icon" onClick={toggleClick}>
            <span className="material-symbols-rounded">question_mark</span>
          </div>
        </div>
        <ul>
          <Link to="/stockGuide">
            <li className="selected-blue">주식</li>
          </Link>
          <Link to="/stockRate">
            <li>기업 정보</li>
          </Link>
          <Link to="/virtual">
            <li>모의 투자</li>
          </Link>
        </ul>
        <div className="stock-guide">
          {/* <div className="graph-y" onClick={()=>handleClick('y')}></div> */}
          <div className="stock-section">
            <div className="stock-chart">
              <TrandingViewWidget />
            </div>
            {/* <div className="graph-x" onClick={()=>handleClick('x')}></div> */}

            <div className="stock-explain">
              {' '}
              {explain.includes('캔들') && (
                <img
                  style={{ width: '200px', float: 'left', marginRight: '20px' }}
                  src={process.env.PUBLIC_URL + 'candle-chart.png'}
                />
              )}
              {explain}
            </div>
          </div>
          <div className="trade-control">
            <div className="stock-info">
              <div className="market">
                <div className="company" onClick={() => handleClick('company')}>
                  삼성전자
                </div>
                <div
                  className="market-price"
                  onClick={() => handleClick('stock Price')}
                >
                  73,900
                </div>
                <div
                  className="daily-change"
                  onClick={() => handleClick('prev_price')}
                >
                  ▼ 100(0.14%)
                </div>
              </div>

              <div className="volume">
                <div className="graph-btn">
                  <span onClick={() => handleClick('bar')}>
                    <img
                      className="bar-graph-btn"
                      src={process.env.PUBLIC_URL + 'bar.png'}
                    />
                  </span>
                  &ensp;&ensp;
                  <span onClick={() => handleClick('candle')}>
                    <img
                      className="candle-graph-btn"
                      src={process.env.PUBLIC_URL + 'candle.png'}
                    />
                  </span>
                </div>
                <div className="price-group">
                  <span onClick={() => handleClick('opening_price')}>시</span>
                  &ensp;|&ensp;
                  <span onClick={() => handleClick('high_price')}>고</span>
                  &ensp;|&ensp;
                  <span onClick={() => handleClick('final_price')}>종</span>
                  &ensp;|&ensp;
                  <span onClick={() => handleClick('low_price')}>저</span>
                </div>
                <div
                  className="total-volume"
                  onClick={() => handleClick('cumulative_volume')}
                >
                  6,460,820
                </div>
                <div
                  className="volume-change"
                  onClick={() => handleClick('prev_volume')}
                >
                  (50.24%)
                </div>
              </div>
            </div>
            {trade === 'buy' && (
              <div className="trade-tab">
                <div
                  className="tradeBtn btn-selected"
                  onClick={() => {
                    setTrade('buy');
                    handleClick('buy');
                  }}
                >
                  매수
                </div>
                <div
                  className="tradeBtn"
                  onClick={() => {
                    setTrade('sell');
                    handleClick('sell');
                  }}
                >
                  매도
                </div>
                <div
                  className="tradeBtn"
                  onClick={() => {
                    setTrade('modify');
                    handleClick('amend');
                  }}
                >
                  정정
                </div>
              </div>
            )}
            {trade === 'sell' && (
              <div className="trade-tab">
                <div
                  className="tradeBtn"
                  onClick={() => {
                    setTrade('buy');
                    handleClick('buy');
                  }}
                >
                  매수
                </div>
                <div
                  className="tradeBtn btn-selected"
                  onClick={() => {
                    setTrade('sell');
                    handleClick('sell');
                  }}
                >
                  매도
                </div>
                <div
                  className="tradeBtn"
                  onClick={() => {
                    setTrade('modify');
                    handleClick('amend');
                  }}
                >
                  정정
                </div>
              </div>
            )}
            {trade === 'modify' && (
              <div className="trade-tab">
                <div
                  className="tradeBtn"
                  onClick={() => {
                    setTrade('buy');
                    handleClick('buy');
                  }}
                >
                  매수
                </div>
                <div
                  className="tradeBtn"
                  onClick={() => {
                    setTrade('sell');
                    handleClick('sell');
                  }}
                >
                  매도
                </div>
                <div
                  className="tradeBtn btn-selected"
                  onClick={() => {
                    setTrade('modify');
                    handleClick('amend');
                  }}
                >
                  정정
                </div>
              </div>
            )}

            <div className="order">
              <TradeOrder handleClick={handleClick} />
              {trade === 'buy' && <TradeBuy handleClick={handleClick} />}
              {trade === 'sell' && <TradeSell handleClick={handleClick} />}
              {trade === 'modify' && <TradeModify handleClick={handleClick} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockGuidePage;
