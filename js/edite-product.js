
  const API_BASE = "https://h-a-farms-backend.onrender.com/products";

  // Utility: Remove existing image
  function removeExistingImage(index) {
    const existingImages = JSON.parse(document.getElementById('existingImages').value || '[]');
    existingImages.splice(index, 1);
    document.getElementById('existingImages').value = JSON.stringify(existingImages);
    loadProductData(document.getElementById('productId').value); // Refresh preview
  }

  // Load product data into form
  async function loadProductData(productId) {
    try {
      const res = await fetch(`${API_BASE}/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product.");
      const product = await res.json();

      document.getElementById('productId').value = product._id;
      document.getElementById('productName').value = product.productName;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('price').value = product.price;
      document.getElementById('quantity').value = product.quantity;
      document.getElementById('category').value = product.category;
      document.getElementById('tags').value = product.tags?.join(', ') || '';
      document.getElementById('productStatus').value = product.status;
      document.getElementById('trackInventory').checked = product.trackInventory || false;
      document.getElementById('physicalProduct').checked = product.physicalProduct ?? true;

      // Show status badge
      document.getElementById('formTitle').textContent = "Edit Product";
      document.getElementById('pageTitle').textContent = "Edit Product";
      document.getElementById('submitBtn').textContent = "Update Product";
      const badge = document.getElementById('statusBadge');
      badge.textContent = product.status.charAt(0).toUpperCase() + product.status.slice(1);
      badge.className = `status-badge status-${product.status}`;
      badge.style.display = "inline-block";

      // Existing images
      const preview = document.getElementById('imagePreview');
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
      document.getElementById('productForm').appendChild(input);

      // Populate variants
      const variantsContainer = document.getElementById('variantsContainer');
      variantsContainer.innerHTML = '';
      const variants = product.variants || [];
      variants.forEach((variant, idx) => {
        const variantDiv = document.createElement('div');
        variantDiv.className = 'variant-item';
        variantDiv.innerHTML = `
          <div class="variant-header">
            <h4 class="variant-title">${variant.variantName || 'Variant ' + (idx + 1)}</h4>
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
        variantsContainer.appendChild(variantDiv);
      });

    } catch (err) {
      console.error(err);
      alert("Error loading product data.");
    }
  }

  // Form submission (Add or Edit)
  document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const productId = form.productId.value;
    const formData = new FormData(form);

    // Collect form values
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

    // Handle uploaded images
    const newImages = formData.getAll('productImages');
    // Note: You would need to actually upload these to your server in real usage.

    // Variants
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

    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        method: productId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error saving product: ${errText}`);
      }

      alert(`Product ${productId ? 'updated' : 'added'} successfully!`);
      window.location.href = "/prod.html"; // redirect to product listing
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  });

  // Cancel button
  document.getElementById('cancelBtn').addEventListener('click', function () {
    if (confirm("Cancel and return to product listing?")) {
      window.location.href = "/prod.html";
    }
  });

  // Check if edit mode
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    loadProductData(productId);
  }

