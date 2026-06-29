import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import PostRide from './pages/driver/PostRide';
import MyRides from './pages/driver/MyRides';
import SearchRide from './pages/passenger/SearchRide';
import MyBookings from './pages/passenger/MyBookings';
import Profile from './pages/Profile';
import Payment from './pages/passenger/Payment';
import PaymentSuccess from './pages/passenger/PaymentSuccess';
import TransactionHistory from './pages/passenger/TransactionHistory';
import MyEarnings from './pages/driver/MyEarnings';
import SubmitReview from './pages/passenger/SubmitReview';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/post-ride" element={<PrivateRoute><PostRide /></PrivateRoute>} />
        <Route path="/my-rides" element={<PrivateRoute><MyRides /></PrivateRoute>} />
        <Route path="/search-ride" element={<PrivateRoute><SearchRide /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/payment/:bookingId" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
        <Route path="/my-earnings" element={<PrivateRoute><MyEarnings /></PrivateRoute>} />
        <Route path="/review/:bookingId" element={
          <PrivateRoute><SubmitReview /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;