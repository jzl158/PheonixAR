/**
 * World Labs API Service
 * Generate and explore 3D worlds using World Labs Marble API
 */

const WORLD_LABS_API_KEY = import.meta.env.VITE_WORLD_LABS_API_KEY;
const WORLD_LABS_BASE_URL = 'https://api.worldlabs.ai/marble/v1';

export interface WorldGenerationRequest {
  display_name: string;
  text_prompt: string;
}

export interface WorldGenerationResponse {
  operation_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  world_url?: string;
  error?: string;
}

export interface OperationStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  world?: {
    id: string;
    display_name: string;
    world_url: string;
    thumbnail_url?: string;
  };
  error?: string;
}

/**
 * Generate a new 3D world from a text prompt
 * @param displayName Display name for the world
 * @param textPrompt Description of the world to generate
 * @returns Operation ID for tracking generation status
 */
export async function generateWorld(
  displayName: string,
  textPrompt: string
): Promise<WorldGenerationResponse> {
  try {
    // Debug: Check if API key is loaded
    if (!WORLD_LABS_API_KEY) {
      console.error('❌ World Labs API key not found in environment variables');
      return {
        operation_id: '',
        status: 'failed',
        error: 'API key not configured. Please add VITE_WORLD_LABS_API_KEY to .env',
      };
    }

    console.log('🔑 World Labs API key loaded:', WORLD_LABS_API_KEY.substring(0, 8) + '...');
    console.log('🌍 Generating world:', { displayName, textPrompt });

    const response = await fetch(`${WORLD_LABS_BASE_URL}/worlds:generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'WLT-Api-Key': WORLD_LABS_API_KEY,
      },
      body: JSON.stringify({
        display_name: displayName,
        world_prompt: {
          type: 'text',
          text_prompt: textPrompt,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ World Labs API error:', response.status, response.statusText);
      console.error('❌ Error response body:', errorBody);
      return {
        operation_id: '',
        status: 'failed',
        error: `API error: ${response.status} ${response.statusText}. ${errorBody}`,
      };
    }

    const data = await response.json();
    console.log('✅ World generation started:', JSON.stringify(data, null, 2));

    const operationId = data.operation_id || data.name?.split('/').pop() || '';
    console.log('📝 Extracted operation ID:', operationId);

    if (!operationId) {
      console.error('⚠️ No operation ID found in response. Response keys:', Object.keys(data));
    }

    return {
      operation_id: operationId,
      status: 'pending',
    };
  } catch (error) {
    console.error('❌ Error generating world:', error);
    return {
      operation_id: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check the status of a world generation operation
 * @param operationId Operation ID from generateWorld
 * @returns Current status and world URL if completed
 */
export async function checkOperationStatus(
  operationId: string
): Promise<OperationStatusResponse> {
  try {
    console.log('📊 Checking operation status:', operationId);

    const response = await fetch(
      `${WORLD_LABS_BASE_URL}/operations/${operationId}`,
      {
        method: 'GET',
        headers: {
          'WLT-Api-Key': WORLD_LABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ World Labs API error:', response.status, response.statusText);
      console.error('❌ Error response body:', errorBody);
      return {
        status: 'failed',
        error: `API error: ${response.status} ${response.statusText}. ${errorBody}`,
      };
    }

    const data = await response.json();
    console.log('📊 Operation status response:', JSON.stringify(data, null, 2));
    console.log('📊 Response structure check:', {
      hasDone: 'done' in data,
      doneValue: data.done,
      hasResponse: 'response' in data,
      hasWorld: data.response?.world,
      hasError: 'error' in data,
      allKeys: Object.keys(data),
    });

    // Parse the response based on World Labs API format
    if (data.done === true && data.response?.world) {
      console.log('✅ World generation completed!', data.response.world);
      return {
        status: 'completed',
        world: {
          id: data.response.world.id || operationId,
          display_name: data.response.world.display_name || 'Untitled World',
          world_url: data.response.world.world_url || '',
          thumbnail_url: data.response.world.thumbnail_url,
        },
      };
    } else if (data.done === false) {
      console.log('⏳ World generation still in progress...');
      return {
        status: 'processing',
      };
    } else if (data.error) {
      console.log('❌ World generation failed:', data.error);
      return {
        status: 'failed',
        error: data.error.message || 'Generation failed',
      };
    }

    console.log('⚠️ Unexpected response format, treating as pending');
    return {
      status: 'pending',
    };
  } catch (error) {
    console.error('❌ Error checking operation status:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Poll operation status until completion or failure
 * @param operationId Operation ID to poll
 * @param onUpdate Callback for status updates
 * @param maxAttempts Maximum polling attempts (default: 60)
 * @param intervalMs Polling interval in milliseconds (default: 5000)
 */
export async function pollOperationStatus(
  operationId: string,
  onUpdate: (status: OperationStatusResponse) => void,
  maxAttempts: number = 60,
  intervalMs: number = 5000
): Promise<OperationStatusResponse> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await checkOperationStatus(operationId);
    onUpdate(status);

    if (status.status === 'completed' || status.status === 'failed') {
      return status;
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return {
    status: 'failed',
    error: 'Timeout: World generation took too long',
  };
}
