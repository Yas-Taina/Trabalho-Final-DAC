import { createProxyMiddleware } from "http-proxy-middleware";

export function createServiceProxy(target) {
  console.log(`Proxying requests to: ${target}`);
  return createProxyMiddleware({
    target,
    changeOrigin: true,

    pathRewrite: (path) => path.replace(/^\/api\/[^/]+/, ""),

    onProxyReq: (proxyReq, req) => {
      console.log(`➡️  ${req.method} ${req.originalUrl} → ${target}${req.url}`);
      const authHeader = req.headers.authorization;

      if (authHeader) {
        proxyReq.setHeader("Authorization", authHeader);
      }

      console.log(`➡️  ${req.method} ${req.originalUrl} → ${target}${req.url}`);
    }
  });
}
