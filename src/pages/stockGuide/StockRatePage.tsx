// StockRate.tsx
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MarketData from '../../components/CompanyInfo/MarketData';
import Ticker from '../../components/CompanyInfo/Ticker';
import FundamentalData from '../../components/CompanyInfo/FundamentalData';
import CompanyProfile from '../../components/CompanyInfo/CompanyProfile';

import './../../styles/StockRate.scss';
import './../../styles/StockGuide.scss';
import { Helmet } from 'react-helmet';

const StockRate = () => {
  const [searchSymbol, setSearchSymbol] = useState('NASDAQ:AAPL');
  const [postSymbol, setPostSymbol] = useState('');
  const [reLoad, setReLoad] = useState(true);
  const [isToggle, setIsToggle] = useState(false);
  const location = useLocation();

  const selectCompany = (e: any) => {
    const target = e.target.value;
    // console.log(target);
    setSearchSymbol(target);
  };

  // const Search = (e: any) => {
  //   setReLoad(!reLoad);
  //   setPostSymbol(searchSymbol);
  // };
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
        <title>개미운동 : 기업정보</title>
      </Helmet>
      <div className="outer-wrapper">
        <div className="guide-title">
          주식 길잡이{' '}
          {isToggle === true && (
            <div className="guide-help-box">
              기업에 대한 전반적 프로필, 재무재표, 세부사항을 볼 수 있어요!
              <br />
              입력창을 이용한 데이터 서치가 가능합니다.
            </div>
          )}
          <div className="guide-icon" onClick={toggleClick}>
            <span className="material-symbols-rounded">question_mark</span>
          </div>
        </div>
        <ul>
          <Link to="/stockGuide">
            <li>주식</li>
          </Link>
          <Link to="/stockRate">
            <li className="selected-blue">기업 정보</li>
          </Link>
          <Link to="/virtual">
            <li>모의 투자</li>
          </Link>
        </ul>
        <div
          className="mainCompanyBox"
          style={{
            // backgroundColor: 'pink',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="searchBox">
            <select name="" id="" onChange={selectCompany} value={searchSymbol}>
              <option value="NASDAQ:AAPL">애플 (APPL)</option>
              <option value="NASDAQ:TSLA">테슬라 (TSLA)</option>
              <option value="NASDAQ:AMZN">아마존 (AMZN)</option>
              <option value="NASDAQ:MSFT">마이크로소프트 (MSFT)</option>
              <option value="NASDAQ:INTC">인텔 (INTC)</option>
              <option value="NASDAQ:NVDA">엔비디아 (NVDA)</option>
              <option value="NASDAQ:GOOGL">알파벳 (GOOGL)</option>
              <option value="NASDAQ:META">메타 (META)</option>
              <option value="NASDAQ:NFLX">넷플릭스 (NFLX)</option>
              <option value="NYSE:ORCL">오라클 (ORCL)</option>
            </select>
          </div>
          <div className="companyInfoBox">
            <div className="CompanyInfoInner">
              <div className="TickerBox">
                <Ticker />
              </div>
              <div className="CProfileBox">
                <CompanyProfile search={searchSymbol} />
              </div>
              {/* <MarketData /> */}
            </div>
            <div className="flip">
              <FundamentalData search={searchSymbol} />
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </>
  );
};

export default StockRate;
