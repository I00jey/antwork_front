import '../../styles/Community.scss';
import CommuniutyHeader from '../../components/community/CommunityHeader';
import CommunityRead from '../../components/community/CommunityRead';
import { Helmet } from 'react-helmet';

function CommunityReadPage() {
  return (
    <>
      <Helmet>
        <title>개미운동 : 커뮤니티</title>
      </Helmet>

      <div className="main">
        <CommuniutyHeader />

        <div className="communityReadBox">
          <CommunityRead />
        </div>
      </div>
    </>
  );
}

export default CommunityReadPage;
