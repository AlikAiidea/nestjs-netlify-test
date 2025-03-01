/// <reference types="node" />
export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
        environment: string;
    };
    detailed(): {
        status: string;
        timestamp: string;
        version: string;
        nodejs: string;
        memory: {
            rss: string;
            heapTotal: string;
            heapUsed: string;
        };
        uptime: number;
        environment: string;
    };
    echo(): {
        timestamp: string;
        message: string;
        serverInfo: {
            platform: NodeJS.Platform;
            arch: NodeJS.Architecture;
            nodeVersion: string;
        };
    };
}
