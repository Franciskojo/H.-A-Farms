document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

async function loadProducts(page = 1) {
  const token = localStorage.getItem('authToken');
  if (!token) return (window.location.href = '/login.html');

  try {
    const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/products?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch products');

    const { products, totalPages } = await res.json();
    renderProductTable(products);
    renderPagination(totalPages, page);
  } catch (err) {
    console.error('❌ Error loading products:', err);
    alert('Unable to load products.');
  }
}

function renderProductTable(products) {
  const tbody = document.querySelector('table.data-table tbody');
  if (!tbody) return;

  tbody.innerHTML = products
    .map(p => {
      const statusClass = p.status === 'active' ? 'active' : 'inactive';
      return `
        <tr>
          <td>${p._id}</td>
          <td>
            <div class="product-info">
              <img src="${p.productImage || '/assets/images/placeholder.jpg'}" alt="Product">
              <span>${p.productName}</span>
            </div>
          </td>
          <td>${p.category || 'Uncategorized'}</td>
          <td>${formatCurrency(p.price)}</td>
          <td>${p.quantity}</td>
          <td><span class="status ${statusClass}">${p.status}</span></td>
          <td>
            <div class="table-actions">
              <a href="/admin/edit-product.html?id=${p.id}">
                <button class="btn-edit">Edit</button>
              </a>
              <button class="btn-delete" data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  attachDeleteHandlers();
}

function renderPagination(totalPages, currentPage) {
  const container = document.querySelector('.pagination');
  if (!container) return;

  let buttons = '';
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  container.innerHTML = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Previous</button>
    ${buttons}
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>
  `;

  container.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.getAttribute('data-page'));
      loadProducts(page);
    });
  });
}

function attachDeleteHandlers() {
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      if (!confirm('Are you sure you want to delete this product?')) return;

      const token = localStorage.getItem('authToken');

      try {
        const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to delete product');

        alert('Product deleted');
        loadProducts();
      } catch (err) {
        console.error('❌ Error deleting product:', err);
        alert('Could not delete product.');
      }
    });
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(amount);
}
