function generateCodeVerifier() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  let codeVerifier = '';
  for (let i = 0; i < randomBytes.length; i++) {
    codeVerifier += charset[randomBytes[i] % charset.length];
  }
  
  return codeVerifier;
}

// Utilisation
const codeVerifier = generateCodeVerifier();
console.log(codeVerifier);
