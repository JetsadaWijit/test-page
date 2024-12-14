const CLIENT_ID = 'Ov23likB7k85PgYxuVH4'; // Replace with your GitHub OAuth App Client ID
const GITHUB_API = 'https://api.github.com';

let accessToken = '';

/**
 * Handles GitHub Login using OAuth Device Flow
 */
document.getElementById('login-btn').addEventListener('click', async () => {
  const loginURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;
  window.location.href = loginURL;
});

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    // Exchange code for access token
    try {
      const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&code=${code}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      const data = await response.json();
      accessToken = data.access_token;

      // Get user info
      const userInfo = await fetch(`${GITHUB_API}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userInfo.json();
      document.getElementById('username').textContent = userData.login;

      // Show the form
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('form-section').style.display = 'block';
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }
};

document.getElementById('pr-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const repo = document.getElementById('repo').value;
  const branch = document.getElementById('branch').value;
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;

  const randomFileName = `${generateRandomString(8)}.txt`;
  const randomContent = generateRandomString(64);

  try {
    // Upload file to GitHub
    const uploadResponse = await fetch(`${GITHUB_API}/repos/${repo}/contents/${randomFileName}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        content: base64Encode(randomContent),
        branch: branch,
      }),
    });

    const uploadData = await uploadResponse.json();

    if (uploadData.content) {
      // Create pull request
      const prResponse = await fetch(`${GITHUB_API}/repos/${repo}/pulls`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          head: branch,
          base: 'main',
        }),
      });

      const prData = await prResponse.json();
      if (prData.html_url) {
        alert(`Pull request created: ${prData.html_url}`);
      } else {
        alert('Failed to create Pull Request.');
      }
    }
  } catch (error) {
    console.error('Error creating pull request:', error);
    alert('Error creating pull request.');
  }
});
