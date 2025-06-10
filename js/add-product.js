const API_URL = 'https://h-a-farms-backend.onrender.com/products';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 🔐 Get token from localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.warn('No token found');
      alert('You must be logged in to perform this action.');
      // Optional: Redirect to login page
      window.location.href = 'login.html';
      return;
    }

    // 📦 Collect form data
    const formData = new FormData(form);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response status:', response.status);
        console.error('Error message:', errorData);
        throw new Error(errorData.message || 'Something went wrong!');
      }

      const result = await response.json();
      alert('✅ Product saved successfully!');
      // Redirect after success
      window.location.href = '/admin/products.html';

    } catch (err) {
      console.error('❌ Error saving product:', err);
      alert(err.message || 'Failed to save product.');
    }
  });
});
