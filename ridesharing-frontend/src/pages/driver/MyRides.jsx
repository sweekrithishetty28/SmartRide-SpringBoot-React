import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchRides = () => {
    setLoading(true);
    axios.get('/rides/my-rides')
      .then(res => setRides(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRides(); }, []);

  const handleCancel = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return;
    try {
      const res = await axios.put(`/rides/cancel-ride/${rideId}`);
      setMsg({ text: res.data, type: 'success' });
      fetchRides();
    } catch (err) {
      setMsg({ text: err.response?.data || 'Cancel failed!', type: 'error' });
    }
  };

  const handleComplete = async (rideId) => {
    if (!window.confirm('Mark this ride as completed?')) return;
    try {
      const res = await axios.put(`/rides/complete-ride/${rideId}`);
      setMsg({ text: res.data, type: 'success' });
      fetchRides();
    } catch (err) {
      setMsg({ text: err.response?.data || 'Failed!', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Posted Rides</h2>

        {msg.text && (
          <div className={`px-4 py-2 rounded mb-4 text-sm font-medium
            ${msg.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'}`}>
            {msg.text}
          </div>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && rides.length === 0 && (
          <p className="text-gray-500">You have not posted any rides yet.</p>
        )}

        <div className="space-y-4">
          {rides.map(ride => (
            <div key={ride.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ride.source} to {ride.destination}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {ride.rideDate} | {ride.rideTime}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {ride.availableSeats} seats left | Rs. {ride.pricePerSeat} per seat
                  </p>
                  {ride.distanceKm > 0 && (
                    <p className="text-gray-500 text-sm">
                      Distance: {ride.distanceKm} km
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${ride.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-600'
                      : ride.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-red-100 text-red-600'}`}>
                    {ride.status}
                  </span>

                  {ride.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(ride.id)}
                        className="bg-green-500 hover:bg-green-600 text-white
                          px-4 py-1 rounded-lg text-sm transition">
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancel(ride.id)}
                        className="bg-red-500 hover:bg-red-600 text-white
                          px-4 py-1 rounded-lg text-sm transition">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRides;