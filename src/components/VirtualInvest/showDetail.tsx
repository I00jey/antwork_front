import React, { ReactElement, useEffect, useState } from 'react';
import MyResponsiveLine from './userChart';
import MyResponsivePie from './WinRate';
import RankModal from './RankModal';
import { showRank } from '../../services/apiService';
import { useCookies } from 'react-cookie';

interface props {
  open: boolean;
  close: () => void;
  response: any;
  user: any;
  userid: any;
}

const ShowDetail = ({ response, close, user, userid }: props): ReactElement => {
  const { profit, win, loss, profitArray } = response;
  const rate = ((win / (win + loss)) * 100).toFixed(2);
  const totalGame = win + loss;

  const profitLimit = Number(profit).toFixed(2);

  const [userRank, setUserRank] = useState<
    Array<{ userid: string; profit: number; win: number; profile: string }>
  >([]);
  // console.log('userRank', userRank);

  useEffect(() => {
    const showRanking = async () => {
      try {
        const response = await showRank({});
        if (response) {
          // console.log('show rank response 전송 성공');
          // console.log('respone', response.rank);
          // 여기에서 response를 처리하거나 다른 작업을 수행할 수 있습니다.
          setUserRank(response.rank);
        }
      } catch (error) {
        console.error('API 호출 에러:', error);
      }
    };
    // fetchData 함수를 호출하여 데이터를 가져오도록 설정

    showRanking();
  }, []); // 빈 의존성 배열은 컴포넌트가 마운트될 때 한 번만 실행

  // console.log('rank', userRank);
  const total = userRank.length;
  // console.log(total);
  // console.log('user>', user); // 사용자
  // const rank = userRank.indexOf(user, 0);

  // const selectRank = userRank.filter((userid) => userid === user);
  // console.log(selectRank);
  const myRank =
    userRank.findIndex((userRank) => userRank.userid === userid) + 1;
  // console.log('내 순위', myRank + 1);

  // console.log(userid);
  // console.log(userRank);

  const [openRank, setOpenRank] = useState<string | null>(null);
  const showModal = (user: string) => {
    setOpenRank((prevOpenRank) => (prevOpenRank === user ? null : user));
  };

  return (
    <div className="detail-wrapper">
      <div className="deatail-profile">
        <button className="closeBtn" onClick={close}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="detail-title">
        <p>
          {user} <span>님의 거래 정보</span>
        </p>
      </div>
      <div className="innerContent">
        <div id="detailChart1">
          <MyResponsiveLine data={profitArray} />
        </div>

        {/* 콘텐츠 */}
        <div className="historyBox">
          <div className="profitBox">
            <div className="subTitle">현재 순 이익</div>
            <div>
              <div className={profit > 0 ? 'profitSurplus' : 'profitDeficit'}>
                <span>{profit > 0 ? '+' : ''} </span>
                <span style={{ fontSize: '22px' }}>{profitLimit}</span>
                <span style={{ color: '#333' }}> $</span>
              </div>
            </div>
          </div>
          <div className="profitBox">
            <div className="subTitle"> 승률 </div>
            <div
              style={{
                width: '70%',
                height: '60%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                margin: 'auto',
              }}
            >
              <div style={{ width: '30%', height: '80%' }}>
                <MyResponsivePie data={response} />
              </div>
              <div style={{ fontSize: '18px' }}>
                <p>{rate}%</p>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#808080',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {win} <span>승</span> / {loss} <span>패</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profitBox">
            <div className="subTitle">랭킹 보기</div>
            <div>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                }}
              >
                <span style={{ fontSize: '22px' }}>{myRank}</span>
                <span>등</span>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#808080',
                    width: '100%',
                    textAlign: 'center',
                    marginLeft: '0.5rem',
                  }}
                >
                  / {total}명
                </span>
              </div>
            </div>
            <div
              style={{}}
              className={`rankModalBtn ${openRank === null ? '' : 'active'}`}
              onClick={() => showModal(user)}
            >
              {/* win rate: {rate}% */}
              {/* 전체 이용자 : {total}명 */}
              <span>전체 기록 보기</span>
            </div>
            {openRank === user && <RankModal data={userRank} />}
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default ShowDetail;
