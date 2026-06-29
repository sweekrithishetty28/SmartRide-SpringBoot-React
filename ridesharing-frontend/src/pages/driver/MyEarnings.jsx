import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const MyEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get('/payment/my-earnings')
      .then(res => {
        setEarnings(res.data);
        const sum = res.data.reduce((acc, p) => acc + p.amount, 0);
        setTotal(sum.toFixed(2));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Earnings 💰</h2>

        {/* Total earnings card */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-blue-100 text-sm mb-1">Total Earnings</p>
          <p className="text-4xl font-bold">₹{total}</p>
          <p className="text-blue-100 text-sm mt-1">
            From {earnings.length} completed rides
          </p>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && earnings.length === 0 && (
          <p className="text-gray-500">
            No earnings yet. Complete rides to receive payments!
          </p>
        )}

        <div className="space-y-4">
          {earnings.map(payment => (
            <div key={payment.id}
              className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">
                  {payment.booking?.ride?.source} → {payment.booking?.ride?.destination}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  👤 Passenger: {payment.passenger?.name}
                </p>
                <p className="text-gray-500 text-sm">
                  📅 Ride: {payment.booking?.ride?.rideDate}
                </p>
                {payment.driverPaidAt && (
                  <p className="text-gray-400 text-xs mt-1">
                    💸 Paid to you: {new Date(payment.driverPaidAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  +₹{payment.amount}
                </p>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                  PAID
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;