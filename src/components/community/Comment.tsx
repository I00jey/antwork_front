import React, { useState, useEffect } from 'react';
import {
  getComment,
  getReply,
  deleteComment,
  userInfo,
} from '../../services/apiService';
import ReplyWrite from './ReplyWrite';
import { useCookies } from 'react-cookie';
import ReplyComment from './ReplyComment';

function Comment({ data }: { data: any }) {
  const postId = data._id; // 게시글 아이디

  const [commentData, setCommentData] = useState([]);

  // 댓글 가져오기
  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const comment = await getComment(postId);
        setCommentData(comment);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [postId]);

  console.log(commentData);

  // console.log(commentData.length);
  // console.log(commentData);

  // 댓글창 추가

  const [commentId, setCommentId] = useState<any>();

  const cookie = useCookies(['jwtCookie']);

  const [openReply, setOpenReply] = useState<string | null>(null);
  const showModal = (commentId: string) => {
    if (cookie[0].jwtCookie) {
      setCommentId((prevCommentId: any) => prevCommentId || commentId);
      setOpenReply((prevOpenReply) =>
        prevOpenReply === commentId ? null : commentId
      );
    } else {
      alert('로그인 후 댓글 작성 가능합니다.');
    }
  };

  const fetchDataForPost = async (post: any) => {
    const commentArray = await getComment(postId);

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
      `commentsCount_${postId}`
    );
    if (commentsCountElement) {
      commentsCountElement.innerText = commentsCount.toString();
    } else {
      console.error(`Element with id 'commentsCount_${postId}' not found.`);
    }
  };

  renderPost(postId);

  const [jwtCookie] = useCookies(['jwtCookie']);

  const [userNick, setUserNick] = useState('');

  useEffect(() => {
    const setButton = async () => {
      try {
        const tokenId = jwtCookie['jwtCookie'];
        const response = await userInfo({ id: tokenId });
        setUserNick(response.info.user_nickname);
      } catch (error) {
        console.log('사용자 정보 가져오기 에러', error);
      }
    };
    setButton();
  }, []);

  console.log(userNick);

  return (
    <>
      <div className="countComment">
        <span>댓글 </span>
        <span id={`commentsCount_${postId}`}> 로딩 중...</span>
      </div>
      {/* 댓글표시 */}
      {commentData.map((post: any) => {
        const deleteContent = async () => {
          try {
            if (window.confirm('삭제 후 복구가 불가능 합니다.')) {
              alert('삭제되었습니다.');
              const result = await deleteComment(post._id);
              console.log('글 삭제 성공', result);
              window.location.href = `/community/${postId}`;
            } else {
              alert('취소되었습니다.');
            }
          } catch (error) {
            console.log(error);
          }
        };

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

        return (
          <div className="commentInnerBox" key={post._id}>
            {/* 유저 정보*/}
            <div className="userProfile">
              <div className="profile">
                <span>
                  <img src={post.userId.user_profile} alt="" />
                </span>
                <p style={{ marginRight: '5px' }}>
                  {post.userId.user_nickname}
                </p>
                <span style={{ fontSize: '10px' }}>•</span>
                <span>{formatTimeDifference(post.date)}</span>
              </div>
            </div>
            {/* 댓글 내용 */}
            <div className="commentText">
              <p className="text">{post.content}</p>
            </div>
            <div className="statusBox">
              <div className="editBox">
                <button
                  style={{
                    visibility:
                      userNick === post.userId.user_nickname
                        ? 'visible'
                        : 'hidden',
                  }}
                  onClick={deleteContent}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>

                <button onClick={() => showModal(post._id)}>
                  <span>댓글 달기</span>
                </button>
              </div>
            </div>
            {openReply === post._id && <ReplyWrite data={commentId} />}
            <ReplyComment
              nick={post.userId.user_nickname}
              data={post._id}
              openReply={openReply}
              id={postId}
              userNick={userNick}
            />
            {/* {commentId && <ReplyWrite data={commentId} />} */}
          </div>
        );
      })}
    </>
  );
}

export default Comment;
