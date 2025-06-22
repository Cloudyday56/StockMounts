import React from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar/';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import api from '../lib/axios'; // Import the axios instance


const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get('/notes'); //Backend API endpoint
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
        
        {!loading && notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {/* if not rate limited, show the notes */}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <NoteCard key={note._id} note={note} setNotes={setNotes}/> //setNotes is used to update the notes state after deleting a note

            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage