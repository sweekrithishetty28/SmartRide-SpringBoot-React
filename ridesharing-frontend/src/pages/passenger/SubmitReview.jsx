import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';

const SubmitReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/reviews/submit', {
        bookingId: parseInt(bookingId),
        rating,
        comment
      });
      setSuccess(res.data);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to submit review!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Rate Your Ride
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 px-4 py-2 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rating
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none">
                    {star <= (hoveredRating || rating) ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
                {rating === 0 && 'Select a rating'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white
                font-semibold py-2 rounded-lg transition">
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600
                font-semibold py-2 rounded-lg transition">
              Skip
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;