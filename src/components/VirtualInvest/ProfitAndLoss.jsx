import React, { useEffect } from 'react';
import { calProfitAndLoss } from '../../services/apiService';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const ProfitAndLoss = () => {
  const initializeAccount = 3000000;
  const currentAccount = useSelector((state) => state.account);
  const cookie = useCookies(['jwtCookie']);
  const navigate = useNavigate(); //페이지 이동
  const notLogin = () => {
    navigate('/signin');
  };

  // const profit = currentAccount - initializeAccount;
  // console.log(profit);

  const handleResetClick = async () => {
    if (cookie[0].jwtCookie) {
      try {
        const profit = currentAccount - initializeAccount;
        // Axios를 사용하여 서버에 요청 보내기
        const resetResponse = await calProfitAndLoss({ profit });

        console.log(resetResponse);
        if (resetResponse) {
          window.location.reload(); //새로고침이 안댐
        }
      } catch (error) {
        console.error('초기화 오류:', error);
      }
    } else {
      alert('로그인이 필요함');
      notLogin();
    }
  };

  return (
    <>
      <button onClick={handleResetClick} className="resetBtn">
        <span className="material-symbols-outlined">저장하기data_saver_on</span>
      </button>
    </>
  );
};

export default ProfitAndLoss;
