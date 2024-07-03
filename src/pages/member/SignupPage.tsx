// SignupPage 컴포넌트

import { useNavigate } from 'react-router';
import React, { useRef, useState } from 'react';
import {
  idChecker,
  nicknameChecker,
  register,
} from '../../services/apiService';
import { Helmet } from 'react-helmet';

const SignupPage = () => {
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = React.useState({
    user_id: '',
    user_password: '',
    user_pwCheck: '',
    user_nickname: '',
    user_email: '',
  });

  const [idCheck, setIdCheck] = useState('');
  const [pwValiCheck, setValiPwCheck] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [nicknameCheck, setNicknameCheck] = useState('');
  const [emailCheck, setEmailCheck] = useState('');

  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pwReRef = useRef<HTMLInputElement>(null);
  const nickRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const signupValidate = (inputType: string) => {
    if (inputType === 'id') {
      if (formData.user_id.length < 4) {
        // console.log(formData.user_id.length);
        return false;
      }
    }
    if (inputType === 'pw') {
      if (formData.user_password.length < 8) {
        return false;
      }
    }
    if (inputType === 'nickname') {
      if (formData.user_nickname.length < 2) {
        return false;
      }
    }
    if (inputType === 'email') {
      if (!formData.user_email.includes('@')) {
        return false;
      }
    }
  };
  const idReCheck = async (event: any) => {
    try {
      event.preventDefault();

      const response = await idChecker(formData);

      const idCheckBox = document.querySelector('.idCheckBox');

      // 서버에서의 응답에 따라 처리
      if (formData.user_id === '') {
        idCheckBox?.classList.remove('red');
        idCheckBox?.classList.remove('blue');
        return setIdCheck('');
      } else if (signupValidate('id') === false) {
        idCheckBox?.classList.add('red');
        idCheckBox?.classList.remove('blue');
        return setIdCheck(`ⓘ 아이디는 최소 4자리 이상입니다.`);
      } else if (response.success && !signupValidate('id') === true) {
        idCheckBox?.classList.add('blue');
        idCheckBox?.classList.remove('red');
        // console.log(response);
        return setIdCheck(`ⓘ 사용가능한 아이디입니다.`);
      } else if (response.success === false) {
        idCheckBox?.classList.add('red');
        idCheckBox?.classList.remove('blue');
        return setIdCheck(`ⓘ 중복되는 아이디가 있습니다.`);
      } else {
        idCheckBox?.classList.remove('red');
        idCheckBox?.classList.remove('blue');
        return setIdCheck('');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('아이디 유효성 검사 실패:', error.message);
    }
  };

  const pwasswordValiCheck = async (event: any) => {
    try {
      event.preventDefault();
      const pwCheckbox = document.querySelector('.pwCheckBox');

      if (formData.user_password === '') {
        pwCheckbox?.classList.remove('red');
        pwCheckbox?.classList.remove('blue');
        return setValiPwCheck('');
      } else if (signupValidate('pw') === false) {
        pwCheckbox?.classList.add('red');
        pwCheckbox?.classList.remove('blue');
        return setValiPwCheck(`ⓘ 비밀번호는 최소 8자리 이상입니다.`);
      } else {
        pwCheckbox?.classList.remove('red');
        pwCheckbox?.classList.remove('blue');
        return setValiPwCheck('');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('아이디 유효성 검사 실패:', error.message);
    }
  };
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
        emailBox?.classList.remove('blue');
        return setEmailCheck('');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('아이디 유효성 검사 실패:', error.message);
    }
  };

  const nicknameReCheck = async (event: any) => {
    try {
      event.preventDefault();
      const response = await nicknameChecker(formData);
      // console.log(response);
      const nicknameCheckBox = document.querySelector('.nicknameCheckBox');
      // console.log('ddddd', formData.user_nickname.trim());
      if (formData.user_nickname.trim() === '') {
        nicknameCheckBox?.classList.remove('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheck('');
      } else if (signupValidate('nickname') === false) {
        nicknameCheckBox?.classList.add('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheck(`ⓘ 닉네임은 최소 두자리 이상입니다.`);
      } else if (response.success && !signupValidate('nickname') === true) {
        nicknameCheckBox?.classList.add('blue');
        nicknameCheckBox?.classList.remove('red');
        // console.log(response);
        return setNicknameCheck(`ⓘ ${response.message}`);
      } else if (response.success === false) {
        nicknameCheckBox?.classList.add('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheck(`ⓘ ${response.message}`);
      } else {
        nicknameCheckBox?.classList.remove('red');
        nicknameCheckBox?.classList.remove('blue');
        return setNicknameCheck('');
      }
    } catch (error: any) {
      // 에러 처리
      console.error('아이디 유효성 검사 실패:', error.message);
    }
  };

  const passwordReCheck = (e: any) => {
    const pwCheckBox = document.querySelector('.pwReCheckBox');
    if (
      formData.user_password === formData.user_pwCheck &&
      formData.user_password !== ''
    ) {
      pwCheckBox?.classList.add('blue');
      pwCheckBox?.classList.remove('red');
      return setPwCheck('ⓘ 사용가능한 비밀번호입니다.');
    } else if (formData.user_password !== formData.user_pwCheck) {
      pwCheckBox?.classList.add('red');
      pwCheckBox?.classList.remove('blue');
      return setPwCheck('ⓘ 비밀번호가 일치하지 않습니다.');
    } else {
      pwCheckBox?.classList.remove('red');
      pwCheckBox?.classList.remove('blue');
      return setPwCheck('');
    }
  };

  // 회원가입 버튼 클릭 시 실행되는 함수
  const handleRegister = async (event: any) => {
    try {
      event.preventDefault(); // 이벤트의 기본 동작을 취소합니다.

      // register 함수에 유저 데이터를 전달
      if (idCheck.includes('중복')) {
        alert('중복되는 아이디입니다.');
        idRef.current?.focus();
      } else if (idCheck.includes('최소') || formData.user_id.trim() === '') {
        alert('아이디는 최소 4글자 이상입니다.');
        idRef.current?.focus();
      } else if (
        pwValiCheck.includes('최소') ||
        formData.user_password.trim() === ''
      ) {
        alert('비밀번호는 최소 8글자 이상입니다.');
        pwRef.current?.focus();
      } else if (pwCheck.includes('일치')) {
        alert('비밀번호가 일치하지 않습니다.');
        pwRef.current?.focus();
      } else if (nicknameCheck.includes('중복')) {
        alert('중복되는 닉네임입니다.');
        nickRef.current?.focus();
      } else if (
        nicknameCheck.includes('최소') ||
        formData.user_nickname.trim() === ''
      ) {
        alert('닉네임은 최소 두글자 이상입니다.');
        nickRef.current?.focus();
      } else if (
        emailCheck.includes('@') ||
        formData.user_email.trim() === ''
      ) {
        alert('이메일은 @를 포함해야합니다.');
        emailRef.current?.focus();
      } else {
        const response = await register(formData);
        if (response.success) {
          // console.log('회원가입 성공:', response);
          alert('회원가입 성공!');
          navigate('/signin');
          window.location.href = '/';
          // 성공 메시지 출력 또는 리다이렉트 등 필요한 처리
        } else {
          // console.error('회원가입 실패:', response);
          // 실패 메시지 출력 또는 필요한 처리
        }
      }

      // 서버에서의 응답에 따라 처리
    } catch (error: any) {
      // 에러 처리
      console.error('회원가입 실패:', error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>개미운동 : 회원가입</title>
      </Helmet>
      <div className="form-box">
        <div className="page-title">회원가입</div>
        <form name="register-form" method="post">
          <input
            name="user_id"
            id="user_id"
            placeholder="아이디 (최소 4자리 이상)"
            className="input-box"
            onChange={handleInputChange}
            onKeyUp={(e) => {
              idReCheck(e);
              // signupValidate();
            }}
            // onBlur={signupValidate}
            ref={idRef}
          />
          <div className="idCheckBox">{idCheck}</div>
          <input
            type="password"
            id="user_password"
            name="user_password"
            placeholder="비밀번호 (최소 8자리 이상)"
            className="input-box"
            ref={pwRef}
            onChange={handleInputChange}
            onKeyUp={pwasswordValiCheck}
          />
          <div className="pwCheckBox">{pwValiCheck}</div>
          <input
            type="password"
            id="user_pwCheck"
            name="user_pwCheck"
            placeholder="비밀번호 확인"
            className="input-box"
            onChange={handleInputChange}
            onBlur={passwordReCheck}
            ref={pwReRef}
          />
          <div className="pwReCheckBox">{pwCheck}</div>
          <input
            id="user_nickname"
            name="user_nickname"
            placeholder="닉네임 (최소 4자리 이상)"
            className="input-box"
            onChange={handleInputChange}
            onKeyUp={nicknameReCheck}
            ref={nickRef}
          />
          <div className="nicknameCheckBox">{nicknameCheck}</div>

          <input
            name="user_email"
            id="user_email"
            placeholder="이메일 (@ 포함한 주소 입력)"
            className="input-box"
            ref={emailRef}
            onKeyUp={emailReCheck}
            onChange={handleInputChange}
          />
          <div className="emailCheckBox">{emailCheck}</div>
          {/* <br /> */}
          <button className="signinBtn" onClick={handleRegister}>
            회원가입
          </button>
          <div className="account-options">
            이미 계정이 있으신가요?&nbsp;&nbsp;{' '}
            <span
              className="link-btn"
              onClick={() => {
                navigate('/signin');
              }}
            >
              로그인하기
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
