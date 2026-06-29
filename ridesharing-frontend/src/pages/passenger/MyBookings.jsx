import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchBookings = () => {
    setLoading(true);
    axios.get('/rides/my-bookings')
      .then(res => {
        console.log('Bookings:', res.data);
        setBookings(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await axios.put(`/rides/cancel-booking/${bookingId}`);
      setMsg({ text: res.data, type: 'success' });
      fetchBookings();
    } catch (err) {
      setMsg({ text: err.response?.data || 'Cancel failed!', type: 'error' });
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.status === 'CANCELLED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
          CANCELLED
        </span>
      );
    }
    if (booking.status === 'COMPLETED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600">
          COMPLETED
        </span>
      );
    }
    if (booking.status === 'CONFIRMED' && booking.paid) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
          PAID
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
        CONFIRMED
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>

        {msg.text && (
          <div className={`px-4 py-2 rounded mb-4 text-sm font-medium
            ${msg.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'}`}>
            {msg.text}
          </div>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && bookings.length === 0 && (
          <p className="text-gray-500">You have not booked any rides yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start flex-wrap gap-4">

                {/* Left info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.ride?.source} to {booking.ride?.destination}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {booking.ride?.rideDate} | {booking.ride?.rideTime}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {booking.seatsBooked} seat(s) | {booking.ride?.driver?.carModel} | {booking.ride?.driver?.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {booking.pickupPoint} to {booking.dropoffPoint}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Your distance: {booking.passengerDistanceKm} km
                  </p>
                </div>

                {/* Right — fare, status, buttons */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-2xl font-bold text-blue-600">
                    Rs. {booking.totalFare}
                  </p>

                  {getStatusBadge(booking)}

                  {booking.status === 'CONFIRMED' && !booking.paid && (
                    <button
                      onClick={() => navigate(`/payment/${booking.id}`)}
                      className="bg-green-500 hover:bg-green-600 text-white
                        px-4 py-1 rounded-lg text-sm transition">
                      Pay Now
                    </button>
                  )}

                  {booking.status === 'CONFIRMED' && booking.paid && (
                    <span className="text-blue-600 text-sm font-medium">
                      Payment Done
                    </span>
                  )}

                  {booking.status === 'CONFIRMED' && !booking.paid && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white
                        px-4 py-1 rounded-lg text-sm transition">
                      Cancel Booking
                    </button>
                  )}
              {booking.status === 'COMPLETED' && (
                <button
                  onClick={() => navigate(`/review/${booking.id}`)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800
                    px-4 py-1 rounded-lg text-sm font-semibold transition">
                  Rate Ride
                </button>
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

export default MyBookings;