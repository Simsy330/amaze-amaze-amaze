

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
 * Generate Poisson-distributed random number
 */
function poissonRandom(lambda) {
  let L = Math.exp(-lambda);
  let p = 1;
  let k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

/**
 * Run football match simulation with predicted goals
 */
function runSimulation(lambdaA, lambdaB) {
  const goalsA = poissonRandom(lambdaA);
  const goalsB = poissonRandom(lambdaB);

  const teamA = document.getElementById('teamA').value;
  const teamB = document.getElementById('teamB').value;

  const resultsDiv = document.getElementById('simulationResults');
  if (!resultsDiv) return;

  let result = '';
  if (goalsA > goalsB) {
    result = `${teamA} wins`;
  } else if (goalsB > goalsA) {
    result = `${teamB} wins`;
  } else {
    result = 'Draw';
  }

  resultsDiv.innerHTML = `
    <div class="simulation-result">
      <h3>Predicted Match Result</h3>
      <div class="score-display">
        <div class="team-score">
          <p class="team-name">${teamA}</p>
          <p class="score">${goalsA}</p>
        </div>
        <div class="vs">vs</div>
        <div class="team-score">
          <p class="team-name">${teamB}</p>
          <p class="score">${goalsB}</p>
        </div>
      </div>
      <p class="result-text"><strong>${result}</strong></p>
    </div>
  `;
  resultsDiv.style.display = 'block';
}

// Initialize auth on page load
window.addEventListener('DOMContentLoaded', initAuth);

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


  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(event) {
      if (event.target === this) {
        this.classList.remove('show');
      }
    });
  });
}



/**
 * Initialize all page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
  initModals();
});
