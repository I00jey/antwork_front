import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { adminGetUser, deleteKakao, deleteUser } from '../services/apiService';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import '../styles/Admin.scss';
import { Helmet } from 'react-helmet';

interface User {
  _id: string;
  user_id: string;
  user_nickname: string;
  user_email: string;
  isKakao: any;
  user_profile: string;
  news_bookmark: any;
  word_bookmark: any;

  // Add other properties based on your user schema
}

const AdminPage = ({ data }: any) => {
  const [jwtCookie, setjwtCookie, removejwtCookie] = useCookies(['jwtCookie']);
  const [kakaoToken, setkakaoToken, removekakaoToken] = useCookies([
    'kakaoToken',
  ]);
  const [isKakao, setisKakao, removeisKakao] = useCookies(['isKakao']);

  const [posts, setPosts] = useState<User[]>([]);
  // db에서 데이터 불러오기위해 useState
  // console.log('post', posts);

  // useEffect(() => {
  //   const reload = async () => {
  //     try {
  //       if (data) {
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   reload();
  // }, []);

  useEffect(() => {
    // 서버에서 데이터를 불러와서 posts 상태 업데이트
    const fetchData = async () => {
      try {
        const userData = await adminGetUser();
        setPosts(userData);
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
            <li className="selected-blue">회원 관리</li>
          </Link>
          <Link to="/admin/communityManage">
            <li>신고글 관리</li>
          </Link>
          <Link to="/admin/deleteManage">
            <li>삭제 관리</li>
          </Link>
        </ul>
        <div className="getAllUser">
          <div className="heading">
            <div className="cell">
              <p>가입 정보</p>
            </div>
            <div className="cell">
              <p>프로필 이미지</p>
            </div>
            <div className="cell">
              <p>아이디</p>
            </div>
            <div className="cell">
              <p>닉네임</p>
            </div>
            <div className="cell">
              <p>이메일</p>
            </div>
            <div className="cell">
              <p>뉴스 북마크</p>
            </div>
            <div className="cell">
              <p>단어장 북마크</p>
            </div>
            <div className="cell">
              <p></p>
            </div>
          </div>
          <div>
            {currentPage.map((user) => {
              // console.log(user);

              const deleteUserInfo = async (event: any) => {
                try {
                  event.preventDefault();

                  if (window.confirm('탈퇴하시겠습니까?')) {
                    if (kakaoToken['kakaoToken']) {
                      await deleteKakao(kakaoToken['kakaoToken']);
                      removekakaoToken('kakaoToken');
                    }
                    const response = await deleteUser(user.user_id);
                    if (response.success) {
                      alert('회원정보 삭제 성공');
                      removeisKakao('isKakao');
                      // console.log('회원정보 삭제 성공');
                      window.location.href = '/admin';
                    } else {
                      console.error('회원정보 삭제 실패');
                    }
                  } else {
                    return;
                  }
                } catch (error) {
                  console.error('회원정보 삭제 실패:', error);
                }
              };

              return (
                <div className="adminUserBox" key={user._id}>
                  <div className="cell postText adminUser">
                    <p>{user.isKakao === 0 ? '일반 유저' : '카카오 로그인'}</p>
                  </div>
                  <div className="cell postText adminUser">
                    <p>
                      <img src={user.user_profile} alt="" />
                    </p>
                  </div>
                  <div className="cell postText adminUser">
                    <p> {user.user_id}</p>
                  </div>
                  <div className="cell postText adminUser">
                    <p> {user.user_nickname}</p>
                  </div>
                  <div className="cell postText adminUser">
                    <p>{user.user_email}</p>
                  </div>
                  <div className="cell postText adminUser">
                    <p>{user.news_bookmark.length}</p>
                  </div>
                  <div className="cell postText adminUser">
                    <p>{user.word_bookmark.length}</p>
                  </div>
                  <div className="cell">
                    {user.isKakao === 0 ? (
                      <button onClick={deleteUserInfo}>
                        <span>삭제하기</span>
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
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
export default AdminPage;
