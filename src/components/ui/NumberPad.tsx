interface NumberPadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
}

export function NumberPad({ onNumberClick, onBackspace }: NumberPadProps) {
  const buttons = [
    { value: '1', letters: '' },
    { value: '2', letters: 'ABC' },
    { value: '3', letters: 'DEF' },
    { value: '4', letters: 'GHI' },
    { value: '5', letters: 'JKL' },
    { value: '6', letters: 'MNO' },
    { value: '7', letters: 'PQRS' },
    { value: '8', letters: 'TUV' },
    { value: '9', letters: 'WXYZ' },
    { value: '+*#', letters: '', special: true },
    { value: '0', letters: '' },
    { value: '⌫', letters: '', special: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-1">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={() => {
            if (btn.value === '⌫') {
              onBackspace();
            } else if (!btn.special) {
              onNumberClick(btn.value);
            }
          }}
          className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-2xl h-16 flex flex-col items-center justify-center transition-colors"
        >
          <span className="text-2xl font-medium">{btn.value}</span>
          {btn.letters && (
            <span className="text-xs text-gray-400 mt-0.5">{btn.letters}</span>
          )}
        </button>
      ))}
    </div>
  );
}
