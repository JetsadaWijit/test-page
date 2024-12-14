const saveButton = document.getElementById('saveButton');
const contentEditor = document.getElementById('content-editor');

const accessToken = localStorage.getItem('accessToken');
const userName = localStorage.getItem('userName');

saveButton.addEventListener('click', async () => {
    if (!userName || !accessToken) {
        alert('Please log in first.');
        return;
    }

    const content = contentEditor.value;
    const repoOwner = 'JetsadaWijit'; 
    const repoName = 'test-page';
    const branchName = userName;

    try {
        const mainBranchResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!mainBranchResponse.ok) throw new Error('Failed to fetch main branch.');

        const mainBranchData = await mainBranchResponse.json();

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

        await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/edited-content.txt`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Add edited content',
                content: btoa(content),
                branch: branchName
            })
        });

        await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Pull request for edited content',
                head: branchName,
                base: 'main',
                body: 'This pull request contains edited content made by the user.'
            })
        });

        alert('Pull request created successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
