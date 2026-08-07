export interface UserSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class AuthSessionManager {
  private currentSession: UserSession | null = null;

  setSession(session: UserSession | null) {
    this.currentSession = session;
  }

  getSession(): UserSession | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return Boolean(this.currentSession?.token);
  }

  logout() {
    this.currentSession = null;
  }
}

export const authSession = new AuthSessionManager();
