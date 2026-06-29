import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const PostRide = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    source: '', destination: '', rideDate: '',
    rideTime: '', availableSeats: '', pricePerSeat: ''
  });
  const [fareInfo, setFareInfo] = useState(null);
  const [loadingFare, setLoadingFare] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFareInfo(null);
  };

  // Calculate fare preview
  const handleCalculateFare = async () => {
    if (!form.source || !form.destination || !form.availableSeats) {
      setError('Enter source, destination and seats first!');
      return;
    }
    setLoadingFare(true);
    setError('');
    try {
      const res = await axios.get('/fare/calculate', {
        params: {
          source: form.source,
          destination: form.destination,
          passengers: form.availableSeats
        }
      });
      setFareInfo(res.data);
      setForm({ ...form, pricePerSeat: res.data.farePerPassenger });
    } catch (err) {
      setError('Could not calculate fare. Check city names!');
    } finally {
      setLoadingFare(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/rides/post', {
        ...form,
        availableSeats: parseInt(form.availableSeats),
        pricePerSeat: parseFloat(form.pricePerSeat)
      });
      setSuccess(res.data);
      setTimeout(() => navigate('/my-rides'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to post ride!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Post a Ride 🚗</h2>
        <p className="text-gray-500 mb-6">Fare is auto-calculated based on distance</p>

        {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 px-4 py-2 rounded mb-4 text-sm">{success}</div>}

        <div className="bg-white rounded-2xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input name="source" placeholder="e.g. Bangalore" value={form.source}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input name="destination" placeholder="e.g. Mysore" value={form.destination}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input name="rideDate" type="date" value={form.rideDate}
                  onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input name="rideTime" type="time" value={form.rideTime}
                  onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
              <input name="availableSeats" type="number" min="1" placeholder="e.g. 3"
                value={form.availableSeats} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {/* Calculate Fare Button */}
            <button type="button" onClick={handleCalculateFare}
              disabled={loadingFare}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 rounded-lg transition">
              {loadingFare ? 'Calculating...' : '🧮 Calculate Fare Automatically'}
            </button>

            {/* Fare Info Card */}
            {fareInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-1">
                <p className="font-semibold text-blue-700">📍 Fare Breakdown</p>
                <p className="text-gray-600">Distance: <span className="font-medium">{fareInfo.distanceKm} km</span></p>
                <p className="text-gray-600">Total Fare: <span className="font-medium">₹{fareInfo.totalFare}</span></p>
                <p className="text-gray-600">Passengers: <span className="font-medium">{fareInfo.passengers}</span></p>
                <p className="text-gray-600">Formula: <span className="font-medium">{fareInfo.breakdown}</span></p>
                <p className="text-green-700 font-bold text-base">Per Seat: ₹{fareInfo.farePerPassenger}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Seat (₹) <span className="text-gray-400 text-xs">(auto-filled or edit manually)</span>
              </label>
              <input name="pricePerSeat" type="number" min="0" placeholder="e.g. 250"
                value={form.pricePerSeat} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              {loading ? 'Posting...' : 'Post Ride'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRide;