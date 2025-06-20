import React from 'react';

import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';
// import toast from 'react-hot-toast';
import { Routes, Route } from 'react-router';

const App = () => {
  return (
    <div data-theme="luxury">
      {/* <button onClick={() => toast.success('Button clicked!')} className="text-green-500 p-4 bg-yellow-200">Click Me</button> */}
      {/* there is also the toast.error() method for error messages */}

      <button className="btn btn-primary">Click Me</button>
      <button className="btn">Button</button>
      <button className="btn btn-neutral">Neutral</button>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-secondary">Secondary</button>
      <button className="btn btn-accent">Accent</button>
      <button className="btn btn-ghost">Ghost</button>
      <button className="btn btn-link">Link</button>

      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      
      </Routes>
    </div>
  );
  
}

export default App;



