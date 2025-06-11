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

    const formData = new FormData(form);

    // 🧹 Clean up / format fields
    formData.set('price', parseFloat(form.price.value) || 0);
    formData.set('quantity', parseInt(form.quantity.value) || 0);
    formData.set('trackInventory', form.trackInventory.checked);
    formData.set('isPhysicalProduct', form.physicalProduct.checked);

    // Remove invalid/unused field names
    formData.delete('physicalProduct'); // Wrong key
    if (!form.productId.value) {
      formData.delete('productId');
    }

    // 🔁 Prepare variants array
    const variants = [];
    const variantNameEls = document.querySelectorAll('input[name="variantName[]"]');
    const variantPriceEls = document.querySelectorAll('input[name="variantPrice[]"]');
    const variantSkuEls = document.querySelectorAll('input[name="sku[]"]');

    for (let i = 0; i < variantNameEls.length; i++) {
      const name = variantNameEls[i].value.trim();
      const price = parseFloat(variantPriceEls[i].value);
      const sku = variantSkuEls[i].value.trim();

      if (name || sku || !isNaN(price)) {
        variants.push({
          variantName: name || 'Variant',
          price: isNaN(price) ? 0 : price,
          sku,
          quantity: 0,
          isDefault: i === 0
        });
      }
    }

    formData.append('variants', JSON.stringify(variants));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error:', errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const result = await response.json();
      alert('✅ Product created successfully!');
      window.location.href = '/admin/products.html';

    } catch (err) {
      console.error('❌ Submission failed:', err);
      alert(err.message || 'Failed to submit product.');
    }
  });
});
