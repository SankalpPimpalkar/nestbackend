import { All, Controller, OnModuleInit, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { McpService } from './mcp.service';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

@Controller('mcp')
export class McpController implements OnModuleInit {
    private transport: StreamableHTTPServerTransport;

    constructor(private readonly mcpService: McpService) {
        this.transport = new StreamableHTTPServerTransport();
    }

    async onModuleInit() {
        await this.mcpService.getServer().connect(this.transport);
    }

    @All()
    async handle(@Req() req: Request, @Res() res: Response) {
        await this.transport.handleRequest(req, res);
    }
}
