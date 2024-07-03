import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

const RankModal = ({ data }) => {
  //   console.log(data);
  const [rank, setRank] = useState([]);

  // console.log('rank', rank);

  useEffect(() => {
    try {
      setRank(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // console.log(data);

  const myRank = rank.findIndex((rank) => rank.userid === data.user) + 1;
  // console.log(myRank);

  return (
    <div className="userRankBox">
      <h3 style={{ margin: '0.3rem auto', color: '#0056f3' }}>Top 3 랭킹</h3>
      <div className="RankingBox0">
        {rank.slice(0, 3).map((data, index) => {
          const myRank =
            rank.findIndex((rank) => rank.userid === data.userid) + 1;
          // console.log(myRank);

          const iconClass = `crown num${myRank}`;
          const RankClass = `ranking number${myRank}`;
          const userImg = `userImg${myRank}`;
          const userRank = `nickName${myRank}`;
          const profit = data.profit.toFixed(2);

          return (
            <div className="RankingBox1" key={data.userid}>
              <div className="RankingBox2">
                <FontAwesomeIcon
                  icon={faCrown}
                  className={iconClass}
                  size="2x"
                />
                <div className={RankClass}>No. {myRank}</div>

                <div className={userImg}>
                  <img src={data.profile} alt="" />
                </div>

                <div className="userInfo">
                  <p className={userRank}>{data.userid}</p>
                  <span style={{ fontSize: '14px' }}>누적 수익 {profit} $</span>
                  <span style={{ fontSize: '12px', color: '#808080' }}>
                    {data.win}승{' '}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RankModal;
