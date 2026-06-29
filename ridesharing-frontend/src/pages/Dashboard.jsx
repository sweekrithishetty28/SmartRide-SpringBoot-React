import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {name}! 👋
        </h1>
        <p className="text-gray-500 mb-8">
          You are logged in as <span className="font-semibold text-blue-600">{role}</span>
        </p>

        {role === 'DRIVER' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => navigate('/post-ride')}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md border-l-4 border-blue-500 transition">
              <h2 className="text-xl font-semibold text-gray-700 mb-1">🚗 Post a Ride</h2>
              <p className="text-gray-400 text-sm">Share your trip and earn money</p>
            </div>
            <div
              onClick={() => navigate('/my-rides')}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md border-l-4 border-green-500 transition">
              <h2 className="text-xl font-semibold text-gray-700 mb-1">📋 My Rides</h2>
              <p className="text-gray-400 text-sm">View all your posted rides</p>
            </div>
            <div
              onClick={() => navigate('/my-earnings')}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md border-l-4 border-yellow-500 transition">
              <h2 className="text-xl font-semibold text-gray-700 mb-1">💰 My Earnings</h2>
              <p className="text-gray-400 text-sm">View your ride earnings</p>
            </div>
          </div>
        )}

        {role === 'PASSENGER' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => navigate('/search-ride')}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md border-l-4 border-blue-500 transition">
              <h2 className="text-xl font-semibold text-gray-700 mb-1">🔍 Search a Ride</h2>
              <p className="text-gray-400 text-sm">Find rides going your way</p>
            </div>
            <div
              onClick={() => navigate('/my-bookings')}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md border-l-4 border-green-500 transition">
              <h2 className="text-xl font-semibold text-gray-700 mb-1">🎫 My Bookings</h2>
              <p className="text-gray-400 text-sm">View all your booked rides</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;