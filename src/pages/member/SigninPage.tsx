import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { login } from '../../services/apiService';
import { kakaoLogin } from '../../services/apiService';
import { Helmet } from 'react-helmet';

const SigninPage = () => {
  const navigate = useNavigate();
  //   const cookies = new Cookies();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = React.useState({
    user_id: 'test',
    user_password: 'testtest',
    isChecked: true,
  });

  const [cookies, setCookie, removeCookie] = useCookies(['saveId', 'jwtCookie']);
  useEffect(() => {
    // console.log(cookies);
    const savedId = cookies['saveId']; // 대괄호를 사용하여 속성에 액세스합니다.
    if (savedId) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: savedId,
        isChecked: true,
      }));
    }
    // console.log('Saved ID:', savedId);
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      // login 함수에 유저 데이터를 전달
      const response = await login(formData);
      if (!formData.isChecked) {
        removeCookie('saveId');
      }
      if (response.success) {
        console.log('로그인 성공:', response);
        alert('로그인 성공!');
        window.location.href = '/'
      } else {
        console.error('로그인 실패:', response);
        alert(response.message);
        navigate('/signin');
        // 실패 메시지 출력 또는 필요한 처리
      }
    } catch (error: any) {
      // 에러 처리
      console.error('로그인 실패:', error.message);
      alert('로그인 실패!');
      navigate('/signin');
    }
  };

  const link = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;

  return (
    <>
      <Helmet>
        <title>개미운동 : 로그인</title>
      </Helmet>
      <div className="form-box">
        <div className="page-title">소셜 로그인</div>
        <div className="kakao-login-btn">
          <a href={link}>
            <img src={'kakao_login_btn.png'} alt="kakao login" />
          </a>
        </div>
        <div className="hr-div"></div>
        <div className="page-title">로그인</div>
        <form name="login-form" method="post">
          <input
            name="user_id"
            placeholder="아이디"
            className="input-box"
            onChange={handleInputChange}
            value={formData.user_id}
          />
          <br />
          <input
            name="user_password"
            type="password"
            placeholder="비밀번호"
            className="input-box"
            value={formData.user_password}
            onChange={handleInputChange}
          />
          <br />
          <div className="account-options">
            <div className="remember-id">
              <input
                type="checkbox"
                name="isChecked"
                checked={formData.isChecked}
                onChange={handleInputChange}
              />
              아이디 기억하기
            </div>
            <div className="find-info">
              <Link to="/findId">아이디 | 비밀번호 찾기</Link>
            </div>
          </div>
          <button className="signinBtn" onClick={handleLogin}>
            로그인
          </button>
          <div className="account-options">
            아직 계정이 없으신가요?&nbsp;&nbsp;{' '}
            <span
              className="link-btn"
              onClick={() => {
                navigate('/signup');
              }}
            >
              회원가입하기
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default SigninPage;
