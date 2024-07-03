import { useState } from 'react';
import { TradeOrderProps } from '../../types/TradeOrderProps';

const TradeBuy = ({ handleClick }: TradeOrderProps) => {
  // const [type, setType]=useState('지정가');
  const selectChange = (e: any) => {
    handleClick(e.target.value);
    // console.log(e.target.value)
  };

  return (
    <div className="order-content order-buy">
      <div className="order-method">
        <div className="order-cash">현금</div>
        <div className="order-credit">신용</div>
        <div
          className="order-margin"
          onClick={() => handleClick('margin_loan')}
        >
          신용융자
        </div>
      </div>
      <div className="order-price">
        <select onChange={(e) => selectChange(e)}>
          <option value="limit_order">지정가</option>
          <option value="market_order">시장가</option>
          <option value="conditional_order">조건부지정가</option>
          <option value="market_to_order">최유리지정가</option>
          <option value="market_to_best">최우선지정가</option>
          <option value="after_hours_order">시간외종가</option>
          <option value="after_hours_single">시간외단일가</option>
        </select>

        <div
          className="order-market-price"
          onClick={() => handleClick('market_order')}
        >
          시장가
        </div>
      </div>
      <div className="order-market-sell">
        수량 <div className="order-market-value">0주</div>
      </div>
      <div
        className="order-market-sell"
        style={{ cursor: 'pointer' }}
        onClick={() => handleClick('bid_ask_spread')}
      >
        호가 <div className="order-market-value">74,000</div>
      </div>
      <div className="order-market-sell">
        금액<div className="order-market-value">원</div>
      </div>
      <div className="buy-btn">매수</div>
    </div>
  );
};

export default TradeBuy;
