// SignupPage 컴포넌트

import { useNavigate } from 'react-router';
import { ChangePw, FindId, FindPw } from '../../services/apiService';
import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

const FindIdPage = () => {
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = React.useState({
    user_id: '',
    user_email: '',
    user_password: '',
    user_pwCheck: '',
  });

  const [findType, setFindType] = useState('id');
  const [findResult, setFindResult] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const pwRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const findUserInfo = (type: string) => {
    setFindType(type);
  };

  const handleFindId = async (event: any, type: string) => {
    try {
      event.preventDefault(); // 이벤트의 기본 동작을 취소합니다.

      const response = await FindId(formData);
      if (response.success) {
        setFindType('findId');
        const result = response.userInfo.user_id;
        setFindResult(result.slice(0, result.length - 2) + '**');
      } else {
        alert('입력하신 정보와 일치하는 아이디가 없습니다.');
        // console.error('아이디 찾기 실패:', response);
      }
    } catch (error: any) {
      console.error('아이디 찾기 실패:', error.message);
    }
  };

  const handleFindPw = async (event: any, type: string) => {
    try {
      event.preventDefault(); // 이벤트의 기본 동작을 취소합니다.

      const response = await FindPw(formData);
      if (response.success) {
        setFindType('pwReset');
        setFormData((prevData) => ({
          ...prevData,
          user_password: '',
        }));
        alert('비밀번호를 재설정합니다.');
        // console.error('비밀번호 찾기 실패:', response);
      } else {
        alert('입력하신 정보와 일치하는 비밀번호가 없습니다.');
        // console.error('비밀번호 찾기 실패:', response);
      }
    } catch (error: any) {
      console.error('비밀번호 찾기 실패:', error.message);
    }
  };

  const passwordReCheck = (e: any) => {
    const pwCheckBox = document.querySelector('.pwCheckBox');
    if (formData.user_password.length < 8) {
      pwCheckBox?.classList.add('red');
      pwCheckBox?.classList.remove('blue');
      return setPwCheck('ⓘ 비밀번호는 최소 4자리 이상입니다.');
    } else if (formData.user_password !== formData.user_pwCheck) {
      pwCheckBox?.classList.add('red');
      pwCheckBox?.classList.remove('blue');
      return setPwCheck('ⓘ 비밀번호가 일치하지 않습니다.');
    } else if (
      formData.user_password === formData.user_pwCheck &&
      formData.user_password !== ''
    ) {
      pwCheckBox?.classList.add('blue');
      pwCheckBox?.classList.remove('red');
      return setPwCheck('ⓘ 사용가능한 비밀번호입니다.');
    } else {
      pwCheckBox?.classList.remove('red');
      pwCheckBox?.classList.remove('blue');
      return setPwCheck('');
    }
  };

  const handlePwReset = async (event: any) => {
    try {
      // console.log(formData.user_id);
      event.preventDefault(); // 이벤트의 기본 동작을 취소합니다.
      if (pwCheck.includes('사용가능')) {
        const response = await ChangePw(formData);
        if (response.success) {
          alert('비밀번호가 재설정되었습니다.');
          navigate('/signin');
        } else {
          alert('비밀번호 재설정에 실패했습니다. 다시 시도해주세요');
          // console.error('비밀번호 찾기 실패:', response);
        }
      } else if (pwCheck.includes('최소')) {
        alert('비밀번호는 최소 8자리 이상입니다.');
        pwRef.current?.focus();
      } else {
        alert('비밀번호가 일치하지 않습니다.');
        pwRef.current?.focus();
      }
    } catch (error: any) {
      console.error('비밀번호 찾기 실패:', error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>아이디/비밀번호 찾기 : 개미운동</title>
      </Helmet>
      <div className="form-box">
        <div className="page-title">아이디 / 비밀번호 찾기</div>
        {findType === 'id' && (
          <>
            <div>
              <div
                className="find-box find-id"
                onClick={() => findUserInfo('id')}
              >
                아이디 찾기
              </div>
              <div className="find-box" onClick={() => findUserInfo('pw')}>
                비밀번호 찾기
              </div>
            </div>
            <form name="register-form" method="post">
              <input
                name="user_email"
                id="user_email"
                placeholder="이메일 (@포함)"
                className="input-box"
                onChange={handleInputChange}
              />
              <br />
              <input
                type="password"
                id="user_password"
                name="user_password"
                placeholder="비밀번호 (최소 8자리 이상)"
                className="input-box"
                onChange={handleInputChange}
              />
              <br />
              <button
                className="signinBtn"
                onClick={(e) => handleFindId(e, 'findId')}
              >
                아이디 찾기
              </button>
            </form>
          </>
        )}
        {findType === 'pw' && (
          <>
            <div>
              <div className="find-box" onClick={() => findUserInfo('id')}>
                아이디 찾기
              </div>
              <div
                className="find-box find-pw"
                onClick={() => findUserInfo('pw')}
              >
                비밀번호 찾기
              </div>
            </div>
            <form name="register-form" method="post">
              <input
                name="user_id"
                id="user_id"
                placeholder="아이디 (최소 4자리 이상)"
                className="input-box"
                onChange={handleInputChange}
              />
              <br />
              <input
                name="user_email"
                id="user_email"
                placeholder="이메일 (@포함)"
                className="input-box"
                onChange={handleInputChange}
              />
              <br />
              <button
                className="signinBtn"
                onClick={(e) => handleFindPw(e, 'findPw')}
              >
                비밀번호 찾기
              </button>
            </form>
          </>
        )}
        {findType === 'findId' && (
          <>
            <div>
              <div
                className="find-box find-id"
                onClick={() => findUserInfo('id')}
              >
                아이디 찾기
              </div>
              <div className="find-box" onClick={() => findUserInfo('pw')}>
                비밀번호 찾기
              </div>
            </div>
            <div className="find-result">
              입력하신 정보와 일치하는 아이디는 아래와 같습니다.
              <br />
              개인정보 보호를 위해 끝자리는 *로 표시됩니다.
              <div>{findResult}</div>
            </div>
            <button
              className="signinBtn"
              onClick={(e) => handleFindId(e, 'findId')}
            >
              아이디 찾기
            </button>
          </>
        )}
        {findType === 'pwReset' && (
          <>
            <div>
              <div className="find-box" onClick={() => findUserInfo('id')}>
                아이디 찾기
              </div>
              <div
                className="find-box find-pw"
                onClick={() => findUserInfo('pw')}
              >
                비밀번호 찾기
              </div>
            </div>
            <form name="register-form" method="post">
              <input
                type="password"
                id="user_password"
                name="user_password"
                placeholder="비밀번호 (최소 8자리 이상)"
                className="input-box"
                onChange={handleInputChange}
              />
              <br />
              <input
                type="password"
                id="user_pwCheck"
                name="user_pwCheck"
                placeholder="비밀번호 확인"
                className="input-box"
                onChange={handleInputChange}
                onKeyUp={passwordReCheck}
                ref={pwRef}
              />
              <div className="pwCheckBox">{pwCheck}</div>
              <button className="signinBtn" onClick={handlePwReset}>
                비밀번호 재설정
              </button>
            </form>
          </>
        )}
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
      </div>
    </>
  );
};

export default FindIdPage;
