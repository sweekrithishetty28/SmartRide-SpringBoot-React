import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('/user/profile').then(res => {
      setProfile(res.data);
      setForm(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const [avgRating, setAvgRating] = useState(null);

useEffect(() => {
  axios.get('/user/profile').then(res => {
    setProfile(res.data);
    setForm(res.data);
    // If driver, get rating
    if (res.data.role === 'DRIVER') {
      axios.get(`/reviews/driver/${res.data.id}/rating`)
        .then(r => setAvgRating(r.data.averageRating));
    }
  });
}, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/user/profile', form);
      setMsg(res.data);
      setEditing(false);
      const updated = await axios.get('/user/profile');
      setProfile(updated.data);
      localStorage.setItem('name', updated.data.name);
    } catch (err) {
      setMsg('Update failed!');
    }
  };

  if (!profile) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile 👤</h2>

        {msg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {msg}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6">
          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-semibold text-gray-700">{profile.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-semibold text-gray-700">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-700">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Role</p>
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                    {profile.role}
                  </span>
                </div>
                {profile.role === 'DRIVER' && (
                  <>
                    <div>
                      <p className="text-gray-400">Car Model</p>
                      <p className="font-semibold text-gray-700">{profile.carModel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">License Plate</p>
                      <p className="font-semibold text-gray-700">{profile.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Seat Capacity</p>
                      <p className="font-semibold text-gray-700">{profile.seatCapacity}</p>
                    </div>
                  </>
                )}
            {profile.role === 'DRIVER' && avgRating !== null && (
              <div>
                <p className="text-gray-400">Average Rating</p>
                <p className="font-semibold text-yellow-500 text-lg">
                  {'★'.repeat(Math.round(avgRating))}
                  {'☆'.repeat(5 - Math.round(avgRating))}
                  <span className="text-gray-600 text-sm ml-2">
                    ({avgRating}/5)
                  </span>
                </p>
              </div>
            )}
              </div>
              <button
                onClick={() => setEditing(true)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input name="name" value={form.name || ''} onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="phone" value={form.phone || ''} onChange={handleChange}
                placeholder="Phone"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {profile.role === 'DRIVER' && (
                <>
                  <input name="carModel" value={form.carModel || ''} onChange={handleChange}
                    placeholder="Car Model"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input name="licensePlate" value={form.licensePlate || ''} onChange={handleChange}
                    placeholder="License Plate"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input name="seatCapacity" type="number" value={form.seatCapacity || ''} onChange={handleChange}
                    placeholder="Seat Capacity"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </>
              )}
              <div className="flex gap-3">
                <button type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;