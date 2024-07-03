import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { adminGetPost, deleteCommunity } from '../../services/apiService';
import '../../styles/Admin.scss';
import { Helmet } from 'react-helmet';

const CommunityManage = () => {
  const [posts, setPosts] = useState([]);
  // db에서 데이터 불러오기위해 useState
  // console.log('post', posts);

  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const postData = await adminGetPost();
        setPosts(postData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [pagination, setPagination] = useState(1);
  const defaultPage = 10;

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

  return (
    <>
      <Helmet>
        <title>개미운동 : 관리자페이지</title>
      </Helmet>
      <div className="outer-wrapper">
        <div className="page-title">관리자 페이지</div>
        <ul>
          <Link to="/admin/">
            <li>회원 관리</li>
          </Link>
          <Link to="/admin/communityManage">
            <li className="selected-blue">신고글 관리</li>
          </Link>
          <Link to="/admin/deleteManage">
            <li>게시글 관리</li>
          </Link>
        </ul>
        <div>
          <div className="heading">
            <div className="cell">
              <p>번호</p>
            </div>
            <div className="cell">
              <p>제목</p>
            </div>
            <div className="cell">
              <p>내용</p>
            </div>
            <div className="cell">
              <p>작성자</p>
            </div>
            <div className="cell">
              <p>작성시간</p>
            </div>
            <div className="cell">
              <p>좋아요</p>
            </div>
            <div className="cell">
              <p>신고수</p>
            </div>
            <div className="cell">
              <p></p>
            </div>
          </div>
          <div>
            {currentPage.map((post: any, index: number) => {
              // console.log(post);
              const link = `/community/${post._id}`;

              const utcDateString = post.date;
              const utcDate = new Date(utcDateString);

              const koreanTimeString1 = utcDate.toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
              });

              const deleteContent = async () => {
                try {
                  if (window.confirm('삭제 후 복구가 불가능 합니다.')) {
                    alert('삭제되었습니다.');
                    const result = await deleteCommunity(post._id);
                    // console.log('글 삭제 성공', result);
                    window.location.href = '/admin/communityManage';
                  } else {
                    alert('취소되었습니다.');
                  }
                } catch (error) {
                  console.log(error);
                }
              };

              return (
                <div className="adminUserBox">
                  <Link to={link} state={{ post }}>
                    <div className="cell">
                      <p>{index + 1}</p>
                    </div>
                    <div className="cell postText">
                      <p>{post.title}</p>
                    </div>
                    <div className="cell postText">
                      <p> {post.content}</p>
                    </div>
                    <div className="cell">
                      <p> {post.userId.user_nickname}</p>
                    </div>
                    <div className="cell postText">
                      <p>{koreanTimeString1}</p>
                    </div>
                    <div className="cell">
                      <p> {post.likedUser.length}</p>
                    </div>
                    <div className="cell reported">
                      <p>{post.reportedUser.length} </p>
                    </div>
                    <div className="cell">
                      <button onClick={deleteContent}>
                        <span>삭제하기</span>
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })}

            <div className="paginationBox" style={{}}>
              {/* <span className="material-symbols-outlined">chevron_left</span> */}
              {Array.from({
                length: Math.ceil(posts.length / defaultPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`paginationBtn ${
                    pagination === index + 1 ? 'active' : ''
                  }`}
                >
                  <span>{index + 1}</span>
                </button>
              ))}
              {/* <span className="material-symbols-outlined">chevron_right</span> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityManage;
