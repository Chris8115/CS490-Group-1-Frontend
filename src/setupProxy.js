const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

    app.use(
        '/api/betteru',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: 'true',
            pathRewrite: {
            '^/api/betteru': '' // Removes /api/pharmacy from the start of the URL before forwarding
            } 
        }));

    app.use(
        '/api/pharmacy',
        createProxyMiddleware({
            target: 'http://localhost:5001',
            changeOrigin: 'true',
            pathRewrite: {
            '^/api/pharmacy': '' // Removes /api/pharmacy from the start of the URL before forwarding
            } 
            
        }));
}