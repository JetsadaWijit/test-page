// Editable message box
const messageBox = document.getElementById('message-box');
const editButton = document.getElementById('edit-button');

editButton.addEventListener('click', () => {
    if (messageBox.contentEditable === 'false') {
        messageBox.contentEditable = 'true';
        editButton.textContent = 'Save';
        messageBox.focus();
    } else {
        messageBox.contentEditable = 'false';
        editButton.textContent = 'Edit';
    }
});

// Commit message character counter
const commitMessageInput = document.getElementById('commit-message');
const commitLengthDisplay = document.getElementById('commit-length');

commitMessageInput.addEventListener('input', () => {
    const currentLength = commitMessageInput.value.length;
    commitLengthDisplay.textContent = `${currentLength} / 72`;
    if (currentLength > 72) {
        commitMessageInput.style.borderColor = 'red';
    } else {
        commitMessageInput.style.borderColor = '';
    }
});

// Pull request button logic
const pullRequestButton = document.getElementById('pull-request-button');
pullRequestButton.addEventListener('click', () => {
    const messageContent = messageBox.textContent.trim();
    const commitMessage = commitMessageInput.value.trim();

    if (!messageContent) {
        alert('Message box cannot be empty.');
        return;
    }

    if (!commitMessage) {
        alert('Commit message cannot be empty.');
        return;
    }

    if (commitMessage.length > 72) {
        alert('Commit message cannot exceed 72 characters.');
        return;
    }

    // Simulate creating a pull request (You can add actual logic here)
    alert('Pull request created successfully!');
});
