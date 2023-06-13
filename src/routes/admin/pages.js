import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import WritePage from "../../container/pages/WritePage";
import PostPage from "../../container/pages/PostPage";

const Plogging = lazy(() => import('../../container/pages/plogging'));
const Index = lazy(() => import('../../container/pages/index'));
const Board = lazy(() => import('../../container/pages/board'));
const Challenge = lazy(() => import('../../container/pages/challenge'));
const Profile = lazy(() => import('../../container/pages/profile'));
const Friend = lazy(() => import('../../container/pages/friends'));
const Reward = lazy(() => import('../../container/pages/reward'));
// const ChallengeCreate = lazy(() => import('../../container/pages/ChallengeCreate'));

function PagesRoute() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="plogging" element={<Plogging />} />
      <Route path="board" element={<Board />} />
      <Route path="challenge" element={<Challenge />} />
      <Route path="profile" element={<Profile />} />
      <Route path="friend" element={<Friend />} />
      <Route path="reward" element={<Reward />} />
      <Route path="write" element={<WritePage />} />
      <Route path=":username" element={<PostPage />} />
      {/* <Route path="callengeCreate" element={<ChallengeCreate />} /> */}
    </Routes>
  );
}

export default PagesRoute;
