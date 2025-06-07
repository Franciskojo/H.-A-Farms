//    const hamburgerBtn = document.getElementById('hamburgerBtn');
//     const sidebar = document.querySelector('.admin-sidebar');

//     hamburgerBtn.addEventListener('click', () => {
//         sidebar.classList.toggle('show');
//     });

//     // Optional: Hide sidebar when clicking outside
//     document.addEventListener('click', function (e) {
//         if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
//             sidebar.classList.remove('show');
//         }
//     });


document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    document.getElementById('roleFilter').addEventListener('change', function() {
        applyFilters();
    });
    
    function applyFilters() {
        const role = document.getElementById('roleFilter').value;
        console.log('Filtering by role:', role);
        // In a real app, you would filter users or make an API call
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    function performSearch(query) {
        console.log('Searching for:', query);
        // In a real app, you would filter users or make an API call
    }
    
    // Role select changes
    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', function() {
            const userId = this.closest('tr').querySelector('td').textContent;
            const newRole = this.value;
            
            console.log(`Updating user ${userId} to role: ${newRole}`);
            // In a real app, you would make an API call to update the role
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.closest('tr').querySelector('td').textContent;
            window.location.href = `user-edit.html?id=${userId}`;
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this user?')) {
                const row = this.closest('tr');
                console.log('Deleting user:', row.querySelector('td').textContent);
                // In a real app, you would make an API call to delete
                row.remove();
            }
        });
    });
    
    // Pagination
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            document.querySelectorAll('.page-btn').forEach(b => {
                b.classList.remove('active');
                b.disabled = false;
            });
            
            if (this.textContent === 'Previous' || this.textContent === 'Next') {
                // Handle previous/next
            } else {
                this.classList.add('active');
            }
            
            // In a real app, you would fetch the page from your backend
            console.log('Loading page:', this.textContent);
        });
    });
});