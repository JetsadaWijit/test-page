const clientId = "Ov23likB7k85PgYxuVH4";
const redirectUri = "https://jetsadawijit.github.io/test-page";

document.getElementById("github-login").addEventListener("click", () => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  window.location.href = githubAuthUrl;
});
