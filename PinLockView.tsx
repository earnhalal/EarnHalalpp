import React, { useState, useEffect } from 'react';

interface PinLockViewProps {
  mode: 'enter' | 'set';
  onClose: () => void;
  onPinCorrect?: () => void;
  onPinSet?: (pin: string) => void;
  onSkip?: () => void;
  pinToVerify?: string;
}

const PinLockView: React.FC<PinLockViewProps> = ({ mode, onClose, onPinCorrect, onPinSet, onSkip, pinToVerify }) => {
  const [pin, setPin] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pin.length === 4) {
      if (mode === 'enter' && pinToVerify) {
        if (pin.join('') === pinToVerify) {
          onPinCorrect?.();
        } else {
          setError('Incorrect PIN. Please try again.');
          setTimeout(() => {
            setPin([]);
            setError('');
          }, 1000);
        }
      } else if (mode === 'set' && !isConfirming) {
        setIsConfirming(true);
      }
    }
    if (confirmPin.length === 4) {
      if (pin.join('') === confirmPin.join('')) {
        onPinSet?.(pin.join(''));
      } else {
        setError('PINs do not match. Please start over.');
        setTimeout(() => {
          setPin([]);
          setConfirmPin([]);
          setIsConfirming(false);
          setError('');
        }, 1500);
      }
    }
  }, [pin, confirmPin, mode, pinToVerify, onPinCorrect, onPinSet]);

  const handleKeyPress = (key: string) => {
    setError('');
    const targetPin = isConfirming ? confirmPin : pin;
    const setTargetPin = isConfirming ? setConfirmPin : setPin;

    if (key === 'backspace') {
      if (targetPin.length > 0) {
        setTargetPin(targetPin.slice(0, -1));
      }
    } else if (targetPin.length < 4) {
      setTargetPin([...targetPin, key]);
    }
  };

  const PinDots: React.FC<{ length: number }> = ({ length }) => (
    <div className="flex justify-center space-x-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-colors ${
            i < length ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
          } ${error ? '!bg-red-500' : ''}`}
        ></div>
      ))}
    </div>
  );
  
  const title = mode === 'enter' 
    ? 'Enter Your PIN' 
    : isConfirming ? 'Confirm Your PIN' : 'Set a 4-Digit PIN';

  const currentPin = isConfirming ? confirmPin : pin;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-6 text-center border-b dark:border-gray-700 relative">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="p-8">
          <PinDots length={currentPin.length} />
          {error && <p className="text-red-500 text-sm text-center mt-4 h-5">{error}</p>}
          {!error && <div className="h-5 mt-4"></div>}

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[...Array(9)].map((_, i) => (
              <button key={i+1} onClick={() => handleKeyPress(String(i+1))} className="p-4 rounded-full text-2xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                {i + 1}
              </button>
            ))}
             <div />
             <button onClick={() => handleKeyPress('0')} className="p-4 rounded-full text-2xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                0
              </button>
             <button onClick={() => handleKeyPress('backspace')} className="p-4 rounded-full text-lg font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                &larr;
              </button>
          </div>
          {mode === 'set' && !isConfirming && (
             <button onClick={onSkip} className="w-full mt-6 text-sm text-gray-500 hover:text-primary-500">
                Skip For Now
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinLockView;
