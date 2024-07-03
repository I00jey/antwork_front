import '../../styles/Admin.scss';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  getDeletePost,
  recoverPost,
  readDelete,
} from '../../services/apiService';
import { Helmet } from 'react-helmet';

const DeleteManage = () => {
  const [posts, setPosts] = useState([]);

  // 삭제 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getDeletePost();
        setPosts(postData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // console.log(posts);

  // const realDelete = async () => {
  //   try {

  //       const result = await

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
            <li>신고글 관리</li>
          </Link>
          <Link to="/admin/deleteManage">
            <li className="selected-blue">게시글 관리</li>
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
              <p>복원</p>
            </div>
            <div className="cell">
              <p>영구 삭제</p>
            </div>
          </div>
          <div>
            {posts.map((post: any) => {
              console.log(post._id);
              const recoverContent = async () => {
                try {
                  const result = await recoverPost(post._id);
                } catch (error) {
                  console.log(error);
                }
              };

              const realDelete = async () => {
                try {
                  const result = await readDelete(post._id);
                } catch (error) {
                  console.log(error);
                }
              };

              return (
                <div className="adminUserBox">
                  <div className="cell">
                    <p>1</p>
                  </div>
                  <div className="cell postText">
                    <p>{post.title}</p>
                  </div>
                  <div className="cell postText">
                    <p> {post.content}</p>
                  </div>
                  <div className="cell">
                    <button onClick={recoverContent}>
                      <span>복원하기</span>
                    </button>
                  </div>
                  <div className="cell">
                    <button onClick={realDelete}>
                      <span>영구 삭제 하기</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteManage;
