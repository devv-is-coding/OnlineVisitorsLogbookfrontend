import {
  CreateVisitorData,
  UpdateVisitorData,
  LoginData,
  Visitor,
  Admin,
  ApiResponse,
} from '@/types';

const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
  private csrfInitialized = false;

  private async ensureCsrf(): Promise<void> {
    if (this.csrfInitialized) return;
    await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
    this.csrfInitialized = true;
  }

  private getCookie(name: string): string | null {
    const m = document.cookie.match(new RegExp(`(^|;)\\s*${name}=([^;]+)`));
    return m ? decodeURIComponent(m[2]) : null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    await this.ensureCsrf();

    const xsrfToken = this.getCookie('XSRF-TOKEN') || '';

    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': xsrfToken,
          ...(options.headers ?? {}),
        },
        ...options,
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson && response.status !== 204 ? await response.json() : null;

      if (!response.ok) {
        return { success: false, message: data?.message || 'An error occurred', errors: data?.errors || {} };
      }

      return { success: true, data } as ApiResponse<T>;
    } catch (e) {
      return { success: false, message: 'Network error occurred', errors: {} };
    }
  }

  // ---------------- Visitor Endpoints ----------------
  async getVisitors() { return this.request<Visitor[]>('/visitor', { method: 'GET' }); }

  async createVisitor(data: CreateVisitorData) {
    return this.request<Visitor>('/visitor', { method: 'POST', body: JSON.stringify(data) });
  }

  async getVisitor(id: number) {
    return this.request<Visitor>(`/visitor/${id}/edit`, { method: 'GET' });
  }

  async updateVisitor(id: number, data: UpdateVisitorData) {
    return this.request<Visitor>(`/visitor/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteVisitor(id: number) {
    return this.request<void>(`/visitor/${id}`, { method: 'DELETE' });
  }

 async timeoutVisitor(id: number) {
  return this.request<Visitor>(`/visitor/${id}/timeout`, {
    method: 'PATCH',
    body: JSON.stringify({}), 
  });
}


  // ---------------- Admin Endpoints ----------------
  async login(data: LoginData) {
    return this.request<Admin>('/auth/adminLogin', { method: 'POST', body: JSON.stringify(data) });
  }

  async logout() {
    return this.request<void>('/auth/adminLogout', { method: 'POST' });
  }

  /**
   * Fetch admins & visitors for the dashboard.
   * The backend should respond with:
   * { "success": true, "data": { "admins": [...], "visitors": [...] } }
   */
async getAdminPanel(): Promise<ApiResponse<{ admins: Admin[]; visitors: Visitor[] }>> {
  const resp = await this.request<{ admins: Admin[]; visitors: Visitor[] }>('/admin', { method: 'GET' });

  if (!resp.success && resp.message === 'Unauthenticated.') {
    // Optionally clear any local auth state here
    window.location.href = '/adminLogin'; // Or navigate using your router
  }

  return resp;
}

}

export const apiClient = new ApiClient();
