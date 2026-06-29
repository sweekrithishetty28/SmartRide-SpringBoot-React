import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow p-10">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mb-6">
            Your ride is confirmed. Have a great trip!
          </p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;