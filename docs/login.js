document.getElementById("github-login").addEventListener("click", () => {
  // Redirect user to GitHub login
  const clientId = "YOUR_GITHUB_CLIENT_ID";
  const redirectUri = "YOUR_REDIRECT_URL";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  window.location.href = githubAuthUrl;
});
