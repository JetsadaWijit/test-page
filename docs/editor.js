const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
let accessToken = null;

async function getAccessToken() {
  if (!code) return;
  const response = await fetch(`https://github.com/login/oauth/access_token?client_id=YOUR_GITHUB_CLIENT_ID&client_secret=YOUR_GITHUB_CLIENT_SECRET&code=${code}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.text();
  const params = new URLSearchParams(data);
  accessToken = params.get('access_token');
}

async function createCommitAndPullRequest() {
  const branch = document.getElementById('branch').value;
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;

  if (!branch || !title || !message) {
    alert('All fields are required');
    return;
  }

  try {
    const repoOwner = "JetsadaWijit";
    const repoName = "test-page";

    // Create a branch
    const branchResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: 'main',
      }),
    });

    // Create a commit
    const commitResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `${title}\n\n${message}`,
        tree: 'TREE_SHA',
        parents: ['PARENT_COMMIT_SHA'],
      }),
    });

    const commitData = await commitResponse.json();

    // Create a pull request
    const pullRequestResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        head: branch,
        base: 'main',
        body: message,
      }),
    });

    const pullRequestData = await pullRequestResponse.json();
    alert(`Pull Request Created: ${pullRequestData.html_url}`);

  } catch (error) {
    console.error('Error creating pull request:', error);
  }
}

document.getElementById("submit").addEventListener("click", createCommitAndPullRequest);

// Get the access token on page load
getAccessToken();
