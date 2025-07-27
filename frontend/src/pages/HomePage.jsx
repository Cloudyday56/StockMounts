import React from "react";
import Navbar from "../components/Navbar/";
// import RateLimitedUI from "../components/RateLimitedUI";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import StockPredictor from "../components/StockPredictor";
import Footer from "../components/Footer";
import SignInToView from "../components/SignInToView";

import { useEffect, useState } from "react";

import api from "../lib/axios"; // Import the axios instance
import { useAuthStore } from "../store/authStore";

const HomePage = () => {
  // const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes"); //Backend API endpoint
        // Only show notes belonging to the authenticated user (owner)
        const userNotes = response.data.filter(
          (note) => note.owner === user._id
        );
        setNotes(userNotes);
        // setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes:", error);
        console.log("Error response:", error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-grow">
        {/* {isRateLimited && <RateLimitedUI />} */}

        {/* Unified container for alignment */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stock Predictor Section */}
          <div className="p-8 bg-base-200 rounded-xl shadow-2xl">
            <StockPredictor />
          </div>

          {/* Notes Section */}
          <div className="mt-12">
            {!isAuthenticated ? (
              <SignInToView />
            ) : loading ? (
              <div className="text-center text-primary py-10">
                Loading notes...
              </div>
            ) : notes.length === 0 && !isRateLimited ? (
              <NotesNotFound />
            ) : notes.length > 0 && !isRateLimited ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard key={note._id} note={note} setNotes={setNotes} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
