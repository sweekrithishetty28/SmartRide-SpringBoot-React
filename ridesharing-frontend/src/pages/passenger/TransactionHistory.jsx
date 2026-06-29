import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const TransactionHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    axios.get('/payment/my-payments')
      .then(res => {
        setPayments(res.data);
        const spent = res.data
          .filter(p => p.status === 'SUCCESS')
          .reduce((acc, p) => acc + p.amount, 0);
        const distance = res.data
          .reduce((acc, p) => acc + (p.booking?.passengerDistanceKm || 0), 0);
        setTotalSpent(spent.toFixed(2));
        setTotalDistance(distance.toFixed(1));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const downloadReceipt = (payment) => {
    const name = localStorage.getItem('name');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${payment.razorpayOrderId}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #2563EB; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
          .label { color: #666; }
          .value { font-weight: 600; }
          .total { display: flex; justify-content: space-between; padding: 15px 0; font-size: 20px; font-weight: bold; color: #2563EB; margin-top: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
          .badge { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🚗 SmartRide</div>
          <p style="color:#666; margin-top:5px">Payment Receipt</p>
        </div>
        <div class="row">
          <span class="label">Transaction ID</span>
          <span class="value">${payment.razorpayPaymentId || 'N/A'}</span>
        </div>
        <div class="row">
          <span class="label">Order ID</span>
          <span class="value">${payment.razorpayOrderId}</span>
        </div>
        <div class="row">
          <span class="label">Date</span>
          <span class="value">${payment.paidAt
            ? new Date(payment.paidAt).toLocaleString('en-IN')
            : new Date(payment.createdAt).toLocaleString('en-IN')}</span>
        </div>
        <div class="row">
          <span class="label">Passenger</span>
          <span class="value">${name}</span>
        </div>
        <div class="row">
          <span class="label">Route</span>
          <span class="value">
            ${payment.booking?.ride?.source} → ${payment.booking?.ride?.destination}
          </span>
        </div>
        <div class="row">
          <span class="label">Pickup → Dropoff</span>
          <span class="value">
            ${payment.booking?.pickupPoint} → ${payment.booking?.dropoffPoint}
          </span>
        </div>
        <div class="row">
          <span class="label">Distance</span>
          <span class="value">${payment.booking?.passengerDistanceKm} km</span>
        </div>
        <div class="row">
          <span class="label">Seats</span>
          <span class="value">${payment.booking?.seatsBooked}</span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="badge">${payment.status}</span>
        </div>
        <div class="total">
          <span>Total Paid</span>
          <span>₹${payment.amount?.toFixed(2)}</span>
        </div>
        <div class="footer">
          <p>Thank you for choosing SmartRide!</p>
          <p>🔒 Secured by Razorpay</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartRide-Receipt-${payment.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            💳 Transaction History
          </h2>
          <p className="text-gray-500 mt-1">View all your payments and receipts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg text-2xl">📊</div>
            <div>
              <p className="text-gray-500 text-sm">Total Rides</p>
              <p className="text-2xl font-bold text-gray-800">
                {payments.filter(p => p.status === 'SUCCESS').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg text-2xl">💰</div>
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalSpent}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg text-2xl">🛣️</div>
            <div>
              <p className="text-gray-500 text-sm">Total Distance</p>
              <p className="text-2xl font-bold text-gray-800">{totalDistance} km</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg text-2xl">🧾</div>
            <div>
              <p className="text-gray-500 text-sm">Avg Fare</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{payments.length > 0
                  ? (payments
                      .filter(p => p.status === 'SUCCESS')
                      .reduce((a, p) => a + p.amount, 0) /
                    (payments.filter(p => p.status === 'SUCCESS').length || 1)
                  ).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
          </div>

          {payments.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-5xl mb-4">🧾</p>
              <p className="text-gray-500">No transactions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          payment.paidAt || payment.createdAt
                        ).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {payment.booking?.ride?.source} →{' '}
                        {payment.booking?.ride?.destination}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.booking?.passengerDistanceKm} km
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        ₹{payment.amount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${payment.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-700'
                            : payment.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'SUCCESS' ? (
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="flex items-center gap-1 text-blue-600
                              hover:text-blue-800 text-sm font-medium transition">
                            ⬇️ Download
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;