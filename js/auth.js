document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const fullName = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const profilePicture = document.getElementById('profilePicture')?.files[0];

      if (!fullName || !email || !password) {
        alert('Please fill in all required fields.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
      }

      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      try {
        const response = await fetch('https://h-a-farms-backend.onrender.com/users/register', {
          method: 'POST',
          body: formData
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server did not return valid JSON.');
        }

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Registration failed');
          return;
        }

        // Success: store token + user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect ? `../${redirect}` : '../auth/login.html';

      } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred. Please try again later.');
      }
    });
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }

      try {
        const response = await fetch('https://h-a-farms-backend.onrender.com/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Login failed');
        }

        // Save user and token separately
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('authToken', result.accessToken);

        alert('Login successful!');

        // Redirect based on user role
        if (result.user?.role === 'admin') {
          window.location.href = '../admin/dashboard.html';
        } else {
          window.location.href = '../user/dashboard.html';
        }

      } catch (err) {
        console.error('Login error:', err);
        alert(`Login failed: ${err.message}`);
      }
    });
  }
});



// Social login buttons
document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const provider = this.classList.contains('google')
            ? 'Google'
            : this.classList.contains('facebook')
                ? 'Facebook'
                : 'Twitter';
        alert(`In a real app, this would redirect to ${provider} login`);
    });
});

// Forgot password link
const forgotPassword = document.querySelector('.forgot-password');
if (forgotPassword) {
    forgotPassword.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Password reset functionality would go here');
    });
}

