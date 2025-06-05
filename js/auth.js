document.addEventListener('DOMContentLoaded', function() {
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // In a real app, you would validate more thoroughly and send to your backend
            const userData = {
                name,
                email,
                password
            };
            
            // Simulate API call
            console.log('Registering user:', userData);
            
            // Store user data in localStorage for demo purposes
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', 'demo-auth-token');
            
            // Check for redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            // Redirect to appropriate page
            if (redirect) {
                window.location.href = `../${redirect}`;
            } else {
                window.location.href = '../auth/login.html';
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // In a real app, you would validate credentials with your backend
            console.log('Logging in with:', { email, password, rememberMe });
            
            // For demo purposes, we'll just create a mock user
            const userData = {
                name: 'Demo User',
                email,
                password: 'not-really-stored'
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', 'demo-auth-token');
            
            // Check for redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            // Redirect to appropriate page
            if (redirect) {
                window.location.href = `../${redirect}`;
            } else {
                window.location.href = '../user/dashboard.html';
            }
        });
    }
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('google') ? 'Google' :
                            this.classList.contains('facebook') ? 'Facebook' : 'Twitter';
            alert(`In a real app, this would redirect to ${provider} login`);
        });
    });
    
    // Forgot password link
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset functionality would go here');
        });
    }
});