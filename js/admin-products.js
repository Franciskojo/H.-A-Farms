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
    console.error('Error loading products:', err);
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
          <td>${p.id}</td>
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
              <a href="/admin/edite-product.html?id=${p.id}">
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

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This product will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;

      const token = localStorage.getItem('authToken');

      try {
        const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to delete product');

        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        loadProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        Swal.fire('Error', 'Could not delete product.', 'error');
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

function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
});

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  fetchAdminProfile(); // Fetch avatar when page loads
});

async function fetchAdminProfile() {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('https://h-a-farms-backend.onrender.com/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch admin profile');

    const data = await response.json();

    const avatarEl = document.getElementById('adminAvatar');
    if (data.profilePicture && avatarEl) {
      avatarEl.src = data.profilePicture;
    }

     // Set admin name
    const nameEl = document.getElementById('adminName');
    if (data.name && nameEl) {
      nameEl.textContent = data.name;
    }

  } catch (err) {
    console.error('Avatar load error:', err);
  }
}


// logout function
document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("authToken"); // or the appropriate token key
  window.location.href = "/auth/login.html";
});


