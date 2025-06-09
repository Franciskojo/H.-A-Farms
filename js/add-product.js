// Function to load product data for editing
        function loadProductData(productId) {
            // In a real application, you would fetch this from your API
            const mockProduct = {
                id: productId,
                name: "Sample Product",
                description: "This is a sample product description.",
                price: 49.99,
                comparePrice: 59.99,
                costPerItem: 25.00,
                quantity: 100,
                category: "electronics",
                tags: "sample,test,electronics",
                status: "active",
                trackInventory: true,
                physicalProduct: true,
                images: [
                    "https://via.placeholder.com/150",
                    "https://via.placeholder.com/150"
                ]
            };

            // Populate form fields
            document.getElementById('productId').value = mockProduct.id;
            document.getElementById('productName').value = mockProduct.name;
            document.getElementById('productDescription').value = mockProduct.description;
            document.getElementById('price').value = mockProduct.price;
            document.getElementById('comparePrice').value = mockProduct.comparePrice;
            document.getElementById('costPerItem').value = mockProduct.costPerItem;
            document.getElementById('quantity').value = mockProduct.quantity;
            document.getElementById('category').value = mockProduct.category;
            document.getElementById('tags').value = mockProduct.tags;
            document.getElementById('productStatus').value = mockProduct.status;
            document.getElementById('trackInventory').checked = mockProduct.trackInventory;
            document.getElementById('physicalProduct').checked = mockProduct.physicalProduct;
            document.getElementById('existingImages').value = JSON.stringify(mockProduct.images);

            // Update UI
            document.getElementById('formTitle').textContent = "Edit Product";
            document.getElementById('pageTitle').textContent = "Edit Product";
            document.getElementById('submitBtn').textContent = "Update Product";
            document.getElementById('statusBadge').style.display = "inline-block";
            document.getElementById('statusBadge').textContent = mockProduct.status.charAt(0).toUpperCase() + mockProduct.status.slice(1);
            document.getElementById('statusBadge').className = `status-badge status-${mockProduct.status}`;

            // Display existing images
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            mockProduct.images.forEach((imageUrl, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-preview-item';
                
                const img = document.createElement('img');
                img.src = imageUrl;
                
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '&times;';
                removeBtn.onclick = () => removeExistingImage(index);
                
                imgContainer.appendChild(img);
                imgContainer.appendChild(removeBtn);
                preview.appendChild(imgContainer);
            });
        }

        function removeExistingImage(index) {
            const existingImages = JSON.parse(document.getElementById('existingImages').value || '[]');
            existingImages.splice(index, 1);
            document.getElementById('existingImages').value = JSON.stringify(existingImages);
            loadProductData(document.getElementById('productId').value); // Refresh the preview
        }

        // Image preview functionality
        document.getElementById('productImages').addEventListener('change', function(e) {
            const preview = document.getElementById('imagePreview');
            
            if (this.files) {
                Array.from(this.files).forEach(file => {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'image-preview-item';
                        
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        
                        const removeBtn = document.createElement('span');
                        removeBtn.className = 'remove-image';
                        removeBtn.innerHTML = '&times;';
                        removeBtn.onclick = () => imgContainer.remove();
                        
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(removeBtn);
                        preview.appendChild(imgContainer);
                    }
                    
                    reader.readAsDataURL(file);
                });
            }
        });

        // Form submission
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('productId').value;
            const isEdit = productId !== '';
            
            // Here you would typically send the form data to your server
            alert(`Product ${isEdit ? 'updated' : 'added'} successfully! (This is a demo)`);
            
            if (!isEdit) {
                // Reset form after adding new product
                this.reset();
                document.getElementById('imagePreview').innerHTML = '';
            }
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel?')) {
                window.location.href = 'products.html'; // Redirect to product listing
            }
        });

        // Check if we're in edit mode (from URL parameter)
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            loadProductData(productId);
        } else {
            document.getElementById('formTitle').textContent = "Add New Product";
            document.getElementById('pageTitle').textContent = "Add New Product";
        }