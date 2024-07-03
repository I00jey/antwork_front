import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { postComment, userInfo } from '../../services/apiService';

function CommentWrite({ data }: { data: any }) {
  // 게시글 정보 불러오기
  // console.log('data', data);
  const postId = data._id;
  // console.log(postId); // 게시글 id
  // 게시글 id
  // console.log(data);

  // 댓글 작성 및 서버 전달
  const [commentData, setCommentData] = useState('');
  const commentChange = (e: any) => {
    const value = e.target.value;
    setCommentData(value);
  };
  const cookie = useCookies(['jwtCookie']);
  const uploadComment = async () => {
    try {
      if (!cookie[0].jwtCookie) {
        alert('로그인 후 댓글 작성이 가능합니다!');
        return;
      }
      const commentPostData = {
        postId: postId,
        content: commentData,
      };
      const response = await postComment(commentPostData);
      // console.log(response);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const [userProfile, setuserProfile] = useState('');
  const [userNickname, setuserNickname] = useState('');
  const [jwtCookie, setjwtCookie, removejwtCookie] = useCookies(['jwtCookie']);
  // const tokenId =

  // 현재 로그인한 사용자 정보 (닉네임 불러오기)
  useEffect(() => {
    const tokenId = jwtCookie['jwtCookie'];
    // console.log('tokenId', tokenId);
    const getUserInfo = async () => {
      try {
        const response = await userInfo({ id: tokenId });

        // console.log('response', response.info);
        setuserNickname(response.info.user_nickname);
        setuserProfile(response.info.user_profile);
      } catch (error) {
        console.log('사용자 정보 가져오기 에러', error);
      }
    };
    getUserInfo();
  }, []);

  const enter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      uploadComment();
    }
  };

  // console.log(loginUserData);

  return (
    <div className="commentWriteBox">
      <div className="commentWriteInnerBox">
        <div className="userProfile">
          <span>
            <a href="/">
              <img src={userProfile} alt="" />

              <p style={{ fontWeight: '700' }}>
                {userNickname}
                <span>님의 댓글</span>
              </p>
            </a>
          </span>
          <button onClick={uploadComment}>
            <span>입력하기</span>
          </button>
        </div>

        <textarea
          name=""
          id=""
          placeholder="상대방 비방 및 욕설과 같은 댓글은 검토 후 삭제 될 수 있습니다."
          cols={20}
          rows={7}
          onChange={commentChange}
          onKeyDown={enter}
        ></textarea>
      </div>
    </div>
  );
}

export default CommentWrite;
