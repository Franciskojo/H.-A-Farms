const API_BASE = "https://h-a-farms-backend.onrender.com/products";

// Auth Token Helper
function getAuthToken() {
  const token = localStorage.getItem('authToken') || 
                sessionStorage.getItem('authToken') || 
                document.cookie.match(/(^|;)\s*token\s*=\s*([^;]+)/)?.[2];
  if (!token) {
    window.location.href = '/login.html';
  }
  return token;
}

// Remove Image Preview
function removeImagePreview() {
  const preview = document.getElementById('imagePreview');
  const existingImages = document.getElementById('existingImages');
  if (preview) preview.innerHTML = '';
  if (existingImages) existingImages.value = '[]';
}

// Load product data if editing
async function loadProductData(productId) {
  if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
    return alert('Invalid product ID');
  }

  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const product = await response.json();
    if (!response.ok) throw new Error(product.error || 'Failed to load product');

    // Populate form fields
    document.getElementById('productId')?.value = product.id;
    document.getElementById('productName')?.value = product.productName || '';
    document.getElementById('description')?.value = product.description || '';
    document.getElementById('price')?.value = product.price || 0;
    document.getElementById('quantity')?.value = product.quantity || 0;
    document.getElementById('category')?.value = product.category || '';
    document.getElementById('productStatus')?.value = product.status || 'draft';

    // Status badge
    const badge = document.getElementById('statusBadge');
    if (badge && product.status) {
      badge.textContent = product.status.charAt(0).toUpperCase() + product.status.slice(1);
      badge.className = `status-badge status-${product.status}`;
      badge.style.display = 'inline-block';
    }

    // Handle image preview
    const preview = document.getElementById('imagePreview');
    if (preview && product.productImage) {
      preview.innerHTML = `
        <div class="image-preview-item">
          <img src="${product.productImage}" />
          <span class="remove-image" onclick="removeImagePreview()">&times;</span>
        </div>`;
      document.getElementById('existingImages').value = JSON.stringify([product.productImage]);
    }

  } catch (err) {
    console.error("Failed to load product:", err);
    alert(`❌ ${err.message}`);
  }
}

// Handle form submission
document.getElementById('productForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const productId = form.productId?.value;
  const submitBtn = document.getElementById('submitBtn');

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

  try {
    const formData = new FormData(form);
    const token = getAuthToken();

    const payload = {
      productName: formData.get('productName')?.trim(),
      description: formData.get('description')?.trim(),
      price: parseFloat(formData.get('price')) || 0,
      quantity: parseInt(formData.get('quantity')) || 0,
      category: formData.get('category'),
      status: formData.get('productStatus') || 'draft',
      productImage: JSON.parse(form.existingImages.value || '[]')[0] || ''
    };

    // Validation
    if (!payload.productName || !payload.description || !payload.category || !payload.productImage) {
      throw new Error('Missing required fields');
    }

    const res = await fetch(`${API_BASE}/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || result.message || 'Failed to update product');
    }

    alert('✅ Product updated successfully');
    window.location.href = '/products.html';

  } catch (err) {
    console.error('Submission error:', err);
    alert(`❌ ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fas fa-save"></i> Save Product`;
  }
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
  const token = getAuthToken();
  if (!token) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) loadProductData(productId);

  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    if (confirm('Discard changes?')) window.location.href = '/products.html';
  });
});
