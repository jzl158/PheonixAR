import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NumberPad } from '../ui/NumberPad';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function OTPVerification() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();
  const phoneNumber = location.state?.phoneNumber || '';

  const handleNumberClick = (num: string) => {
    if (code.length < 6) {
      setCode(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleNext = async () => {
    if (code.length === 6) {
      setIsLoading(true);
      try {
        await verifyOTP(code);
        navigate('/map');
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Invalid verification code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 7) return phone;
    const last4 = phone.slice(-4);
    const areaCode = phone.slice(0, 5);
    return `${areaCode}) ***-${last4}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-6 py-12 safe-top safe-bottom">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">
          Please enter the code
        </h1>
        <p className="text-gray-400 mb-8">
          Sent to {maskPhoneNumber(phoneNumber)}
        </p>

        <div className="text-5xl mb-8 text-white tracking-wider">
          {code || ''}
          <span className="animate-pulse">|</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button onClick={handleNext} disabled={code.length !== 6 || isLoading}>
          {isLoading ? 'Verifying...' : 'Next'}
        </Button>

        <NumberPad onNumberClick={handleNumberClick} onBackspace={handleBackspace} />
      </div>
    </div>
  );
}
