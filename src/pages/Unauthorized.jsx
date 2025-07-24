import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f1a] text-white px-4 text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
      <p className="text-gray-400 mb-6">
        You don’t have permission to view this page.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="bg-[#51cbce] text-black px-6 py-2 rounded-md hover:bg-[#3bb9b9] transition duration-200"
      >
        Go Back to Tickets
      </button>
    </div>
  );
};

export default Unauthorized;
