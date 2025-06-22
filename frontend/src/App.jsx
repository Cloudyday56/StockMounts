import React from 'react';

import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';
// import toast from 'react-hot-toast';
import { Routes, Route } from 'react-router';

const App = () => {
  return (
    <div className="relative h-full w-hull">
      {/* the gradient effect at the bottom */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#d59f49_100%)]" />

      {/* <button onClick={() => toast.success('Button clicked!')} className="text-green-500 p-4 bg-yellow-200">Click Me</button> */}
      {/* there is also the toast.error() method for error messages */}

      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      
      </Routes>
    </div>
  );
  
}

export default App;



