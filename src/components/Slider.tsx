import React from 'react';
import { Link } from 'react-router-dom';
import { getComment, getReply } from '../services/apiService';

const Slider = ({ boardData, boardlist }: any) => {
  // console.log('boardData', boardData);
  // console.log('boardlist', boardlist);

  return (
    <>
      {boardlist === undefined && (
        <div className="main-board" key={boardData[0].image}>
          <img className="main-board-image" src={boardData[0].image} />
          <div className="main-board-title">{boardData[0].title}</div>
          <div className="main-board-content">{boardData[0].content}</div>
          <div className="main-board-info">
            <div className="main-board-info-flex">
              <div className="main-board-writer">
                <div className="main-board-nickname">{boardData[0].writer}</div>
                <div className="main-board-date">{boardData[0].date}</div>
              </div>
              <div className="main-board-comment">
                <span className="material-symbols-rounded">comment</span>
                <div className="main-icon">{boardData[0].like}</div>
              </div>
              <div className="main-board-like">
                <span className="material-symbols-rounded">favorite</span>
                <div className="main-icon">{boardData[0].like}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {boardlist === undefined ||
        boardData.map((board: any, idx: number) => {
          const postId = boardData[idx].id;
          // console.log(postId);
          const link = `/community/${postId}`;

          // const fetchDataForPost = async (post: any) => {
          //   try {
          //     const commentArray = await getComment(postId);

          //     console.log(commentArray);
          //     let replyCommentSum = 0;

          //     for (const comment of commentArray) {
          //       console.log(comment);
          //       console.log(comment._id);
          //       const replyComment = await getReply(comment._id);
          //       replyCommentSum += replyComment.length;
          //     }

          //     const commentCount = commentArray.length;
          //     const totalCommentCount = commentCount + replyCommentSum;
          //     // 필요한 데이터를 가공하여 반환
          //     return totalCommentCount;
          //   } catch (err) {
          //     console.log(err);
          //   }
          // };

          // const renderPost = async (post: any) => {
          //   console.log(post);
          //   const commentsCount = await fetchDataForPost(post);

          //   const commentsCountElement = document.getElementById(
          //     `commentsCount_${postId}`
          //   );
          //   if (commentsCountElement) {
          //     commentsCountElement.innerText = String(commentsCount);
          //     console.log(commentsCount);
          //     console.log('ㅁㅁㅁㅁㅁ', typeof commentsCount);
          //   } else {
          //     console.error(
          //       `Element with id 'commentsCount_${postId}' not found.`
          //     );
          //   }
          // };
          // renderPost(postId);

          return (
            <Link to={link} state={{ post: boardlist[idx] }} key={board.id}>
              <div className="main-board" key={idx}>
                <img className="main-board-image" src={board.image} />
                <div className="main-board-title">{board.title}</div>
                <div className="main-board-content">{board.content}</div>
                <div className="main-board-info">
                  <div className="main-board-info-flex">
                    <div className="main-board-writer">
                      <div className="main-board-nickname">{board.writer}</div>
                      <div className="main-board-date">{board.date}</div>
                    </div>
                    {/* <div className="main-board-comment">
                      <span className="material-symbols-rounded">comment</span>
                      <div className="main-icon">
                        {' '}
                        <span id={`commentsCount_${postId}`}> 로딩 중...</span>
                      </div>
                    </div> */}
                    <div className="main-board-like">
                      <span className="material-symbols-rounded">favorite</span>
                      <div className="main-icon">{board.like}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default Slider;
