// custom.js

// Function to show the shareable link popup
function showShareableLinkPopup() {
    const shareableLink = document.getElementById('shareLink').textContent;
  
    // Create a popup with the shareable link and share buttons
    const popupHtml = `
      <div class="popup-container">
        <p class="share-link">Share this course:</p>
        <p><input type="text" value="${shareableLink}" readonly></p>
        <button class="share-button" onclick="shareOnFacebook()">Share on Facebook</button>
        <button class="share-button" onclick="shareOnTwitter()">Share on Twitter</button>
      </div>
    `;
  
    // Open the popup
    const popupWindow = window.open('', 'SharePopup', 'width=500,height=300');
    popupWindow.document.write(popupHtml);
    popupWindow.document.close();
  }
  
  // Function to share on Facebook
  function shareOnFacebook() {
    const shareableLink = document.getElementById('shareLink').textContent;
  
    // Open the Facebook share dialog with the shareable link
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`, '_blank');
  }
  
  // Function to share on Twitter
  function shareOnTwitter() {
    const shareableLink = document.getElementById('shareLink').textContent;
  
    // Open the Twitter share dialog with the shareable link
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}`, '_blank');
  }
  
  // Attach event listener to the "Show Shareable Link" button
  document.getElementById('showShareLinkBtn').addEventListener('click', showShareableLinkPopup);
  