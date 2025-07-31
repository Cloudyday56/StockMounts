import React from "react";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      //get allthe previous notes and filter the deleted one (comparing the id)
      setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    // the whole thing is clickable
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-200 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#F3A326]"
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3
            className="text-base-content font-bold text-xl flex-grow min-w-0 overflow-hidden whitespace-nowrap pr-2"
            style={{
              lineHeight: 1.2,
              textOverflow: "ellipsis",
              WebkitTextOverflow: "ellipsis",
              WebkitBoxOrient: "horizontal",
              WebkitLineClamp: 1,
              display: "block",
              maxWidth: "100%",
            }}
            title={note.title}
          >
            {note.title}
          </h3>
          <span
            className={`btn btn-md font-bold px-4 py-2 text-base pointer-events-none flex-shrink-0
              ${
                note.indicator === "buy"
                  ? "btn-success"
                  : note.indicator === "sell"
                  ? "btn-error"
                  : "btn-secondary"
              }`}
          >
            {note.indicator ? note.indicator.toUpperCase() : "NOTE"}
          </span>
        </div>
        <p
          className="text-base-content/70 overflow-hidden whitespace-nowrap pr-2"
          style={{
            textOverflow: "ellipsis",
            WebkitTextOverflow: "ellipsis",
            WebkitBoxOrient: "horizontal",
            WebkitLineClamp: 1,
            display: "block",
            maxWidth: "100%",
          }}
          title={note.content}
        >
          {note.content}
        </p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            {/* Edit button */}
            <PenSquareIcon className="size-4" />
            {/* Delete button */}
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default NoteCard;
