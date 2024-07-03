import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useTheme } from 'styled-components';

const Order = ({ currentVal, prevInvest, updatePrevInvest, close }) => {
  const account = useSelector((state) => state.account).toFixed(2); //잔고 (소수 둘째자리)
  const stock = useSelector((state) => state.stock); //보유주식 수
  const purchasePrice = useSelector((state) => state.purchasePrice); //보유주식 평단가
  const [buyOrder, setBuyOrder] = useState(''); // text로 입력 받은 주식 수
  const dispatch = useDispatch();

  const cookie = useCookies(['jwtCookie']);
  const navigate = useNavigate(); //페이지 이동
  const notLogin = () => {
    navigate('/signin');
  };

  useEffect(() => {
    // console.log('purchase', purchasePrice);
  }, [purchasePrice]);

  const CalculatorOrder = () => {
    if (cookie[0].jwtCookie) {
      const cal = (buyOrder * currentVal).toFixed(2); //투자 금액

      // 주문 총 금액이 잔고보다 많을 때만 적용
      if (account - cal >= 0) {
        // console.log('buyorder', buyOrder);
        dispatch({ type: 'SET_ACCOUNT', payload: account - cal });
        const newStock = Number(stock) + Number(buyOrder);

        updatePrevInvest(prevInvest + Number(cal)); //지금까지의 투자금액은 잔고가 유효한지 확인 필요

        //stock이 0이면 평단가를 현재 가격으로 설정
        const newPurchasePrice =
          newStock === 0
            ? Number(currentVal)
            : (Number(purchasePrice) * stock + Number(cal)) / newStock;

        dispatch({
          type: 'SET_STOCK',
          payload: newStock,
        });

        dispatch({
          type: 'SET_PURCHASE_PRICE',
          payload: newPurchasePrice.toFixed(2),
        });
        alert(
          `${buyOrder}주 매수가 완료되었습니다. 현재 ${newStock}주 보유중입니다.`
        );
        close();
      } else {
        alert('돈없음');
      }
    } else {
      alert('로그인이 필요함');
      notLogin();
    }
  };

  // 퍼센트 범위 표시
  useEffect(() => {});
  const [range, setRange] = useState(50);
  const [calPerVal, setCalPerVal] = useState(0);
  const dataChange = (e) => {
    const perValue = e.target.value;

    // console.log(perValue);
    setRange(Number(perValue));
    // console.log(perValue);
    // console.log('def', range);
    // 범위값

    // 퍼센트 조작에 대한 변경

    const availablePurchase = parseInt(account / currentVal); //구매 가능한 최대

    const cal = parseInt(availablePurchase * (perValue / 100));
    setCalPerVal(cal);

    if (calPerVal) {
      setBuyOrder(cal);
    }
  };

  return (
    <div className="buy-wrapper">
      <p>
        <span>매수(구매)</span> 하기
      </p>
      <div className="buy-inputBox">
        <label htmlFor="selfRange">직접 입력</label>
        <div style={{ display: 'flex', width: '80%' }}>
          <input
            id="selfRange"
            type="text"
            placeholder="구매할 주식 수를 입력하세요"
            onChange={(e) => setBuyOrder(e.target.value)}
            style={{
              width: '83%',
              border: '1px solid #d9dadb',
            }}
            value={calPerVal}
          />
          <input
            type="text"
            name=""
            id=""
            placeholder="주"
            readOnly
            style={{
              width: '17%',
              border: 'none',
              textAlign: 'center',
            }}
          />
        </div>

        <label htmlFor="range">범위 지정</label>
        <div style={{ display: 'flex', width: '80%' }}>
          <input
            id="range"
            type="range"
            name=""
            step="10"
            // min="10"
            // max="100"
            list="tickmarks"
            onChange={dataChange}
            onClick={dataChange}
            style={{ width: '83%' }}
          />
          <datalist id="tickmarks">
            <option value="0"></option>
            <option value="10"></option>
            <option value="20"></option>
            <option value="30"></option>
            <option value="40"></option>
            <option value="50"></option>
            <option value="60"></option>
            <option value="70"></option>
            <option value="80"></option>
            <option value="90"></option>
            <option value="100"></option>
          </datalist>
          <input
            type="text"
            name=""
            id=""
            value={`${range}%`}
            placeholder="50%"
            readOnly
            style={{
              width: '17%',
              border: 'none',
              textAlign: 'center',
            }}
          />
        </div>
      </div>
      <div className="btn-wrapper">
        <button className="orderBtn" type="button" onClick={CalculatorOrder}>
          매수
        </button>
        <button className="closeBtn" onClick={close}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default Order;
