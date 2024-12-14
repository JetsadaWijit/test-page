const githubLoginButton = document.getElementById('githubLogin');
const userHeader = document.getElementById('userHeader');

let accessToken = localStorage.getItem('accessToken') || null;
let userName = localStorage.getItem('userName') || null;

// GitHub Login
githubLoginButton.addEventListener('click', () => {
    const clientId = 'Ov23likB7k85PgYxuVH4'; // Replace with your GitHub client ID
    const redirectUri = 'https://jetsadawijit.github.io/test-page/callback';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
});

// Extract access token from URL and exchange for the token
async function extractToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !accessToken) {
        try {
            // Exchange the code for an access token
            const response = await fetch(`https://jetsadawijit.github.io/test-page/exchange_token`, {
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
        updateUserHeader(userName);
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

// Update the user header from "Login" to the username
function updateUserHeader(userName) {
    if (userName) {
        userHeader.textContent = userName; // Change "Login" to the username
    }
}

// Extract token and set user info on page load
window.onload = () => {
    extractToken();
    if (userName) {
        updateUserHeader(userName);
    }
};
