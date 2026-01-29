import { useState } from 'react';
import { NumberPad } from '../ui/NumberPad';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Model3DViewer } from '../ui/Model3DViewer';

export function PhoneInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleNumberClick = (num: string) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleNext = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true);
      try {
        const formattedPhone = `+1${phoneNumber}`;
        await sendOTP(formattedPhone);
        navigate('/verify-otp', { state: { phoneNumber: formattedPhone } });
      } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send verification code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkip = () => {
    // Set a mock user for testing
    setUser({
      id: 'test-user-' + Date.now(),
      phoneNumber: '+1 (555) 000-0000',
      totalCoins: 0,
      collectedCoins: [],
      createdAt: new Date(),
    });
    navigate('/wallet');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-6 py-12 safe-top safe-bottom">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8">
          Enter your
          <br />
          phone number
        </h1>

        <div className="text-3xl mb-8 text-white">
          <span className="text-gray-500">+1 </span>
          <span>{phoneNumber || ''}</span>
          <span className="animate-pulse">|</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShow3DViewer(true)}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-full font-bold text-sm transition-all mb-4"
        >
          🌍 View 3D Model
        </button>

        <p className="text-center text-sm text-gray-400 mb-6">
          We care about <span className="text-primary-500">your privacy</span> and won't share it.
        </p>

        <Button onClick={handleNext} disabled={phoneNumber.length !== 10 || isLoading}>
          {isLoading ? 'Sending...' : 'Next'}
        </Button>

        <button
          onClick={handleSkip}
          className="w-full text-gray-400 hover:text-white py-3 text-sm transition-colors"
        >
          Skip for now (Testing)
        </button>

        <NumberPad onNumberClick={handleNumberClick} onBackspace={handleBackspace} />
      </div>

      <div id="recaptcha-container"></div>

      {/* 3D Model Viewer Modal */}
      {show3DViewer && <Model3DViewer onClose={() => setShow3DViewer(false)} />}
    </div>
  );
}
