import { useEffect, useState } from 'react';
import './../../styles/StockGuide.scss';
import Virtual from '../../components/VirtualInvest/Virtual';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const StockVirtualPage = () => {
  const [isToggle, setIsToggle] = useState(false);
  const location = useLocation();
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
        <title>개미운동 : 모의투자</title>
      </Helmet>
      <div className="outer-wrapper">
        <div className="guide-title">
          주식 길잡이{' '}
          {isToggle === true && (
            <div className="guide-help-box">
              모의투자 기능을 통해 실제 주식 시장과 유사한 환경에서 안전하게
              투자 전략을 연습하고 경험을 쌓아보세요! 가상의 돈을 활용하여 시장
              흐름에 따른 매수와 매도를 연습할 수 있어요.
              <br />
              (이 모의 투자 시스템은 Bybit API를 활용하여 신뢰성 있는 비트코인
              데이터를 기반으로 구현되었습니다.)
              <br />
              <br />
              조작 방법
              <br />
              1. 매수, 매도 버튼 : 사용자는 주문량을 직접 입력하거나 범위를
              지정하여 매수 또는 매도 주문을 실행할 수 있습니다.
              <br />
              2. 다음턴으로 버튼 : 하루 단위의 턴을 넘기며 가격 차트에 새로운
              캔들을 생성합니다. 이를 통해 사용자는 일일 시장 동향을 확인하고
              투자 전략을 수정할 수 있습니다.
              <br />
              <br />
              <div style={{ marginTop: '10px' }}>
                * 이동평균선 지표: 7, 15, 21, 128일 간의 이동평균선을 차트에
                추가하여 사용자가 장기 및 단기 트렌드를 분석할 수 있도록 합니다.
              </div>
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
            <li>기업 정보</li>
          </Link>
          <Link to="/virtual">
            <li className="selected-blue">모의 투자</li>
          </Link>
        </ul>
        <Virtual />
      </div>
    </>
  );
};

export default StockVirtualPage;
