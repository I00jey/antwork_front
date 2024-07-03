import { useCookies } from 'react-cookie';
import './../../styles/Mypage.scss';
import React, { useEffect, useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router';
import {
  deleteKakao,
  deleteUser,
  modifyUser,
  myNicknameChecker,
  myPwChecker,
  userInfo,
} from '../../services/apiService';
import { Helmet } from 'react-helmet';
const MyPage = () => {
  const [jwtCookie, setjwtCookie, removejwtCookie] = useCookies(['jwtCookie']);
  const [kakaoToken, setkakaoToken, removekakaoToken] = useCookies([
    'kakaoToken',
  ]);
  const [isKakao, setisKakao, removeisKakao] = useCookies(['isKakao']);
  const navigate = useNavigate();
  const [myId, setMyId] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const [formData, setFormData] = React.useState({
    user_id: '',
    user_password: '',
    user_changepw: '',
    user_nickname: '',
    user_email: '',
    user_profile: '',
  });

  useEffect(() => {
    console.log(formData);
  }, []);
  const signupValidate = (inputType: string) => {
    if (inputType === 'pw') {
      if (formData.user_changepw.length < 8) {
        return false;
      }
    }
    if (inputType === 'nickname') {
      if (formData.user_nickname.length < 4) {
        return false;
      }
    }
    if (inputType === 'email') {
      if (!formData.user_email.includes('@')) {
        return false;
      }
    }
  };

  useEffect(() => {
    const tokenId = jwtCookie['jwtCookie']; // 대괄호를 사용하여 속성에 액세스합니다.
    if (!tokenId) {
      alert('로그인 후 사용가능한 기능입니다.');
      navigate('/signin');
    }
    getUserInfo();
    if (isKakao['isKakao']) {
      setIsDisabled(true);
    }
  }, []); // 빈 배열을 전달하여 마운트 및 언마운트 시에만 실행

  const getUserInfo = async () => {
    try {
      const tokenId = jwtCookie['jwtCookie'];
      const response = await userInfo({ id: tokenId });
      // console.log(response.info);
      // console.log(response.info.user_id);
      setMyId(response.info.user_id);

      setFormData((prevData) => ({
        ...prevData,
        user_id: response.info.user_id,
        user_email: response.info.user_email,
        user_nickname: response.info.user_nickname,
        user_password: response.info.user_password,
        user_profile: response.info.user_profile,
      }));
      console.log(formData);
    } catch (error) {
      navigate('/');
      console.log('사용자 정보 가져오기 에러', error);
    }
  };

  const handleReset = async () => {
    const tokenId = jwtCookie['jwtCookie'];
    const response = await userInfo({ id: tokenId });

    console.log(response.info);
    setMyId(response.info.user_id);

    setFormData((prevData) => ({
      ...prevData,
      user_email: response.info.user_email,
      user_nickname: response.info.user_nickname,
      // user_changepw: '',
      // user_password: '',
      user_profile: response.info.user_profile,
    }));
    console.log('Reset:', formData);
  };

  // 현재 비밀번호 일치 확인
  const [pwCheckString, setPwCheckString] = useState('');
  const [pwCheckState, setPwCheckState] = useState(false);
  const pwRef = useRef<HTMLInputElement>(null);
  const passwordCheck = async (event: any) => {
    try {
      event.preventDefault();
      const response = await myPwChecker(formData, myId);
      // console.log(response);
      const pwCheckBox = document.querySelector('.pwReCheckBox');
      if (response.success === true) {
        pwCheckBox?.classList.add('blue');
        pwCheckBox?.classList.remove('red');
        setPwCheckState(true);
        return setPwCheckString(`ⓘ ${response.message}`);
      } else if (response.success === false) {
        pwCheckBox?.classList.add('red');
        pwCheckBox?.classList.remove('blue');
        setPwCheckState(false);
        return setPwCheckString(`ⓘ ${response.message}`);
      } else {
        pwCheckBox?.classList.remove('red');
        pwCheckBox?.classList.remove('blue');
        setPwCheckState(false);
        return setPwCheckString('');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('닉네임 유효성 검사 실패:', error.message);
    }
  };

  // 변경할 비밀번호 유효성 검사
  const [pwValiCheck, setValiPwCheck] = useState('');
  const pwReRef = useRef<HTMLInputElement>(null);
  const pwasswordValiCheck = async (event: any) => {
    try {
      event.preventDefault();
      const pwCheckbox = document.querySelector('.pwCheckBox');

      if (formData.user_changepw === '') {
        pwCheckbox?.classList.remove('red');
        pwCheckbox?.classList.remove('blue');
        return setValiPwCheck('');
      } else if (signupValidate('pw') === false) {
        pwCheckbox?.classList.add('red');
        pwCheckbox?.classList.remove('blue');
        return setValiPwCheck(`ⓘ 비밀번호는 최소 8자리 이상입니다.`);
      } else {
        pwCheckbox?.classList.add('blue');
        pwCheckbox?.classList.remove('red');
        return setValiPwCheck('ⓘ 사용가능한 비밀번호입니다.');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('아이디 유효성 검사 실패:', error.message);
    }
  };

  // 닉네임 중복 확인
  const [nicknameCheckString, setNicknameCheckString] = useState('');
  const [nicknameCheckState, setNicknameCheckState] = useState(true);
  const nickRef = useRef<HTMLInputElement>(null);
  const nicknameReCheck = async (event: any) => {
    try {
      event.preventDefault();
      const response = await myNicknameChecker(formData, myId);
      // console.log(response);
      const nicknameCheckBox = document.querySelector('.nicknameCheckBox');

      if (formData.user_nickname.trim() === '') {
        nicknameCheckBox?.classList.remove('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheckString('');
      } else if (signupValidate('nickname') === false) {
        nicknameCheckBox?.classList.add('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheckString(`ⓘ 닉네임은 최소 4자리 이상입니다.`);
      } else if (response.success && !signupValidate('nickname') === true) {
        nicknameCheckBox?.classList.add('blue');
        nicknameCheckBox?.classList.remove('red');
        return setNicknameCheckString(`ⓘ 사용가능한 닉네임입니다.`);
      } else if (response.success === false) {
        nicknameCheckBox?.classList.add('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheckString(`ⓘ 현재 사용 중인 닉네임입니다.`);
      } else {
        nicknameCheckBox?.classList.remove('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheckString('');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('닉네임 유효성 검사 실패:', error.message);
    }
  };

  // 이메일 유효성 검사
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailCheck, setEmailCheck] = useState('');
  const emailReCheck = async (event: any) => {
    try {
      event.preventDefault();
      const emailBox = document.querySelector('.emailCheckBox');

      if (formData.user_email === '') {
        emailBox?.classList.remove('red');
        emailBox?.classList.remove('blue');
        return setEmailCheck('');
      } else if (signupValidate('email') === false) {
        emailBox?.classList.add('red');
        emailBox?.classList.remove('blue');
        return setEmailCheck(`ⓘ 이메일은 @를 포함해야 합니다.`);
      } else {
        emailBox?.classList.remove('red');
        emailBox?.classList.add('blue');
        return setEmailCheck('ⓘ 사용가능한 이메일입니다.');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('아이디 유효성 검사 실패:', error.message);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;

    // 회원 프로필 관련
    if (name === 'user_profile' && files && files.length > 0) {
      const file = files[0];
      // 파일 읽어오기
      const reader = new FileReader();
      reader.onloadend = () => {
        // 미리보기 이미지를 업데이트
        const previewImage = document.getElementById(
          'showIMG'
        ) as HTMLImageElement;
        if (previewImage) {
          previewImage.src = reader.result as string;
        }
      };

      // 파일을 Data URL로 읽어옴
      reader.readAsDataURL(file);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'user_profile' ? files[0] : value,
    }));
  };

  // 이미지 변경

  // 읽기 동작이 성공적으로 완료되었을 때 실행되는 이벤트 핸들러

  const modifyUserInfo = async (event: any) => {
    try {
      event.preventDefault();

      if (isKakao['isKakao']) {
        if (!nicknameCheckState) {
          alert('닉네임 중복을 확인해주세요');
        } else {
          const response = await modifyUser(formData, myId);
          if (response.success) {
            alert('회원정보 수정 성공!');
            window.location.href = '/mypage';
          } else {
            console.error('회원정보 수정 실패:', response);
          }
        }
      } else {
        if (!pwCheckState) {
          alert('비밀번호를 확인해주세요');
          pwRef.current?.focus();
        } else if (
          pwValiCheck.includes('최소')
          // || formData.user_changepw.trim() === ''
        ) {
          alert('비밀번호는 최소 8자리 이상입니다.');
          pwReRef.current?.focus();
        } else if (!nicknameCheckState) {
          alert('닉네임 중복을 확인해주세요');
          nickRef.current?.focus();
        } else if (
          nicknameCheckString.includes('글자') ||
          formData.user_nickname.trim() === ''
        ) {
          alert('닉네임은 최소 8자리 이상입니다.');
          nickRef.current?.focus();
        } else if (
          emailCheck.includes('@') ||
          formData.user_email.trim() === ''
        ) {
          alert('이메일은 @를 포함해야합니다.');
          nickRef.current?.focus();
        } else {
          const response = await modifyUser(formData, myId);
          if (response.success) {
            alert('회원정보 수정 성공!');
            // navigate('/mypage');
            window.location.href = '/mypage';
          } else {
            console.error('회원정보 수정 실패:', response);
          }
        }
      }
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>회원정보수정 : 개미운동</title>
      </Helmet>
      <div className="mypage-wrapper ">
        <form name="register-form" method="post">
          <div className="mypage-title">회원 정보 수정</div>
          <div className="userImgBox">
            <img
              className="profile-img"
              src={formData.user_profile}
              alt=""
              id="showIMG"
            />
            <div className="img-edit-btn">
              <input
                className="profile-input"
                type="file"
                name="user_profile"
                id="user_profile"
                disabled={isDisabled}
                onChange={handleInputChange}
              />
              <label htmlFor="user_profile">
                <span> 이미지 변경하기</span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '14px' }}
                >
                  edit
                </span>
              </label>
            </div>
          </div>

          <div>
            <div className="input-label">아이디</div>
            <input
              name="user_id"
              id="user_id"
              placeholder="아이디"
              value={formData.user_id}
              className="input-box"
              disabled
            />
            <br />
            <div>
              <div className="input-label">현재 비밀번호</div>
              <input
                type="password"
                id="user_password"
                name="user_password"
                placeholder="현재 비밀번호"
                ref={pwRef}
                className="input-box"
                onChange={handleInputChange}
                onKeyUp={passwordCheck}
                disabled={isDisabled}
              />
            </div>
            <div className="pwReCheckBox">{pwCheckString}</div>
            <div>
              <div className="input-label">변경 비밀번호</div>
              <input
                type="password"
                id="user_changepw"
                name="user_changepw"
                placeholder="변경 비밀번호"
                className="input-box"
                ref={pwReRef}
                onKeyUp={pwasswordValiCheck}
                onChange={handleInputChange}
                disabled={isDisabled}
              />
            </div>
            <div className="pwCheckBox">{pwValiCheck}</div>

            <div className="input-label">닉네임</div>
            <input
              id="user_nickname"
              name="user_nickname"
              placeholder="닉네임"
              className="input-box"
              value={formData.user_nickname}
              onChange={handleInputChange}
              onKeyUp={nicknameReCheck}
              ref={nickRef}
            />
            <div className="nicknameCheckBox">{nicknameCheckString}</div>
            <div className="input-label">이메일</div>
            <input
              name="user_email"
              id="user_email"
              placeholder="이메일"
              className="input-box"
              value={formData.user_email}
              onKeyUp={emailReCheck}
              onChange={handleInputChange}
              ref={emailRef}
            />
            <div className="emailCheckBox">{emailCheck}</div>
            <div style={{ width: '100%' }}>
              <button className="resetBtn" type="reset" onClick={handleReset}>
                취소
              </button>
              <button className="modifyBtn" onClick={modifyUserInfo}>
                수정
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default MyPage;
