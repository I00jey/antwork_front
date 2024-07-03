import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { sell } from '../../services/apiService';

const SellBtn = ({ currentVal, prevInvest, updatePrevInvest, close }) => {
  const [sellOrder, setSellOrder] = useState(0);
  const profit = useSelector((state) => state.profit);
  const stock = useSelector((state) => state.stock);
  const account = useSelector((state) => state.account);
  const purchasePrice = useSelector((state) => state.purchasePrice);
  const dispatch = useDispatch();

  const cookie = useCookies(['jwtCookie']);
  const navigate = useNavigate(); //페이지 이동
  const notLogin = () => {
    navigate('/signin');
  };

  const SellBtnClick = async () => {
    //jwtCookie 체크 햇어용
    if (cookie[0].jwtCookie) {
      if (stock >= sellOrder) {
        const cal = currentVal * sellOrder; //주문 총 금액

        dispatch({ type: 'SET_STOCK', payload: stock - sellOrder });
        dispatch({
          type: 'SET_ACCOUNT',
          payload: account + cal,
        });
        dispatch({ type: 'SET_PROFIT', payload: cal - prevInvest });

        // 평단 재갱신
        if (stock > 0) {
          const remainStock = stock - sellOrder;
          updatePrevInvest(prevInvest - sellOrder * currentVal);

          if (remainStock > 0) {
            const remainCal = remainStock * purchasePrice;
            dispatch({
              type: 'SET_PURCHASE_PRICE',
              payload: remainCal / remainStock,
            });
          } else {
            dispatch({
              type: 'SET_PURCHASE_PRICE',
              payload: 0,
            });

            updatePrevInvest(0);
          }

          try {
            // profit에 직접 값 대입, 쿠키 정보 백엔드로 전송
            console.log('버튼 누름');
            const response = await sell({
              profit: cal - purchasePrice * sellOrder,
            });
            if (response.success) {
              console.log('아주 잘 전송');
              console.log('profit > ', profit);
              alert(
                `${sellOrder}주 매도가 완료되었습니다. 현재 ${remainStock}주 보유중입니다.`
              );
            }
            close();
          } catch (error) {
            console.error('error send', error);
          } finally {
            // 에러 발생 여부와 관계없이 항상 실행되는 부분
            setSellOrder(0);
          }
        }
      } else {
        alert('매도하려는 주식이 부족합니다. 주식 보유 수를 확인하세요');
      }
    } else {
      alert('로그인이 필요함');
      notLogin();
    }
  };

  // 퍼센트 범위 표시
  const [range, setRange] = useState(50);
  const [calPerVal, setCalPerVal] = useState();

  const dataChange = (e) => {
    const perValue = e.target.value;
    setRange(perValue);

    // 퍼센트 조작에 대한 변경
    const cal = parseInt(stock * (perValue / 100));
    setCalPerVal(cal);

    if (calPerVal) {
      setSellOrder(cal);
    }
  };

  return (
    <div className="sell-wrapper">
      <p>
        <span>매도(판매)</span> 하기
      </p>
      <div className="sell-inputBox">
        <label htmlFor="selfRange">직접 입력</label>
        <div style={{ display: 'flex', width: '80%' }}>
          <input
            id="selfRange"
            type="text"
            placeholder="판매할 주식 수를 입력하세요"
            onChange={(e) => setSellOrder(e.target.value)}
            value={sellOrder}
            style={{ width: '83%', border: '1px solid #d9dadb' }}
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
        <button className="sellBtn" onClick={SellBtnClick}>
          매도
        </button>
        <button className="closeBtn" onClick={close}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SellBtn;
