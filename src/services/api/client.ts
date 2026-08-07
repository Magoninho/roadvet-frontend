export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.roadvet.com.br/v1') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    // Placeholder HTTP GET request for backend API
    return { data: [] as any, status: 200 };
  }

  async post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    // Placeholder HTTP POST request for backend API
    return { data: body as T, status: 201 };
  }

  async pushSyncChanges(changes: any): Promise<void> {
    // Endpoint for WatermelonDB sync push
    console.log('[Sync Engine] Pushing local changes to backend:', changes);
  }

  async pullSyncChanges(lastPulledAt: number | null): Promise<{ changes: any; timestamp: number }> {
    // Endpoint for WatermelonDB sync pull
    console.log('[Sync Engine] Pulling remote changes since:', lastPulledAt);
    return {
      changes: {
        tutores: { created: [], updated: [], deleted: [] },
        pets: { created: [], updated: [], deleted: [] },
        prontuarios: { created: [], updated: [], deleted: [] },
      },
      timestamp: Date.now(),
    };
  }
}

export const apiClient = new ApiClient();
