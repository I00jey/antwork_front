import React, { ReactElement, useState } from 'react';
import PostRank from '../../components/community/PostRank';
import '../../styles/Community.scss';
import Community from '../../components/community/Community';
import CommuniutyHeader from '../../components/community/CommunityHeader';
import { Helmet } from 'react-helmet';

function CommunityMain(): ReactElement {
  return (
    <>
      <Helmet>
        <title>개미운동 : 커뮤니티</title>
      </Helmet>

      <div className="main">
        <CommuniutyHeader />

        <div className="communityContentBox">
          <div className="rankingBox">
            <PostRank />
          </div>
          <div className="postBox">
            <Community />
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityMain;
