class ItemsApp {
    constructor() {
        this.apiUrl = '/api/items';
        this.items = [];
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadItems();
        this.addLoadingAnimation();
    }

    addLoadingAnimation() {
        // Add smooth fade-in on page load
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    bindEvents() {
        const form = document.getElementById('itemForm');
        const refreshBtn = document.getElementById('refreshBtn');
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        refreshBtn.addEventListener('click', () => this.loadItems());

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.trim().toLowerCase();
                this.renderItems();
                this.updateItemCount();
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                this.searchTerm = '';
                if (searchInput) searchInput.value = '';
                this.renderItems();
                this.updateItemCount();
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const itemData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category')
        };

        // Add loading state to button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Adding...</span>';

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (response.ok) {
                // Try to parse JSON, but handle empty responses
                let newItem = null;
                const text = await response.text();
                if (text) {
                    try {
                        newItem = JSON.parse(text);
                    } catch (e) {
                        console.warn('Response was not valid JSON:', text);
                    }
                }
                
                this.showMessage('✓ Item added successfully!', 'success');
                e.target.reset();
                await this.loadItems();
                
                // Add celebration animation
                this.celebrateNewItem();
            } else {
                // Try to parse error message
                let errorMessage = 'Failed to add item';
                try {
                    const text = await response.text();
                    if (text) {
                        const error = JSON.parse(text);
                        errorMessage = error.error || error.message || errorMessage;
                    }
                } catch (e) {
                    errorMessage = `Server error: ${response.status}`;
                }
                this.showMessage(`✗ Error: ${errorMessage}`, 'error');
            }
        } catch (error) {
            this.showMessage(`✗ Network error: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    celebrateNewItem() {
        // Brief visual feedback
        const form = document.getElementById('itemForm');
        form.style.transform = 'scale(0.98)';
        setTimeout(() => {
            form.style.transform = 'scale(1)';
        }, 200);
    }

    async loadItems() {
        try {
            this.showLoading();
            const response = await fetch(this.apiUrl);
            
            if (response.ok) {
                this.items = await response.json();
                this.renderItems();
                this.updateItemCount();
            } else {
                throw new Error('Failed to load items');
            }
        } catch (error) {
            this.showMessage(`Error loading items: ${error.message}`, 'error');
            document.getElementById('itemsList').innerHTML = '<div class="error">Failed to load items</div>';
        }
    }

    renderItems() {
        const container = document.getElementById('itemsList');
        const filtered = this.items.filter(item => this.matchesSearch(item));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    ${this.items.length === 0 
                        ? '📦 No items yet. Add your first item above!' 
                        : '🔍 No items match your search. Try different keywords.'}
                </div>`;
            return;
        }

        container.innerHTML = filtered.map(item => this.createItemCard(item)).join('');
        
        // Bind delete buttons
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                this.deleteItem(itemId);
            });
        });
    }

    createItemCard(item) {
        const date = new Date(item.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const categoryEmojis = {
            'Electronics': '📱',
            'Clothing': '👕',
            'Books': '📚',
            'Home': '🏡',
            'Sports': '⚽',
            'Other': '🔖'
        };
        
        const emoji = categoryEmojis[item.category] || '🔖';
        
        return `
            <div class="item-card">
                <h3>${this.escapeHtml(item.name)}</h3>
                <p>${this.escapeHtml(item.description)}</p>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <span class="item-category">${emoji} ${this.escapeHtml(item.category)}</span>
                <div class="item-date">Added ${date}</div>
                <div class="item-actions">
                    <button class="delete-btn btn-primary" data-item-id="${item._id}">
                        <span>Delete</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    matchesSearch(item) {
        if (!this.searchTerm) return true;
        const s = this.searchTerm;
        const name = (item.name || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        return name.includes(s) || desc.includes(s) || cat.includes(s);
    }

    async deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showMessage('✓ Item deleted successfully!', 'success');
                
                // Animate card removal
                const card = document.querySelector(`[data-item-id="${itemId}"]`)?.closest('.item-card');
                if (card) {
                    card.style.animation = 'slideOut 0.3s ease forwards';
                }
                
                setTimeout(() => {
                    this.loadItems();
                }, 300);
            } else {
                // Try to parse error message
                let errorMessage = 'Failed to delete item';
                try {
                    const text = await response.text();
                    if (text) {
                        const error = JSON.parse(text);
                        errorMessage = error.error || error.message || errorMessage;
                    }
                } catch (e) {
                    errorMessage = `Server error: ${response.status}`;
                }
                this.showMessage(`✗ Error: ${errorMessage}`, 'error');
            }
        } catch (error) {
            this.showMessage(`✗ Network error: ${error.message}`, 'error');
        }
    }

    updateItemCount() {
        const countElement = document.getElementById('itemCount');
        const visible = this.items.filter(it => this.matchesSearch(it)).length;
        countElement.textContent = `Showing ${visible} of ${this.items.length}`;
    }

    showLoading() {
        document.getElementById('itemsList').innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
                Loading items...
            </div>`;
        document.getElementById('itemCount').textContent = 'Loading...';
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success, .error');
        existingMessages.forEach(msg => {
            msg.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => msg.remove(), 300);
        });

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;

        // Insert after navbar
        const navbar = document.querySelector('.navbar');
        navbar.insertAdjacentElement('afterend', messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ItemsApp();
});