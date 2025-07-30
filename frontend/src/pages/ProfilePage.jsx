import React from "react";
import { useAuthStore } from "../store/authStore.js";
import { useState } from "react";
import { Camera, Trash2, LoaderIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const ProfilePage = () => {
  const {
    user,
    isUpdatingProfile,
    updateProfile,
    deleteAccount,
    isLoading,
    logout,
  } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();


  //compress image
  const compressImage = (imgSrc, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgSrc;

      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement("canvas");

        // Calculate dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Get compressed base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

        // Calculate approximate size in bytes
        // Remove the data URL prefix to get just the base64 string
        const base64String = compressedBase64.split(",")[1];
        // base64 represents 6 bits per character, so 4 characters = 3 bytes
        const approximateSizeInBytes = Math.ceil((base64String.length * 3) / 4);

        resolve({
          data: compressedBase64,
          size: approximateSizeInBytes,
        });
      };
    });
  };

  //image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      console.log("Image loaded:", reader.result);
      const compressedImage = await compressImage(reader.result);

      // Check compressed size (1MB limit)
      const MAX_COMPRESSED_SIZE = 1024 * 1024; // 1MB in bytes

      if (compressedImage.size > MAX_COMPRESSED_SIZE) {
        toast.error(`Image is too large. Please use a smaller image.`);
        return;
      }

      // const base64Image = reader.result; //base64 format
      setSelectedImage(compressedImage.data); //set the selected image in state
      await updateProfile({ profilePic: compressedImage.data });
    };
  };

  //delete account confirmation
  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate("/");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
      <div className="w-full max-w-xl bg-[#18181b] rounded-2xl shadow-xl p-8 mt-10">
        {isLoading && (
          <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <LoaderIcon className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        )}
        {/* Header row: Home button left, Profile Information center */}
        <div className="flex items-center justify-between mb-8 w-full">
          {/* Home button */}
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:from-yellow-500 hover:to-amber-600 transition"
          >
            Home
          </Link>
          {/* Title*/}
          <h2 className="text-3xl font-bold text-center flex-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-transparent bg-clip-text">
            Profile Information
          </h2>
          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-error btn-md flex items-center gap-2 ml-4"
            title="Delete Account"
          >
            <Trash2 className="size-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImage || (user && user.profilePic) || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
            <label
              htmlFor="avatar-upload"
              className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload} //run the function when file is selected
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        <section className="mb-8 mt-6 space-y-8">
          <div className="space-y-4">
            <p className="text-g text-gray-200">
              <span className="font-bold text-yellow-500 text-xl">Name:</span>{" "}
              <span className="text-xl">{user.fullName}</span>
            </p>
            <p className="text-g text-gray-200">
              <span className="font-bold text-yellow-500 text-xl">Email:</span>{" "}
              <span className="text-xl">{user.email}</span>
            </p>
            <p className="text-g text-gray-200">
              <span className="font-bold text-yellow-500 text-xl">Joined:</span>{" "}
              <span className="text-xl">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-amber-700 text-white font-bold rounded-lg shadow-lg hover:from-yellow-500 hover:to-amber-600 transition"
        >
          Logout
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-base-300 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
            <p className="mb-6">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
