document.getElementById("submit").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;

  if (!title || !message) {
    alert("Both title and message are required!");
    return;
  }

  console.log("Commit Title:", title);
  console.log("Commit Message:", message);

  // Post to GitHub API (placeholder)
  alert("Commit submitted successfully!");
});
