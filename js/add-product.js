const API_URL = 'https://h-a-farms-backend.onrender.com/products';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to perform this action.');
      window.location.href = 'login.html';
      return;
    }

    const formData = new FormData();

    formData.append('productName', form.productName.value.trim());
    formData.append('description', form.description.value.trim());
    formData.append('category', form.category.value.trim());
    formData.append('status', 'active');
    formData.append('price', parseFloat(form.price.value) || 0);
    formData.append('quantity', parseInt(form.quantity.value) || 0);
    formData.append('trackInventory', form.trackInventory.checked);
    formData.append('isPhysicalProduct', form.physicalProduct.checked);

    const imageFile = form.productImage.files[0];
    if (!imageFile) {
      alert('Please upload a product image.');
      return;
    }
    formData.append('productImage', imageFile);
    if (form.productId?.value) {
      formData.append('productId', form.productId.value);
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server error:', result);
        alert(`Error: ${result.error || 'Something went wrong'}`);
        return;
      }

      alert('✅ Product created successfully!');
      window.location.href = '/admin/products.html';

    } catch (err) {
      console.error('Submission failed:', err);
      alert(err.message || 'Failed to submit product.');
    }
  });
});
