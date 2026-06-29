import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);
};

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptReady(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptReady(true);
      script.onerror = () => setError('Failed to load payment gateway!');
      document.body.appendChild(script);
    }

    axios.get('/rides/my-bookings')
      .then(res => {
        const found = res.data.find(b => b.id === parseInt(bookingId));
        if (found) {
          setBooking(found);
        } else {
          setError('Booking not found!');
        }
      })
      .catch(() => setError('Failed to load booking!'))
      .finally(() => setPageLoading(false));
  }, [bookingId]);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      if (!window.Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh!');
      }

      const res = await axios.post(`/payment/create-order/${bookingId}`);
      const orderData = typeof res.data === 'string'
        ? JSON.parse(res.data)
        : res.data;

      console.log('Order created:', orderData);

      const mobile = isMobile();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'SmartRide',
        description: booking?.ride?.source + ' to ' + booking?.ride?.destination,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.passengerName || '',
          email: orderData.passengerEmail || '',
          contact: '9999999999',
          vpa: 'success@razorpay',
        },
        theme: { color: '#2563EB' },
        config: {
          display: {
            blocks: {
              upi_block: {
                name: 'Pay via UPI (Recommended)',
                instruments: mobile
                  ? [
                      { method: 'upi', flows: ['intent'], apps: ['google_pay'] },
                      { method: 'upi', flows: ['intent'], apps: ['phonepe'] },
                      { method: 'upi', flows: ['intent'], apps: ['paytm'] },
                      { method: 'upi', flows: ['collect'] },
                    ]
                  : [
                      { method: 'upi', flows: ['collect'] },
                    ],
              },
              card_block: {
                name: 'Pay via Card',
                instruments: [{ method: 'card' }],
              },
              other_block: {
                name: 'Other Methods',
                instruments: [
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.upi_block', 'block.card_block', 'block.other_block'],
            preferences: { show_default_blocks: false },
          },
        },
        handler: async (response) => {
          console.log('Payment success:', response);
          try {
            await axios.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            navigate('/payment-success');
          } catch {
            setError('Payment verification failed!');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Please try again.');
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setError('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      razorpay.open();

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Complete Payment
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {booking && (
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Payment Summary
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Route</span>
                <span className="font-semibold text-gray-800">
                  {booking.ride?.source} to {booking.ride?.destination}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-gray-800">
                  {booking.ride?.rideDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pickup to Dropoff</span>
                <span className="font-semibold text-gray-800">
                  {booking.pickupPoint} to {booking.dropoffPoint}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Your Distance</span>
                <span className="font-semibold text-gray-800">
                  {booking.passengerDistanceKm} km
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Seats Booked</span>
                <span className="font-semibold text-gray-800">
                  {booking.seatsBooked}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Driver</span>
                <span className="font-semibold text-gray-800">
                  {booking.ride?.driver?.name}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                <span className="font-bold text-blue-600 text-2xl">
                  Rs. {booking.totalFare?.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mb-4">
              {isMobile()
                ? 'Mobile: UPI apps will appear (GPay, PhonePe, Paytm)'
                : 'Desktop: Enter UPI ID - success@razorpay (no OTP needed)'}
            </p>

            <button
              onClick={handlePayment}
              disabled={loading || !scriptReady}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white text-lg
                transition flex items-center justify-center gap-2
                ${loading || !scriptReady
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12"
                      r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing...
                </>
              ) : !scriptReady ? (
                'Loading payment gateway...'
              ) : (
                'Pay Rs. ' + booking.totalFare?.toFixed(2)
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Secured by Razorpay
            </p>
            <p className="text-center text-xs text-gray-400 mt-1">
              UPI / GPay / PhonePe / Card / Netbanking
            </p>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 space-y-2">
              <p className="font-bold text-sm">Test Credentials</p>
              <div className="bg-white rounded-lg p-3 space-y-2">
                <p>
                  <span className="font-semibold">UPI (No OTP required):</span>
                  <span className="font-mono ml-2 bg-green-100 px-2 py-0.5 rounded">
                    success@razorpay
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Card Number:</span>
                  <span className="font-mono ml-2">4111 1111 1111 1111</span>
                </p>
                <p>
                  <span className="font-semibold">Expiry:</span>
                  <span className="ml-2">12/28</span>
                  <span className="font-semibold ml-4">CVV:</span>
                  <span className="ml-2">123</span>
                </p>
                <p>
                  <span className="font-semibold">OTP (if asked):</span>
                  <span className="font-mono ml-2 bg-blue-100 px-2 py-0.5 rounded">
                    123456
                  </span>
                </p>
              </div>
              <p className="text-center text-yellow-600 font-medium">
                Use UPI ID for instant payment without OTP!
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;