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
        return Swal.fire('Error', 'Please fill in all required fields.', 'error');
      }

      if (password.length < 6) {
        return Swal.fire('Weak Password', 'Password must be at least 6 characters.', 'warning');
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
          return Swal.fire('Registration Failed', data.message || 'Registration failed', 'error');
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        await Swal.fire('Success!', 'Registration successful. Redirecting...', 'success');
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect ? `../${redirect}` : '../auth/login.html';

      } catch (error) {
        console.error('Error registering user:', error);
        Swal.fire('Oops!', 'An error occurred. Please try again later.', 'error');
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
        return Swal.fire('Missing Info', 'Please enter both email and password.', 'warning');
      }

      try {
        const response = await fetch('https://h-a-farms-backend.onrender.com/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Login failed');
        }

        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('authToken', result.accessToken);

        await Swal.fire('Success!', 'Login successful!', 'success');

        if (result.user?.role === 'admin') {
          window.location.href = '../admin/dashboard.html';
        } else {
          window.location.href = '../user/dashboard.html';
        }

      } catch (err) {
        console.error('Login error:', err);
        Swal.fire('Login Failed', err.message, 'error');
      }
    });
  }
});

