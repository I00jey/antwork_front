import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  deleteKakao,
  deleteUser,
  kakaoLogin,
  kakaoLogout,
  userInfo,
} from '../services/apiService';
import { UserData } from './../types/types';

const Header = () => {
  const [jwtCookie, setjwtCookie, removejwtCookie] = useCookies(['jwtCookie']);
  const [kakaoToken, setkakaoToken, removekakaoToken] = useCookies([
    'kakaoToken',
  ]);
  const [isKakao, setisKakao, removeisKakao] = useCookies(['isKakao']);
  const [isLogin, setIsLogin] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [menuToggle, setMenuToggle] = useState(false);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  const [userInfos, setUserInfos] = useState<UserData>({
    user_id: '',
    user_password: '',
    user_pwCheck: '',
    user_email: '',
    isAdmin: 0,
    user_nickname: '',
    user_profile: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('useEffect 실행');

    const getUserInfo = async () => {
      try {
        const params = new URL(document.location.toString()).searchParams;
        const code = params.get('code');

        if (code) {
          // console.log('카카오 로그인 요청');
          await kakaoLogin(code);
          navigate('/');
        }

        const tokenId = jwtCookie['jwtCookie'];
        // console.log('tokenId', tokenId);

        if (tokenId) {
          setIsLogin(true);
          const response = await userInfo({ id: tokenId });
          console.log('사용자 정보', response.info);
          setUserInfos((prevState) => ({
            ...prevState,
            user_id: response.info.user_id,
            user_nickname: response.info.user_nickname,
            user_profile:
              response.info.user_profile ||
              process.env.PUBLIC_URL + 'mypage.png',
          }));
          setIsAdmin(response.info.isAdmin === 1);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.log('카카오 로그인 또는 사용자 정보 가져오기 에러', error);
      }
    };
    getUserInfo();
  }, [jwtCookie['jwtCookie']]);

  const mypageToggle = () => {
    setIsToggle((prevIsToggle) => !prevIsToggle);
    if (isToggle) {
      setIsToggle(false);
    } else {
      setIsToggle(true);
    }
  };

  const menuTabToggle = () => {
    setMenuToggle((prevIsToggle) => !prevIsToggle);
    if (menuToggle) {
      setMenuToggle(false);
    } else {
      setMenuToggle(true);
    }
  };

  useEffect(() => {
    setMenuToggle(false);
    setIsToggle(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setUserInfos({
      user_id: '',
      user_password: '',
      user_pwCheck: '',
      user_email: '',
      isAdmin: 0,
      user_nickname: '',
      user_profile: '',
    });
    // console.log(kakaoToken['kakaoToken']);
    if (kakaoToken['kakaoToken']) {
      const uri = process.env.REACT_APP_API_HOST + '/v1/user/logout';
      const param = null;
      const header = {
        Authorization: 'Bearer ' + kakaoToken['kakaoToken'],
      };
      kakaoLogout(uri, param, header);
      removekakaoToken('kakaoToken');
    }
    removejwtCookie('jwtCookie');
    removeisKakao('isKakao');

    alert('로그아웃 되었습니다.');
    setIsToggle(false);
    redirectMain();
  };

  const redirectMain = () => {
    window.location.href = '/';
  };

  const deleteUserInfo = async (event: any) => {
    try {
      event.preventDefault();

      if (window.confirm('탈퇴하시겠습니까?')) {
        if (kakaoToken['kakaoToken']) {
          await deleteKakao(kakaoToken['kakaoToken']);
          removekakaoToken('kakaoToken');
        }
        const response = await deleteUser(userInfos.user_id);
        if (response.success) {
          alert('회원정보 삭제 성공');
          removejwtCookie('jwtCookie');
          removeisKakao('isKakao');
          // console.log('회원정보 삭제 성공');
          window.location.href = '/';
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

  // useEffect(() => {
  //   const localAdmin = localStorage.getItem('isAdmin');
  //   if (localAdmin !== null) {
  //     const storedAdmin = JSON.parse(localAdmin);
  //     setIsAdmin(storedAdmin);
  //   }
  // }, []);

  useEffect(() => {
    const checkAdmin = () => {
      try {
        setIsAdmin(userInfos.isAdmin === 1);
      } catch (err) {
        console.log(err);
      }
    };
    checkAdmin();
    // console.log(isAdmin);
  }, [userInfos.user_id, isAdmin]);


  const moveTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <>
      <div className="header" id="top">
        <Link to="/">
          <img
            className="main-logo"
            src={process.env.PUBLIC_URL + '/temp_logo.png'}
            alt="Logo"
            onClick={redirectMain}
          />
        </Link>
        <ul>
          <li>
            <Link to="/news/economy">뉴스룸</Link>
          </li>
          <li>
            <Link to="/stockGuide">주식 길잡이</Link>
          </li>
          <li>
            <Link to="/community">개미의 시선</Link>
          </li>
          {isAdmin ? (
            <li>
              <Link to="/admin">관리자 페이지</Link>
            </li>
          ) : (
            ''
          )}
        </ul>
        {isLogin === true && (
          <>
            <div className="Header-mypage-btn" onClick={mypageToggle}>
              <img
                className="mypage-profile"
                src={userInfos.user_profile}
                alt=""
                style={{}}
              />
            </div>
            {isToggle === true && (
              <div className="Header-mypage">
                <div className="Header-nickname">
                  {userInfos.user_nickname}&nbsp;님의 투자 여정을 응원합니다!
                </div>
                <Link to="/wordBook">
                  <div>단어장</div>
                </Link>
                <Link to="/savedNews">
                  <div>뉴스 스크랩</div>
                </Link>
                <div className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </div>
                <div className="Header-user">
                  <Link to="/mypage">
                    <div className="Header-user-update">회원정보수정</div>
                  </Link>
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  <div className="Header-user-delete" onClick={deleteUserInfo}>
                    회원탈퇴
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {isLogin === false && (
          <Link to="/signin">
            <div className="Header-login-btn">로그인</div>
          </Link>
        )}

        <div className="menu-bar" onClick={menuTabToggle}>
          <span className="material-symbols-outlined">menu</span>
        </div>
      </div>

      <div className="remote-btn">
        <div className="fix-icon" onClick={moveTop}>
          <span className="material-symbols-rounded">vertical_align_top</span>
        </div>
      </div>
      <div className={`responsive-tab ${menuToggle ? 'visible' : ''}`}>
        {isLogin === true && (
          <>
            <div className="Header-mypage-btn">
              <img
                className="mypage-profile"
                src={userInfos.user_profile}
                alt=""
                style={{}}
              />
            </div>
            <div className="Header-mypage">
              <div className="Header-nickname">
                {userInfos.user_nickname}&nbsp;님의 투자 여정을 응원합니다!
              </div>
              <Link to="/wordBook">
                <div>단어장</div>
              </Link>
              <Link to="/savedNews">
                <div>뉴스 스크랩</div>
              </Link>
            </div>
          </>
        )}
        {isLogin === false && (
          <>
            <div className="Header-mypage-btn">
              <img
                className="mypage-profile"
                src={userInfos.user_profile}
                alt=""
                style={{}}
              />
            </div>
            <div className="Header-notuser">
              아직 개미운동에 가입하지 않으셨나요?
            </div>
            <Link to="/signin">
              <div className="Header-login-btn">로그인</div>
            </Link>
          </>
        )}
        <ul>
          <li>
            <Link to="/news/economy">뉴스룸</Link>
          </li>
          <li>
            <Link to="/stockGuide">주식 길잡이</Link>
          </li>
          <li>
            <Link to="/community">개미의 시선</Link>
          </li>
          {isAdmin ? (
            <li>
              <Link to="/admin">관리자 페이지</Link>
            </li>
          ) : (
            ''
          )}
        </ul>
        {isLogin === true && (
          <>
            <div className="logout-btn" onClick={handleLogout}>
              로그아웃
            </div>
            <div className="Header-user">
              <Link to="/mypage">
                <div className="Header-user-update">회원정보수정</div>
              </Link>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <div className="Header-user-delete" onClick={deleteUserInfo}>
                회원탈퇴
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Header;
