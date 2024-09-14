import { useNavigate } from "react-router-dom";

const NotFoundIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-800 animate-pulse">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4 mb-8">
          Oops! This page has gone missing.
        </p>
      </div>
      <div className="mt-8 space-x-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out hover:scale-105"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300 ease-in-out hover:scale-105"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundIndexPage;
