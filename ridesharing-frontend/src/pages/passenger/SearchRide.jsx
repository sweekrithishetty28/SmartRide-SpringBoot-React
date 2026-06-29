import { useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const SearchRide = () => {
  const [form, setForm] = useState({ source: '', destination: '', date: '' });
  const [rides, setRides] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState({ text: '', type: '' });
  const [seatSelections, setSeatSelections] = useState({});
  const [pickupDropoff, setPickupDropoff] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSeatChange = (rideId, value) => {
    setSeatSelections({ ...seatSelections, [rideId]: value });
  };

  const handlePickupChange = (rideId, field, value) => {
    setPickupDropoff({
      ...pickupDropoff,
      [rideId]: { ...pickupDropoff[rideId], [field]: value }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBookingMsg({ text: '', type: '' });
    try {
      const res = await axios.get('/rides/search', { params: form });
      setRides(res.data);
      setSearched(true);
      const defaults = {};
      res.data.forEach(r => defaults[r.id] = 1);
      setSeatSelections(defaults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleBook = async (ride) => {
   const seatsBooked = parseInt(seatSelections[ride.id]) || 1;

   // Use entered values OR fallback to full route
   const pickup = pickupDropoff[ride.id]?.pickup?.trim() || ride.source;
   const dropoff = pickupDropoff[ride.id]?.dropoff?.trim() || ride.destination;

   try {
     const res = await axios.post('/rides/book', {
       rideId: ride.id,
       seatsBooked: seatsBooked,
       pickupPoint: pickup,
       dropoffPoint: dropoff
     });
     setBookingMsg({ text: res.data, type: 'success' });
     const updated = await axios.get('/rides/search', { params: form });
     setRides(updated.data);
   } catch (err) {
     setBookingMsg({
       text: err.response?.data || 'Booking failed!',
       type: 'error'
     });
   }
 };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Search a Ride 🔍</h2>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input name="source" placeholder="From" value={form.source}
              onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="destination" placeholder="To" value={form.destination}
              onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="date" type="date" value={form.date}
              onChange={handleChange} required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Booking message */}
        {bookingMsg.text && (
          <div className={`px-4 py-2 rounded mb-4 text-sm font-medium
            ${bookingMsg.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'}`}>
            {bookingMsg.text}
          </div>
        )}

        {searched && rides.length === 0 && (
          <p className="text-gray-500">No rides found for this route.</p>
        )}

        {/* Ride Cards */}
        <div className="space-y-4">
          {rides.map(ride => (
            <div key={ride.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start flex-wrap gap-4">

                {/* Ride Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ride.source} → {ride.destination}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 {ride.rideDate} &nbsp;|&nbsp; 🕐 {ride.rideTime}
                  </p>
                  <p className="text-gray-500 text-sm">
                    💺 {ride.availableSeats} seats &nbsp;|&nbsp;
                    🚗 {ride.driver?.carModel} &nbsp;|&nbsp;
                    👤 {ride.driver?.name}
                  </p>
                  {ride.distanceKm && (
                    <p className="text-gray-500 text-sm">
                      🛣️ Total route: {ride.distanceKm} km
                    </p>
                  )}

                  {/* ── Pickup / Dropoff inputs ── */}
                  <div className="mt-3 border-t pt-3 space-y-2">
                    <p className="text-xs text-gray-500 font-medium">
                      Your pickup & dropoff (leave blank for full route):
                    </p>
                    <div className="flex gap-2">
                      <input
                        placeholder={`Pickup (default: ${ride.source})`}
                        value={pickupDropoff[ride.id]?.pickup || ''}
                        onChange={(e) => handlePickupChange(ride.id, 'pickup', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                      <input
                        placeholder={`Dropoff (default: ${ride.destination})`}
                        value={pickupDropoff[ride.id]?.dropoff || ''}
                        onChange={(e) => handlePickupChange(ride.id, 'dropoff', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Price + Seat selector + Book */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{ride.pricePerSeat}
                    <span className="text-sm text-gray-400 font-normal"> /seat</span>
                  </p>

                  {/* Seat selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Seats:</label>
                    <select
                      value={seatSelections[ride.id] || 1}
                      onChange={(e) => handleSeatChange(ride.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                      {[...Array(ride.availableSeats)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-gray-400">
                    Final fare calculated on booking
                  </p>

                  <button
                    onClick={() => handleBook(ride)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchRide;