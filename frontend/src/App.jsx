import React from 'react';

import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';
import ProfilePage from './pages/ProfilePage';
// import toast from 'react-hot-toast';
import { Routes, Route } from 'react-router';

const App = () => {
  return (
    <div className="relative h-full w-hull">
      {/* the gradient effect at the bottom */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#171618_65%,#F3A326_100%)]" />
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </div>
  );
  
}

export default App;



