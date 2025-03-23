const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();
const PORT = 443;

// Load SSL certificate and key
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    secureOptions: require("crypto").constants.SSL_OP_NO_TLSv1 | require("crypto").constants.SSL_OP_NO_TLSv1_1, // Disable TLS 1.0 and 1.1
    ciphers: "TLS_RSA_WITH_AES_256_CBC_SHA", // Only allow RSA-based key exchange
    honorCipherOrder: true,
    minVersion: "TLSv1.2",  // Enforce minimum TLS 1.2
    maxVersion: "TLSv1.2"   // Enforce maximum TLS 1.2 (disable TLS 1.3)
};

// Middleware to parse JSON
app.use(express.json());

// Secure login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    res.json({ message: `Login successful for user: ${username}` });
});

// Start the HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server running on https://localhost:${PORT}`);
});
