import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold tracking-wide">
        🚗 SmartRide
      </Link>
      <div className="flex items-center gap-6 text-sm">

        <Link to="/profile" className="hover:text-yellow-300 transition">
          Profile
        </Link>

        {role === 'DRIVER' && (
          <>
            <Link to="/post-ride" className="hover:text-yellow-300 transition">
              Post Ride
            </Link>
            <Link to="/my-rides" className="hover:text-yellow-300 transition">
              My Rides
            </Link>
            <Link to="/my-earnings" className="hover:text-yellow-300 transition">
              Earnings
            </Link>
          </>
        )}

        {role === 'PASSENGER' && (
          <>
            <Link to="/search-ride" className="hover:text-yellow-300 transition">
              Search Ride
            </Link>
            <Link to="/my-bookings" className="hover:text-yellow-300 transition">
              My Bookings
            </Link>
            <Link to="/transactions" className="hover:text-yellow-300 transition">
              Transactions
            </Link>
          </>
        )}

        <span className="bg-white text-blue-600 px-3 py-1 rounded-full font-semibold">
          {name}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;