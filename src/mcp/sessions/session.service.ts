import { Injectable } from '@nestjs/common';
import { McpSession } from './session.interface';

@Injectable()
export class SessionService {
    private session: McpSession | null = null;

    setSession(session: McpSession) {
        this.session = session;
    }

    getSession() {
        return this.session;
    }

    clearSession() {
        this.session = null;
    }

    isLoggedIn() {
        return this.session !== null;
    }
}
