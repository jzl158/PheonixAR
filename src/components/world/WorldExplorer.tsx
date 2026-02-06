import { useState } from 'react';
import { generateWorld, pollOperationStatus } from '../../services/worldLabsService';
import type { OperationStatusResponse } from '../../services/worldLabsService';

interface WorldExplorerProps {
  onClose: () => void;
}

const PRESET_PROMPTS = [
  {
    name: "Mystical Forest",
    prompt: "A mystical forest with glowing mushrooms, ethereal mist, and ancient trees",
  },
  {
    name: "Cyberpunk City",
    prompt: "A futuristic cyberpunk city with neon lights, flying vehicles, and towering skyscrapers",
  },
  {
    name: "Underwater Ruins",
    prompt: "Ancient underwater ruins with coral reefs, tropical fish, and sunbeams piercing through the water",
  },
  {
    name: "Desert Oasis",
    prompt: "A serene desert oasis with palm trees, crystal clear water, and golden sand dunes",
  },
];

export function WorldExplorer({ onClose }: WorldExplorerProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [worldUrl, setWorldUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerate = async (name: string, prompt: string) => {
    setIsGenerating(true);
    setGenerationStatus('Initializing world generation...');
    setError('');
    setWorldUrl('');

    console.log('🌍 Starting world generation:', { name, prompt });

    // Start generation
    const result = await generateWorld(name, prompt);

    if (result.status === 'failed' || !result.operation_id) {
      setError(result.error || 'Failed to start world generation');
      setIsGenerating(false);
      return;
    }

    setGenerationStatus('World generation in progress... This may take a few minutes.');

    // Poll for completion
    await pollOperationStatus(
      result.operation_id,
      (status: OperationStatusResponse) => {
        console.log('📊 Status update:', status);

        if (status.status === 'processing') {
          setGenerationStatus('Generating your world... Please wait.');
        } else if (status.status === 'completed' && status.world) {
          setGenerationStatus('World generated successfully!');
          setWorldUrl(status.world.world_url);
          setIsGenerating(false);
        } else if (status.status === 'failed') {
          setError(status.error || 'World generation failed');
          setIsGenerating(false);
        }
      },
      180, // max 180 attempts = 15 minutes (world generation takes 5-15 minutes)
      5000 // check every 5 seconds
    );
  };

  const handlePresetClick = (preset: typeof PRESET_PROMPTS[0]) => {
    handleGenerate(preset.name, preset.prompt);
  };

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) {
      setError('Please enter a world description');
      return;
    }
    const name = displayName.trim() || 'Custom World';
    handleGenerate(name, customPrompt);
  };

  return (
    <div className="fixed inset-0 bg-[#0F0428] z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#E6C787]/20">
        <h1 className="text-2xl font-bold text-white">World Explorer</h1>
        <button onClick={onClose} className="text-[#E6C787] text-2xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        {!worldUrl && !isGenerating && (
          <>
            {/* Preset Worlds */}
            <div className="mb-8">
              <h2 className="text-white text-xl font-bold mb-4">Explore Preset Worlds</h2>
              <div className="grid grid-cols-2 gap-4">
                {PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetClick(preset)}
                    className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white p-4 rounded-2xl transition-all font-semibold"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom World */}
            <div>
              <h2 className="text-white text-xl font-bold mb-4">Create Your Own World</h2>
              <input
                type="text"
                placeholder="World Name (optional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl mb-3 border-2 border-gray-700 focus:border-[#E6C787] outline-none"
              />
              <textarea
                placeholder="Describe your world... (e.g., A magical castle floating in the clouds)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl mb-4 border-2 border-gray-700 focus:border-[#E6C787] outline-none resize-none"
              />
              <button
                onClick={handleCustomGenerate}
                className="w-full bg-[#E6C787] hover:bg-[#E6C787]/90 text-gray-900 font-bold py-3 rounded-full transition-colors"
              >
                Generate World
              </button>
            </div>
          </>
        )}

        {/* Generation Status */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-pulse">🌍</div>
            <p className="text-white text-xl mb-2">Creating Your World</p>
            <p className="text-gray-400 mb-2">{generationStatus}</p>
            <p className="text-yellow-400 text-sm mb-4">⏱️ World generation typically takes 5-15 minutes</p>
            <p className="text-gray-500 text-xs mb-6">Please keep this page open while your world is being created...</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E6C787] border-t-transparent"></div>
            </div>
            <button
              onClick={() => {
                setIsGenerating(false);
                setError('');
                setCustomPrompt('');
                setDisplayName('');
              }}
              className="mt-8 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* World Viewer */}
        {worldUrl && !isGenerating && (
          <div>
            <div className="bg-gray-800 rounded-2xl p-4 mb-4">
              <p className="text-green-400 text-center mb-4 font-semibold">✅ {generationStatus}</p>
              <iframe
                src={worldUrl}
                className="w-full h-[500px] rounded-xl border-4 border-[#E6C787]"
                title="Generated World"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => {
                setWorldUrl('');
                setGenerationStatus('');
                setCustomPrompt('');
                setDisplayName('');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition-colors"
            >
              Generate Another World
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-900/50 border-2 border-red-500 text-red-200 px-4 py-3 rounded-xl">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
