import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SessionService } from 'src/mcp/sessions/session.service';
import z from 'zod';

@Injectable()
export class LoginTool {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService,
    ) {}

    register(mcp: McpServer) {
        mcp.registerTool(
            'login',
            {
                title: 'login',
                description: 'Authenticate a user using email and password.',
                inputSchema: {
                    email: z.string().email(),
                    password: z.string(),
                },
            },
            async ({ email, password }) => {
                const user = await this.authService.loginUser({
                    email,
                    password,
                });

                this.sessionService.setSession({
                    userId: user._id.toString(),
                    email: user.email,
                });

                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Logged in successfully. Welcome ${user.fname} ${user.lname}!`,
                        },
                    ],
                };
            },
        );
    }
}
