import proxy from "express-http-proxy";

export function createServiceProxy(target, prefix, servicePath) {
  return proxy(target, {
    proxyReqPathResolver: (req) => {
      const newPath = req.originalUrl.replace(new RegExp(`^${prefix}`), "");
      console.log("➡️ Proxy request:");
      console.log("  Method:", req.method);
      console.log("  Original URL:", req.originalUrl);
      console.log("  Target URL:", `${target}${newPath}`);
      console.log("  Headers:", req.headers);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log("  Body:", req.body);
      }
      const finalPath = servicePath ? servicePath + newPath : newPath;
      return `${target}${finalPath}` || "/";
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers["Authorization"] = srcReq.headers.authorization;
      }
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      console.log(`⬅️ Response from ${target}${req.originalUrl.replace(new RegExp(`^${prefix}`), "")} Status: ${proxyRes.statusCode}`);
      return proxyResData;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error("❌ Proxy error:", err.message);
      res.status(500).json({ error: "Erro no gateway" });
    },
  });
}
