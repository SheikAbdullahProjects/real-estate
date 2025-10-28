import React from "react";

const Oauth = () => {
  return (
    <button
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
      variant="outline"
      type="button"
      onClick={() =>
        window.open("http://localhost:3000/api/auth/google", "_self")
      }
    >
      Continue With Google
    </button>
  );
};

export default Oauth;
