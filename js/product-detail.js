document.addEventListener('DOMContentLoaded', async function () {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');

      if (!productId) {
        alert('No product ID found in URL.');
        return;
      }

      const API_BASE = 'https://h-a-farms-backend.onrender.com/products';

      async function getProductById(id) {
        try {
          const res = await fetch(`${API_BASE}/${id}`);
          if (!res.ok) throw new Error("Product not found");
          return await res.json();
        } catch (err) {
          console.error(err.message);
          alert("Failed to load product.");
        }
      }

      const product = await getProductById(productId);
      if (!product) return;

      // Populate product info
      document.getElementById('productName').textContent = product.productName || 'Unnamed Product';
      document.getElementById('productPrice').textContent = `₵${(product.price || 0).toFixed(2)}`;
      document.getElementById('productDescription').textContent = product.description || 'No description.';
      document.getElementById('productCategory').textContent = product.category || 'N/A';
      document.getElementById('productStatus').textContent = product.status || 'active';
      document.getElementById('mainImage').src = product.productImage || 'https://via.placeholder.com/500x400';
      document.getElementById('mainImage').alt = product.productName || 'Product Image';
      document.getElementById('editProductBtn').href = `/admin/edite-product.html?id=${product._id}`;

      // Add to cart logic
      document.getElementById('addToCartBtn').addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existing = cart.find(item => item.id === productId);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            id: productId,
            name: product.productName,
            price: product.price,
            image: product.productImage,
            quantity: 1
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.productName} added to cart!`);
      });
    });