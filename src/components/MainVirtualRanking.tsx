import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface userData {
  userid: string;
  profile: string;
  profit: Number;
  win: any;
}

interface props {
  data: userData[];
}

const MainVirtualRanking = ({ data }: props) => {
  const [rank, setRank] = useState<userData[]>([]);

  //   console.log('rank', rank);

  useEffect(() => {
    try {
      setRank(data);
    } catch (err) {
      console.log(err);
    }
  }, [data]);

  return (
    <div className="mainRankingBox">
      <div className="innerBox">
        <h3>모의투자 Top 3 투자자</h3>
        {rank.slice(0, 3).map((data, index) => {
          // console.log(data);
          const myRank =
            rank.findIndex((rank) => rank.userid === data.userid) + 1;
          // console.log(myRank);

          const iconClass = `crown num${myRank}`;
          const RankClass = `ranking number${myRank}`;
          const userImg = `userImg${myRank}`;
          const userRank = `nickName${myRank}`;
          const profit = data.profit.toFixed(2);

          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '95%',
                height: '30%',
                alignItems: 'center',
                position: 'relative',
                marginTop: '0.5rem',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 5px',
              }}
              key={data.userid}
            >
              <div
                style={{
                  width: '90%',
                  height: '100%',
                  position: 'relative',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <FontAwesomeIcon
                  icon={faCrown}
                  className={iconClass}
                  size="2x"
                  style={{ left: '-5%', top: '6%' }}
                />
                <div className={RankClass}>No. {myRank}</div>

                <div className={userImg}>
                  <img src={data.profile} alt="" />
                </div>

                <div className="userInfo">
                  <p className={userRank}>{data.userid}</p>
                  <span style={{ fontSize: '2vh' }}>누적 수익 {profit} $</span>
                  <span style={{ fontSize: '1.7vh', color: '#808080' }}>
                    {data.win}승
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <Link to="/virtual">
          <button>모의 투자 바로가기</button>
        </Link>
      </div>
    </div>
  );
};

export default MainVirtualRanking;
