import '../../styles/Community.scss';
import React, { useState, useEffect } from 'react';
import { getCommunityRank, userInfo } from '../../services/apiService';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function PostRankList() {
  const [posts, setPosts] = useState([]);
  // console.log('랭크', posts);

  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const rank = await getCommunityRank();
        rank.sort((a: any, b: any) => b.likedUser.length - a.likedUser.length);
        const top5Posts = rank.slice(0, 5);
        setPosts(top5Posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [jwtCookie] = useCookies(['jwtCookie']);

  const [user, setuser] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const tokenId = jwtCookie['jwtCookie'];
        const response = await userInfo({ id: tokenId });
        setuser(response.info._id); // user
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  return (
    <>
      {posts.map((post: any) => {
        // console.log('랭크', post.likedUser.length);

        let BtnStyle;
        if (post.likedUser.includes(user)) {
          BtnStyle = true;
        } else {
          BtnStyle = false;
        }

        const formatTimeDifference = (dateString: any) => {
          // 분계산
          const postDate = new Date(dateString);
          const currentTime = new Date();
          const timeDifference = currentTime.getTime() - postDate.getTime();
          const minutesAgo = Math.floor(timeDifference / (1000 * 60));

          // console.log(minutesAgo);
          if (minutesAgo < 1) {
            return '방금 전';
          } else if (minutesAgo < 60) {
            return `${minutesAgo}분 전`;
          } else if (minutesAgo < 1440) {
            const hoursAgo = Math.floor(minutesAgo / 60);
            return `${hoursAgo}시간 전`;
          } else {
            // 한국 시간으로 표시
            const formattedDate = postDate.toLocaleString('ko-KR', {
              // hour: 'numeric',
              // minute: 'numeric',
              // second: 'numeric',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              timeZone: 'Asia/Seoul',
            });

            return formattedDate;
          }
        };
        const getSubject = () => {
          const subject = post.subject;
          let subjectname;
          if (subject === 'free') {
            subjectname = '자유';
          } else if (subject === 'economy') {
            subjectname = '경제';
          } else if (subject === 'coin') {
            subjectname = '코인';
          } else if (subject === 'stock') {
            subjectname = '주식';
          }
          return subjectname;
        };
        return (
          <li key={post._id}>
            <Link to={`/community/${post._id}`} state={{ post }}>
              <div style={{ width: '80%' }}>
                <div
                  className="category"
                  style={{
                    backgroundColor: '#f0f3fa',
                    width: 'fit-content',
                    padding: '2px',
                  }}
                >
                  <span
                    style={{
                      color: '#0056f3',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                  >
                    {getSubject()}
                  </span>
                </div>
                <div className="listTitle">
                  {post.title}
                  <span style={{ color: 'lightgray', fontSize: '12px' }}>
                    ({formatTimeDifference(post.date)})
                  </span>
                </div>
              </div>
              <div className="listComment">
                <span
                  className={
                    BtnStyle
                      ? 'material-symbols-outlined likeClick'
                      : 'material-symbols-outlined'
                  }
                >
                  favorite
                </span>
                <span>{post.likedUser.length}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </>
  );
}

export default PostRankList;
