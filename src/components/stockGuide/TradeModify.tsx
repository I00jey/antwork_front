import { TradeOrderProps } from '../../types/TradeOrderProps';

const TradeModify = ({ handleClick }: TradeOrderProps) => {
  const selectChange = (e: any) => {
    handleClick(e.target.value);
    // console.log(e.target.value)
  };

  return (
    <div className="order-content order-modify">
      <div className="order-method">
        <div className="open-orders">미체결 내역</div>
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
      <div className="modify-btn">정정</div>
    </div>
  );
};
export default TradeModify;
