# Angular Project: Deploy a Secure SSR Website Using Nonce CSP

This project demonstrates how to build and deploy a secure Angular website using Server-Side Rendering (SSR) with a Content Security Policy (CSP) leveraging nonce values.

## Key Features

1. **Server-Side Rendering (SSR)**: Utilize Angular Universal for improved performance, SEO optimization, and fast page rendering from the server.  
2. **Content Security Policy (CSP)**: Implement robust CSP to prevent common attacks such as cross-site scripting (XSS). Nonces are dynamically generated to allow secure execution of required scripts.  
3. **Enhanced Security**: Integrate additional security measures like secure HTTP headers, strict cookie handling, and reduced attack surface.  
4. **Modular Architecture**: A well-structured project making it easy to add new features while adhering to Angular best practices.  
5. **Customizable and Extensible**: Provides a strong foundation for developers to customize and extend the application for specific needs.

## Technologies and Tools Used

- **Angular 19**: Front-end framework for building modern web applications.  
- **Angular Universal**: Tool to enable SSR in Angular applications.  
- **Node.js + Express**: Server used for SSR rendering and dynamic CSP management.  
- **CSP Nonce Middleware**: Secure nonce generation and automatic injection into SSR templates.  

## Running the current server

1. ```npm run build & node dist/angular-ssr/server/server.mjs```

2. If the message ```If you are seeing this, your server is secured with CSP nonce! Great work!``` appears in console, it's ok !


## How to build and deploy your Angular project ?


1. **Create an Angular Project with SSR:**
   First, create your Angular project with the SSR (Server-Side Rendering) option enabled by running the following command:
   ```bash
   ng new your-project-name --ssr
   ```

2. **Build Your Project:**
   When you are ready to deploy your Angular application, build the project by running:
   ```bash
   npm run build
   ```
   This command will compile your project and generate a `dist/` directory containing:
   - `browser`: The static files for your website (client-side assets).
   - `server`: The server-side files needed for SSR, including the Node.js server to handle SSR rendering.

3. **Run the Server:**
   To start your SSR application, execute the following Node.js command:
   ```bash
   node dist/your-project-name/server/server.mjs
   ```
   After running this command, your SSR Angular application should be up and running.

4. **Secure and Maintain Your Deployment:**
   To secure and optimize the performance of your deployment, you can use a reverse proxy with **NGINX** along with **pm2** for managing the server process. Here's a basic setup:
   - **NGINX**: Acts as a reverse proxy to forward client requests to your Node.js server.
   - **pm2**: A process manager for Node.js applications that ensures your server runs in the background and restarts automatically in case of crashes.
