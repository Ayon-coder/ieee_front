const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
};

export type NamePosition = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type EventStyling = {
  namePosition?: NamePosition;
  width?: number;
  height?: number;
  fontColor?: string;
  fontFamily?: string;
  textSize?: number;
  svgUrl?: string;
};

export type EventRecord = {
  id: string;
  name: string;
  description?: string;
  date?: string;
  category?: string;
  imageUrl?: string;
  template?: {
    svgUrl?: string;
  };
  styling?: EventStyling;
};

export type ParticipantRecord = {
  name: string;
  position?: string;
};

export type SearchResponse = {
  found: boolean;
  data?: ParticipantRecord;
};

const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  },

  getEvents() {
    return this.request<EventRecord[]>('/events');
  },

  getEvent(eventId: string) {
    return this.request<EventRecord>(`/events/${eventId}`);
  },

  getEventTemplate(eventId: string) {
    return this.request<{ template: unknown; styling: EventStyling }>(`/events/${eventId}/template`);
  },

  getParticipants(eventId: string) {
    return this.request<ParticipantRecord[]>(`/events/${eventId}/participants`);
  },

  searchStudent(name: string, eventId: string) {
    return this.request<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({ name, eventId }),
    });
  },

  healthCheck() {
    return this.request<{ status: string; firebase: string; timestamp: string }>('/health');
  }
};

export const api = apiClient;
