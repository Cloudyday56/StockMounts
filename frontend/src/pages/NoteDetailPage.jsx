import React, { use } from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../lib/axios"; // Import the axios instance
import { LoaderIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate(); // Use navigate to redirect after saving or deleting

  const { id } = useParams();

  // Fetch the note details using the id from the URL
  useEffect(() => {
    // look if there is token in local storage
    const storedToken = localStorage.getItem("token");
    const config = storedToken
      ? { headers: { Authorization: `Bearer ${storedToken}` } }
      : {}; // fallback to cookie
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`, config);
        setNote(response.data);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // console.log(note);

  //handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    // look if there is token in local storage
    const storedToken = localStorage.getItem("token");
    const config = storedToken
      ? { headers: { Authorization: `Bearer ${storedToken}` } }
      : {}; // fallback to cookie
    try {
      await api.delete(`/notes/${id}`, config);
      toast.success("Note deleted successfully");
      navigate("/"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  //handle save
  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add title and content");
      return;
    }

    setSaving(true); //save

    // look if there is token in local storage
    const storedToken = localStorage.getItem("token");
    const config = storedToken
      ? { headers: { Authorization: `Bearer ${storedToken}` } }
      : {}; // fallback to cookie

    try {
      await api.put(`/notes/${id}`, {...note}, config);
      toast.success("Note updated successfully");
      navigate("/"); // Redirect to home page after update
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false); // reset saving state
    }
  };

  //handle loading
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        {/* spinning icon */}
        <LoaderIcon className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* header (back and delete) */}
          <div className="flex items-center justify-between mb-6">
            {/* back button */}
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            {/* delete button */}
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          {/* note content*/}
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title text-2xl">Detail</h2>
                <button
                  type="button"
                  className={`btn w-32 text-lg font-bold transition-colors duration-150
                    ${
                      note.indicator === "buy"
                        ? "btn-success"
                        : note.indicator === "sell"
                        ? "btn-error"
                        : "btn-secondary"
                    }
                    hover:btn-outline hover:btn-neutral`}
                  onClick={() => {
                    note.indicator === "note"
                      ? setNote({ ...note, indicator: "buy" })
                      : note.indicator === "buy"
                      ? setNote({ ...note, indicator: "sell" })
                      : setNote({ ...note, indicator: "note" });
                  }}
                >
                  {note.indicator.toUpperCase()}
                </button>
              </div>

              {/* title & title name (modifiable) */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              {/* content (modifiable) */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>

              {/* Save button */}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
