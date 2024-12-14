/**
 * Generate random 64-character string
 */
function generateRandomString(length = 64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Base64 encode a string
   */
  function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  