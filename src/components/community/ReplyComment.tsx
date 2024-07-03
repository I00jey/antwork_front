import React, { useState, useEffect } from 'react';
import { getReply, deleteReComment } from '../../services/apiService';
import { useCookies } from 'react-cookie';
import ReplyWrite from './ReplyWrite';

function ReplyComment({ data, id, userNick, nick }: any) {
  // console.log('data', data); // 게시글 id
  const [replyData, setReplyData] = useState([]);
  console.log('댓글 닉', nick);
  console.log(userNick);
  console.log(id);
  // 대댓글 가져오기
  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const commentId = await getReply(data);
        setReplyData(commentId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [data]);

  // console.log(data);

  // 댓글창 추가
  const [openReply, setOpenReply] = useState<any>();

  // const [openModal, setOpenModal] = useState<Boolean>(false);
  const cookie = useCookies(['jwtCookie']);

  const showModal = (commentId: string) => {
    if (cookie[0].jwtCookie) {
      setOpenReply(commentId);
      console.log(commentId);
    } else {
      alert('로그인 후 댓글 작성 가능합니다.');
    }
  };

  return (
    <>
      <div className="countComment"></div>
      {/* 댓글표시 */}
      {replyData.map((post: any) => {
        console.log(post.userId.user_nickname);

        const deleteContent = async () => {
          try {
            if (window.confirm('삭제 후 복구가 불가능 합니다.')) {
              alert('삭제되었습니다.');
              const result = await deleteReComment(post._id);
              console.log('대댓글 삭제 성공', result);
              window.location.href = `/community/${id}`;
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
          <div
            className="commentInnerBox"
            key={post._id}
            style={{
              width: '100%',
              backgroundColor: '#f0f3fa',
              position: 'relative',
              borderTop: '1px solid #d9dadb',
            }}
          >
            {/* 유저 정보*/}
            <span className="material-symbols-outlined undo">
              prompt_suggestion
            </span>
            <div style={{ marginLeft: '3vh' }}>
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
                <p className="text">
                  <span className="replyNick">@{nick}</span>
                  {post.content}
                </p>
              </div>
              <div className="statusBox">
                <div id="deleteBox1">
                  <button
                    onClick={deleteContent}
                    style={{
                      visibility:
                        userNick === post.userId.user_nickname
                          ? 'visible'
                          : 'hidden',
                    }}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ReplyComment;
