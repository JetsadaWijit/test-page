document.getElementById('create-pr').addEventListener('click', async () => {
    const pullRequestTitle = document.getElementById('pr-title').value.trim();
    const commitMessage = document.getElementById('commit-message').value.trim();
  
    if (!pullRequestTitle) {
      alert('Pull Request title cannot be empty.');
      return;
    }
  
    if (!commitMessage) {
      alert('Commit message cannot be empty.');
      return;
    }
  
    const repoOwner = 'JetsadaWijit';
    const repoName = 'test-page';
    const branch = 'master'; // Replace with your branch name
    const newBranch = `update-${Date.now()}`;
  
    try {
      // 1. Get the latest commit SHA from the main branch
      const branchResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/${branch}`);
      const branchData = await branchResponse.json();
      const latestCommitSha = branchData.object.sha;
  
      // 2. Create a new branch from the latest commit
      const createBranchResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: `refs/heads/${newBranch}`,
          sha: latestCommitSha
        }),
      });
  
      if (!createBranchResponse.ok) {
        const errorData = await createBranchResponse.json();
        console.error('Failed to create new branch:', errorData);
        alert('Failed to create a new branch.');
        return;
      }
  
      // 3. Get the file path and its SHA to create a new commit
      const filePath = 'README.md'; // Replace with the file path you want to update
      const fileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`);
      const fileData = await fileResponse.json();
  
      const updatedContent = `# Updated Content\n\n${new Date().toISOString()}\n\n${commitMessage}`;
      const updatedContentBase64 = btoa(updatedContent);
  
      // 4. Create a commit with the updated file
      const updateFileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: updatedContentBase64,
          sha: fileData.sha,
          branch: newBranch
        }),
      });
  
      if (!updateFileResponse.ok) {
        const errorData = await updateFileResponse.json();
        console.error('Failed to update file:', errorData);
        alert('Failed to update file.');
        return;
      }
  
      // 5. Create a pull request
      const createPullRequestResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pullRequestTitle,
          head: newBranch,
          base: branch,
          body: commitMessage,
        }),
      });
  
      if (createPullRequestResponse.ok) {
        alert('Pull request created successfully.');
      } else {
        const errorData = await createPullRequestResponse.json();
        console.error('Failed to create pull request:', errorData);
        alert('Failed to create pull request.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the pull request.');
    }
  });
  