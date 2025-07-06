const API_BASE = "https://h-a-farms-backend.onrender.com/products";

// Utility: Remove existing image
function removeExistingImage(index) {
  const existingImages = JSON.parse(document.getElementById('existingImages')?.value || '[]');
  existingImages.splice(index, 1);
  document.getElementById('existingImages').value = JSON.stringify(existingImages);
  loadProductData(document.getElementById('productId')?.value); // Refresh preview
}

// Create a variant DOM block
function createVariantItem(variant = {}, idx = 0) {
  const variantDiv = document.createElement('div');
  variantDiv.className = 'variant-item';

  variantDiv.innerHTML = `
    <div class="variant-header">
      <h4 class="variant-title">${variant.variantName || 'Variant ' + (idx + 1)}</h4>
      <button type="button" class="remove-variant-btn" title="Remove">&times;</button>
    </div>
    <div class="form-row">
      <div class="form-col">
        <div class="form-group">
          <label>Variant Name</label>
          <input type="text" name="variantName[]" value="${variant.variantName || ''}">
        </div>
      </div>
      <div class="form-col">
        <div class="form-group">
          <label>Price (₵)</label>
          <input type="number" name="variantPrice[]" min="0" step="0.01" value="${variant.variantPrice || 0}">
        </div>
      </div>
      <div class="form-col">
        <div class="form-group">
          <label>SKU</label>
          <input type="text" name="variantSku[]" value="${variant.sku || ''}">
        </div>
      </div>
    </div>
  `;

  // Remove variant button
  variantDiv.querySelector('.remove-variant-btn')?.addEventListener('click', () => {
    variantDiv.remove();
  });

  return variantDiv;
}

// Load product data into form
async function loadProductData(productId) {
  try {
    const res = await fetch(`${API_BASE}/${productId}`);
    if (!res.ok) throw new Error("Failed to fetch product.");
    const product = await res.json();

    document.getElementById('productId')?.setAttribute('value', product._id);
    document.getElementById('productName')?.setAttribute('value', product.productName);
    document.getElementById('productDescription')?.value = product.description;
    document.getElementById('price')?.setAttribute('value', product.price);
    document.getElementById('quantity')?.setAttribute('value', product.quantity);
    document.getElementById('category')?.value = product.category;
    document.getElementById('tags')?.setAttribute('value', product.tags?.join(', ') || '');
    document.getElementById('productStatus')?.value = product.status;
    document.getElementById('trackInventory')?.checked = product.trackInventory || false;
    document.getElementById('physicalProduct')?.checked = product.physicalProduct ?? true;

    // UI labels
    const formTitle = document.getElementById('formTitle');
    if (formTitle) formTitle.textContent = "Edit Product";

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = "Edit Product";

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.textContent = "Update Product";

    const badge = document.getElementById('statusBadge');
    if (badge) {
      badge.textContent = product.status.charAt(0).toUpperCase() + product.status.slice(1);
      badge.className = `status-badge status-${product.status}`;
      badge.style.display = "inline-block";
    }


    // Preview images
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.innerHTML = '';
      const images = product.images || [product.productImage];
      images.forEach((imgUrl, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-preview-item';

        const img = document.createElement('img');
        img.src = imgUrl;

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => removeExistingImage(index);

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        preview.appendChild(imgContainer);
      });

      document.getElementById('existingImages')?.remove();
      const input = document.createElement('input');
      input.type = "hidden";
      input.id = "existingImages";
      input.name = "existingImages";
      input.value = JSON.stringify(images);
      document.getElementById('productForm')?.appendChild(input);
    }

    // Render variants
    const variantsContainer = document.getElementById('variantsContainer');
    if (variantsContainer) {
      variantsContainer.innerHTML = '';
      const variants = product.variants?.length ? product.variants : [{}];
      variants.forEach((variant, idx) => {
        variantsContainer.appendChild(createVariantItem(variant, idx));
      });
    }

  } catch (err) {
    console.error(err);
    alert("Error loading product data.");
  }
}

// Submit handler
document.getElementById('productForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const productId = form.productId.value;
  const formData = new FormData(form);

  const data = {
    productName: formData.get('productName'),
    description: formData.get('productDescription'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity')),
    category: formData.get('category'),
    tags: formData.get('tags')?.split(',').map(t => t.trim()).filter(Boolean),
    status: formData.get('productStatus'),
    trackInventory: formData.get('trackInventory') === 'on',
    physicalProduct: formData.get('physicalProduct') === 'on',
    variants: [],
    images: JSON.parse(document.getElementById('existingImages')?.value || '[]')
  };

  const variantNames = formData.getAll('variantName[]');
  const variantPrices = formData.getAll('variantPrice[]');
  const variantSkus = formData.getAll('variantSku[]');
  for (let i = 0; i < variantNames.length; i++) {
    if (variantNames[i]) {
      data.variants.push({
        variantName: variantNames[i],
        variantPrice: parseFloat(variantPrices[i]),
        sku: variantSkus[i],
        quantity: 0
      });
    }
  }

  // Placeholder: alert for missing image upload logic
  const imageFiles = formData.getAll('productImages');
  if (imageFiles.length > 0 && imageFiles[0]?.name) {
    alert("⚠️ You selected new images, but upload is not implemented. Implement uploading to cloud/server and assign URLs to data.images.");
  }

  try {
    const res = await fetch(`${API_BASE}/${productId}`, {
      method: productId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error saving product: ${errText}`);
    }

    alert(`Product ${productId ? 'updated' : 'added'} successfully!`);
    window.location.href = "/prod.html";
  } catch (err) {
    console.error(err);
    alert("Failed to save product.");
  }
});

// Cancel handler
document.getElementById('cancelBtn')?.addEventListener('click', function () {
  if (confirm("Cancel and return to product listing?")) {
    window.location.href = "/prod.html";
  }
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    loadProductData(productId);
  }

  // Add new variant
  document.getElementById('addVariantBtn')?.addEventListener('click', () => {
    const container = document.getElementById('variantsContainer');
    const count = container?.children.length || 0;
    container?.appendChild(createVariantItem({}, count));
  });
});
