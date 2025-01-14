import 'zone.js';
import express from 'express';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule, createNodeRequestHandler } from '@angular/ssr/node';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as crypto from 'crypto';
import bootstrap from './main.server';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

/**
 * Initializes and configures an Express server for secure SSR (Server-Side Rendering) of an Angular application.
 */

const app = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = path.resolve(serverDistFolder, '../browser');
const indexHtml = path.join(browserDistFolder, 'index.csr.html');
const commonEngine = new CommonEngine();

/**
 * Generates a cryptographically secure nonce for Content Security Policy.
 * @returns {string} - A unique nonce string.
 */
function generateNonce(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Configure middleware

// Enable response compression
app.use(
    compression({
        level: 6, // Compression level
        threshold: 1024, // Minimum size (in bytes) for compression
    })
);

// Add a CSP nonce to every response
app.use((req, res, next) => {
    res.locals["cspNonce"] = generateNonce();
    next();
});

// Serve static files with optimized caching policies
app.use(
    express.static(browserDistFolder, {
        maxAge: '1y',
        cacheControl: true,
        etag: true,
        index: false,
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            }
        },
    })
);

// Serve assets
app.use('/assets', express.static(path.join(browserDistFolder)));

// Implement security headers using Helmet
app.use((req, res, next) => {
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "'strict-dynamic'", `'nonce-${res.locals["cspNonce"]}'`],
                "style-src": ["'self'", `'nonce-${res.locals["cspNonce"]}'`],
                "img-src": ["'self'", "data:", "blob:"],
                "connect-src": ["'self'"],
                "frame-ancestors": ["'none'"],
                "font-src": ["'self'", "data:"],
            },
        },
        referrerPolicy: { policy: 'no-referrer' },
        frameguard: { action: 'deny' },
    })(req, res, next);
});

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Enable HSTS headers for enhanced transport layer security
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
    })
);

// Handle SSR rendering for all routes
app.get('*', (req, res, next) => {
    const { protocol, originalUrl, headers } = req;

    commonEngine
        .render({
            bootstrap,
            documentFilePath: indexHtml,
            url: `${protocol}://${headers.host}${originalUrl}`,
            publicPath: browserDistFolder,
            providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
        })
        .then((html) => {
            const modifiedHtml = html.replace(/randomNonceGoesHere/g, `${res.locals["cspNonce"]}`);
            res.send(modifiedHtml);
        })
        .catch(next);
});

// Start the Express server if running as the main module
if (isMainModule(import.meta.url)) {
    const port = process.env['PORT'] || 5000;
    app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

// Export the request handler for use in other contexts
export const reqHandler = createNodeRequestHandler(app);