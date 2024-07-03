import '../../styles/Community.scss';
import React, { useState, useEffect } from 'react';
import {
  getCommunityPosts,
  addLike,
  getComment,
  getReply,
  userInfo,
  likeGet,
} from '../../services/apiService';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// 커뮤니티 목록 페이지
function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  // db에서 데이터 불러오기위해 useState
  // console.log('post', posts);

  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const communityPosts = await getCommunityPosts();
        setPosts(communityPosts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [pagination, setPagination] = useState(1);
  const defaultPage = 5;

  // 마지막 페이지 (1*5)
  const lastPage = pagination * defaultPage;
  // console.log('lastPage', lastPage);
  // 첫 페이지 ((1*5)- 5)
  const firstPage = lastPage - defaultPage;
  // console.log('firstPage', firstPage);
  // 현재 페이지 데이터 나누기
  const currentPage = posts.slice(firstPage, lastPage);

  // console.log('currentPage', currentPage);

  // 페이지 번호대로 클릭하면 스테이트 값 업데이트
  const paginate = (pageNumber: any) => {
    setPagination(pageNumber);
  };

  const cookie = useCookies(['jwtCookie']);

  const fetchDataForPost = async (post: any) => {
    const commentArray = await getComment(post._id);

    let replyCommentSum = 0;

    for (const comment of commentArray) {
      const replyComment = await getReply(comment._id);
      replyCommentSum += replyComment.length;
    }

    const commentCount = commentArray.length;
    const totalCommentCount = commentCount + replyCommentSum;

    // 필요한 데이터를 가공하여 반환
    return totalCommentCount;
  };

  const renderPost = async (post: any) => {
    const commentsCount = await fetchDataForPost(post);

    const commentsCountElement = document.getElementById(
      `commentsCount_${post._id}`
    );
    if (commentsCountElement) {
      commentsCountElement.innerText = commentsCount.toString();
    } else {
      console.error(`Element with id 'commentsCount_${post._id}' not found.`);
    }
  };

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
      {/* 콘텐츠 박스*/}
      {currentPage.map((post: any) => {
        // console.log(minutesAgo)

        // console.log(post.likedUser); // 좋아요 누른 사람
        // console.log(post._id); // 게시글 아이디

        // console.log(user);

        renderPost(post);

        let BtnStyle;
        if (post.likedUser.includes(user)) {
          BtnStyle = true;
        } else {
          BtnStyle = false;
        }

        // console.log(BtnStyle);

        // 시간 계산 (~분전)
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

        // 카테고리 분류 value값에 맞춰 데이터 생성
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

        // 좋아요 누르기
        const plusLike = async (postId: string) => {
          try {
            if (cookie[0].jwtCookie) {
              const postIndex = posts.findIndex((post) => post._id === postId);

              if (postIndex !== -1) {
                const updatedPosts = [...posts];
                const like = updatedPosts[postIndex].isActive ? -1 : 1;
                const likeData = { like, postId };

                const response = await addLike(likeData);
                // console.log('response toggle', response);

                // 좋아요 토글
                updatedPosts[postIndex].isActive =
                  !updatedPosts[postIndex].isActive;

                // 좋아요 수 대신 likedUser 배열의 길이로 업데이트
                updatedPosts[postIndex].likedUser = response.likedUser;

                const res = await userInfo({ id: cookie[0].jwtCookie }); //지금 로그인한 아이디 오브젝트

                // post에서 하나씩 글 가져와서 likedUser 배열 안에 res가 있다면 좋아요를 누른 하트를 출력해야함

                posts.map((item) => {
                  if (item.likedUser.includes(res.info._id)) {
                    // console.log('include', item);
                  }
                });

                setPosts([...updatedPosts]); // 새로운 상태 객체로 업데이트
              }
            } else {
              alert('로그인 후 좋아요 가능합니다!');
            }
          } catch (err) {
            console.log(err);
          }
        };

        return (
          <div className="post" key={post._id}>
            <div className="postContents">
              <Link to={`/community/${post._id}`} state={{ post }}>
                {/* 유저 정보*/}
                <div className="userProfile">
                  <span>
                    <img src={post.userId.user_profile} alt="기본 이미지" />
                  </span>
                  <p style={{ marginRight: '5px' }}>
                    {post.userId.user_nickname}
                  </p>
                  <span style={{ fontSize: '10px' }}>•</span>
                  <span>{formatTimeDifference(post.date)}</span>
                </div>
              </Link>

              {/* 게시글 */}

              <div className="contentBox">
                <div className="textContent">
                  <Link to={`/community/${post._id}`} state={{ post }}>
                    <p
                      className="title"
                      onClick={() => console.log('포스트임', post)}
                    >
                      {post.title}
                    </p>
                    <p className="text">{post.content}</p>
                  </Link>
                </div>

                <div className="imgBox">
                  <Link to={`/community/${post._id}`} state={{ post }}>
                    <img src={post.image} alt="" />
                  </Link>
                </div>
              </div>

              {/* 아이콘 리스트 */}
              <div className="statusBox">
                <div>
                  <span>
                    {/* 이 버튼이 눌리면 DB Like에 1씩 증가 */}
                    <button
                      onClick={() => plusLike(post._id)}
                      className={BtnStyle ? 'likeClick' : ''}
                      style={{ border: 'none' }}
                    >
                      <span className="material-symbols-outlined">
                        favorite
                      </span>
                    </button>
                    <span>{post.likedUser.length}</span>
                  </span>

                  <span>
                    <button style={{ border: 'none' }}>
                      <span className="material-symbols-outlined">
                        maps_ugc
                      </span>
                    </button>
                    <span id={`commentsCount_${post._id}`}>
                      댓글 수: 로딩 중...
                    </span>
                  </span>
                </div>
                <span className="category">{getSubject()}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="paginationBox" style={{}}>
        {/* <span className="material-symbols-outlined">chevron_left</span> */}
        {Array.from({ length: Math.ceil(posts.length / defaultPage) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`paginationBtn ${
                pagination === index + 1 ? 'active' : ''
              }`}
            >
              <span>{index + 1}</span>
            </button>
          )
        )}
        {/* <span className="material-symbols-outlined">chevron_right</span> */}
      </div>
    </>
  );
}

export default Community;
