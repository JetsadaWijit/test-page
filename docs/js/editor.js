const saveButton = document.getElementById('saveButton');
const contentEditor = document.getElementById('content-editor');

saveButton.addEventListener('click', async () => {
    if (!userName) {
        alert('Please log in first.');
        return;
    }

    const content = contentEditor.value;
    const repoOwner = 'JetsadaWijit'; // Replace with the repository owner's username
    const repoName = 'test-page'; // Replace with your repository name
    const branchName = `${userName}`; // New branch name using the user's username

    try {
        // Get main branch reference (master/main)
        const mainBranchResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/master`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const mainBranchData = await mainBranchResponse.json();

        // Create a new branch
        await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: mainBranchData.object.sha
            })
        });

        // Create a new file in the new branch
        await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/edited-content.txt`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Add edited content',
                content: btoa(content), // Encode content to Base64
                branch: branchName
            })
        });

        // Create a pull request
        await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Pull request for edited content',
                head: branchName,
                base: 'master',
                body: 'This pull request contains edited content made by the user.'
            })
        });

        alert('Pull request created successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});