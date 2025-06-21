import React from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar/';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';



const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/notes'); //Backend API endpoint
        console.log(response.data);
        setNotes(response.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log('Error fetching notes:', error);
        console.log('Error response:', error.response);
        if (error.response?.status === 429) {
          // If the error is a rate limit error, set the rate limit state
          setIsRateLimited(true);
        } else {
          // Handle other errors
          toast.error('Error loading notes');
        }
      } finally {
          setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}
        
        {/* if not rate limited, show the notes */}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard key={note._id} note={note} />

              // random css
              // <div key={note._id} className="card bg-base-100 shadow-xl">
              //   <div className="card-body">
              //     <h2 className="card-title">{note.title}</h2>
              //     <p>{note.content}</p>
              //     <div className="card-actions justify-end">
              //       <a href={`/note/${note._id}`} className="btn btn-primary">View Note</a>
              //     </div>
              //   </div>
              // </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage