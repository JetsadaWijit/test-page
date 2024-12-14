const githubLoginButton = document.getElementById('githubLogin');
let accessToken = null;
let userName = null;

// GitHub Login
githubLoginButton.addEventListener('click', () => {
    const clientId = 'Ov23likB7k85PgYxuVH4'; // Replace with your GitHub client ID
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
});

// Extract access token from URL
function extractToken() {
    const urlParams = new URLSearchParams(window.location.search);
    accessToken = urlParams.get('access_token');
    if (accessToken) {
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
        if (response.ok) {
            const data = await response.json();
            userName = data.login;
            alert(`Welcome, ${userName}`);
        } else {
            throw new Error('Failed to fetch user info.');
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

// Extract token on page load
window.onload = extractToken;
