# graphite-steps
Built for STePS, this app will track the tag #graphite-steps
and post orders to the Graphite API for instant printing.

## Development Environment
- Node
- [ngrok](https://ngrok.com/)

Set up with the app client id and client secret:
```javascript
exports.CLIENT_ID = process.env.IG_CLIENT_ID || 'CLIENT-ID';
exports.CLIENT_SECRET = process.env.IG_CLIENT_SECRET || 'CLIENT-SECRET';
```

`node app.js`
