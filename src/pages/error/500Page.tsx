import { Link } from 'react-router-dom';
import '../../styles/Error.scss';
import { Helmet } from 'react-helmet';

const ErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>서버오류</title>
      </Helmet>
      <div className="outer-wrapper">
        <div className="error-wrapper">
          <img
            className="error-img"
            src={process.env.PUBLIC_URL + '/500.png'}
            alt=""
          />
          <div className="error-msg">페이지를 찾을 수 없습니다.</div>
          <div className="error-detail">
            원하시는 결과를 찾을 수 없습니다. 올바른 URL을 입력하였는지
            확인하세요. 자세한 내용은 사이트 소유자에게 문의하시기 바랍니다.
          </div>
          <Link to="/">
            <div
              style={{ backgroundColor: '#F30000' }}
              className="back-to-main"
            >
              메인으로 돌아가기
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
export default ErrorPage;
