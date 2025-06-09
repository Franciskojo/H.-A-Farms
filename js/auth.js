document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const fullName = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Basic frontend validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }

            const userData = {
                fullName,
                email,
                password,
                confirmPassword,
            };

            try {
                const response = await fetch('https://h-a-farms-backend.onrender.com/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || 'Registration failed');
                    return;
                }

                // Registration successful — save token and user
                localStorage.setItem('authToken', data.token); // adjust if your backend returns token
                localStorage.setItem('currentUser', JSON.stringify(data.user)); // adjust if your backend returns user

                // Redirect
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');

                if (redirect) {
                    window.location.href = `../${redirect}`;
                } else {
                    window.location.href = '../auth/login.html';
                }

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
        const response = await fetch('https://h-a-farms-backend.onrender.com/login', {
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

        // Log result to understand the structure
        console.log('Login result:', result);

        // Save user info and token
        localStorage.setItem('currentUser', JSON.stringify(result));
        localStorage.setItem('authToken', result.accessToken); // If available

        alert('Login successful!');

        // Redirect based on role
        if (result.role === 'admin') {
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

