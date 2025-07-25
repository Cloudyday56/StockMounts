import React from "react";
import { LockIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SignInToView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <LockIcon className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">Sign in to view your notes</h3>
      <p className="text-base-content/70">
        Please sign in to access your notes and personalized features.
      </p>
      <Link to="/login" className="btn btn-primary">
        Sign In
      </Link>
    </div>
  );
};

export default SignInToView;
