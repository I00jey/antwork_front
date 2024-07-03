import { useState, useEffect } from 'react';
import '../../styles/Community.scss';
import PostRankList from './PostRankList';
import {
  searchPost,
  getComment,
  getReply,
  userInfo,
} from '../../services/apiService';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

function PostRank() {
  const [searchWord, setSearchWord] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchModal, setSearchModal] = useState(false);

  const searchCommunity = async (event: any) => {
    event.preventDefault();

    if (!searchWord) {
      setSearchModal(false); // 검색어가 비어있으면 모달 닫기
      return;
    }

    const searchResult = await searchPost(searchWord);

    if (searchResult.length === 0) {
      setSearchData([]); // 결과가 없으면 데이터 초기화
      setSearchModal(true);
    } else {
      setSearchData(searchResult);
      setSearchModal(true);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (searchModal && !event.target.closest('.searchModal')) {
        setSearchModal(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [searchModal]);

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
      <div className="searchBox">
        <form onSubmit={searchCommunity}>
          <input
            type="text"
            name="postSearch"
            id="postSearch"
            placeholder="검색어를 입력하세요"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </form>
        {searchModal && (
          <div className="searchModal">
            {searchData.length > 0 ? (
              searchData.map((post: any) => {
                const formatTimeDifference = (dateString: any) => {
                  // 분계산
                  const postDate = new Date(dateString);
                  const currentTime = new Date();
                  const timeDifference =
                    currentTime.getTime() - postDate.getTime();
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
                    console.error(
                      `Element with id 'commentsCount_${post._id}' not found.`
                    );
                  }
                };
                renderPost(post);

                let BtnStyle;
                if (post.likedUser.includes(user)) {
                  BtnStyle = true;
                } else {
                  BtnStyle = false;
                }

                return (
                  <div className="post" key={post._id}>
                    <div className="postContents">
                      <Link to={`/community/${post._id}`} state={{ post }}>
                        {/* 유저 정보*/}
                        <div className="userProfile">
                          <span>
                            <img
                              src={post.userId.user_profile}
                              alt="기본 이미지"
                            />
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
                              onClick={() => console.log('')}
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
                            <span
                              className="material-symbols-outlined"
                              style={
                                BtnStyle
                                  ? {
                                      fontSize: '16px',
                                      marginRight: '0.5rem',
                                      color: '#0056f3',
                                    }
                                  : { fontSize: '16px', marginRight: '0.5rem' }
                              }
                            >
                              favorite
                            </span>
                            <span>{post.likedUser.length}</span>
                          </span>

                          <span>
                            <button>
                              <span
                                className="material-symbols-outlined"
                                style={{
                                  fontSize: '16px',
                                  marginRight: '0.5rem',
                                }}
                              >
                                maps_ugc
                              </span>
                              <span id={`commentsCount_${post._id}`}>
                                댓글 수: 로딩 중...
                              </span>
                            </button>
                          </span>
                        </div>
                        <span className="category">{getSubject()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="notFoundPost">
                <p>검색 결과가 없습니다.</p>
                <p style={{ fontSize: '18px', color: '#808080' }}>
                  다른 검색어를 입력해주세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="postListBox">
        <div className="postListTitle">
          <FontAwesomeIcon icon={faFire} style={{ color: '#f00000' }} />
          &ensp;
          <span>실시간 인기글</span>
        </div>
        <div className="postListContent">
          <ul>
            <PostRankList></PostRankList>
          </ul>
        </div>
      </div>
    </>
  );
}

export default PostRank;
