function setupDropdown(dropdownId, secretId) {
  const dropdown = document.getElementById(dropdownId);
  const secret = document.getElementById(secretId);
  dropdown.addEventListener('change', function() {
    if (dropdown.value === 'shown') {
      secret.classList.remove('hidden');
    } else {
      secret.classList.add('hidden');
    }
  });
  // Ensure initial state matches dropdown
  if (dropdown.value === 'shown') {
    secret.classList.remove('hidden');
  } else {
    secret.classList.add('hidden');
  }
}
window.onload = function() {
  setupDropdown('hardcodedDropdown', 'hardcodedSecret');
  setupDropdown('sharedDropdown', 'sharedSecret');
  setupDropdown('envDropdown', 'envSecret');
};
