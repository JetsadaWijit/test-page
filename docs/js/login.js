document.getElementById('github-login-button').addEventListener('click', () => {
    // Redirect to GitHub OAuth login
    const clientId = 'Ov23likB7k85PgYxuVH4';
    const redirectUri = 'https://jetsadawijit.github.io/test-page';
    const scope = 'user';
    const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubLoginUrl;
});
