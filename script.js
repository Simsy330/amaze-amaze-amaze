/* ========================================
   AUTHENTICATION & USER MANAGEMENT
   ======================================== */

/**
 * Initialize authentication status on page load
 */
function initAuth() {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const username = localStorage.getItem('username');

  if (isLoggedIn && username) {
    updateNavForLoggedInUser(username);
  } else {
    updateNavForLoggedOutUser();
  }
}

/**
 * Update navbar for logged-in user
 */
function updateNavForLoggedInUser(username) {
  const userInfo = document.querySelector('.user-info');
  const loginBtn = document.querySelector('.login-btn-nav');

  if (userInfo) {
    userInfo.textContent = `Welcome, ${username}`;
    userInfo.classList.add('visible');
  }

  if (loginBtn) {
    loginBtn.style.display = 'none';
  }

  // Show restricted content
  const restrictedElements = document.querySelectorAll('.restricted');
  restrictedElements.forEach(el => el.classList.add('visible'));
}

/**
 * Update navbar for logged-out user
 */
function updateNavForLoggedOutUser() {
  const userInfo = document.querySelector('.user-info');
  const loginBtn = document.querySelector('.login-btn-nav');

  if (userInfo) {
    userInfo.classList.remove('visible');
  }

  if (loginBtn) {
    loginBtn.style.display = 'block';
  }

  // Hide restricted content
  const restrictedElements = document.querySelectorAll('.restricted');
  restrictedElements.forEach(el => el.classList.remove('visible'));
}

/**
 * Handle user login
 */
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');

  // Simple authentication (for demo purposes)
  if (username === 'matthew' && password === 'password123') {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
  } else {
    if (errorMsg) {
      errorMsg.textContent = 'Invalid username or password';
      errorMsg.style.display = 'block';
    }
  }
}

/**
 * Handle user logout
 */
function handleLogout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

/* ========================================
   MODAL FUNCTIONALITY
   ======================================== */

/**
 * Open a modal by ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

/**
 * Close a modal by ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

/**
 * Initialize modal close buttons
 */
function initModals() {
  const closeButtons = document.querySelectorAll('.modal-close');

  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('show');
      }
    });
  });

  // Close modal when clicking outside of content
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(event) {
      if (event.target === this) {
        this.classList.remove('show');
      }
    });
  });
}

/* ========================================
   PAGE INITIALIZATION
   ======================================== */

/**
 * Initialize all page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
  initModals();
});
