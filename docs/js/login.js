const githubLoginButton = document.getElementById('githubLogin');
let accessToken = localStorage.getItem('accessToken') || null;
let userName = localStorage.getItem('userName') || null;

// GitHub Login
githubLoginButton.addEventListener('click', () => {
    const clientId = 'Ov23likB7k85PgYxuVH4'; // Replace with your GitHub client ID
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
});

// Extract access token from URL and exchange for the token
async function extractToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !accessToken) {
        try {
            // Exchange the code for an access token
            const response = await fetch(`https://your-backend-url.com/exchange_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (data.access_token) {
                accessToken = data.access_token;
                localStorage.setItem('accessToken', accessToken);
                fetchUserInfo();
            } else {
                throw new Error('Access token not received from server.');
            }
        } catch (error) {
            console.error('Error exchanging code for access token:', error);
        }
    } else if (accessToken) {
        fetchUserInfo();
    }
}

// Fetch user info from GitHub
async function fetchUserInfo() {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user info.');

        const data = await response.json();
        userName = data.login;
        localStorage.setItem('userName', userName);
        alert(`Welcome, ${userName}`);
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

// Extract token on page load
window.onload = extractToken;
