const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// نقطة النهاية للمصادقة
app.post('/api/auth/discord', async (req, res) => {
    const { code } = req.body;
    
    try {
        // استبدل هذه القيم بمعلومات تطبيقك في Discord
        const params = new URLSearchParams();
        params.append('client_id', '1365741528378773626');
        params.append('client_secret', '-Z69OO3nsCd9d6mJLsqMyJBVgaT9KuHs');
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', 'https://f-l7.github.io/F-l7/');
        params.append('scope', 'identify email');
        
        const response = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const { access_token } = response.data;
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        
        res.json({ user: userResponse.data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
