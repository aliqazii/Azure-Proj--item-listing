class ItemsApp {
    constructor() {
        this.apiUrl = '/api/items';
        this.items = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadItems();
    }

    bindEvents() {
        const form = document.getElementById('itemForm');
        const refreshBtn = document.getElementById('refreshBtn');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        refreshBtn.addEventListener('click', () => this.loadItems());
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

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (response.ok) {
                const newItem = await response.json();
                this.showMessage('Item added successfully!', 'success');
                e.target.reset();
                this.loadItems();
            } else {
                const error = await response.json();
                this.showMessage(`Error: ${error.error}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Network error: ${error.message}`, 'error');
        }
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
        
        if (this.items.length === 0) {
            container.innerHTML = '<div class="loading">No items found. Add some items to get started!</div>';
            return;
        }

        container.innerHTML = this.items.map(item => this.createItemCard(item)).join('');
        
        // Bind delete buttons
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.deleteItem(itemId);
            });
        });
    }

    createItemCard(item) {
        const date = new Date(item.createdAt).toLocaleDateString();
        return `
            <div class="item-card">
                <h3>${this.escapeHtml(item.name)}</h3>
                <p>${this.escapeHtml(item.description)}</p>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <span class="item-category">${this.escapeHtml(item.category)}</span>
                <div class="item-date">Added: ${date}</div>
                <div class="item-actions">
                    <button class="delete-btn" data-item-id="${item._id}">🗑️ Delete</button>
                </div>
            </div>
        `;
    }

    async deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showMessage('Item deleted successfully!', 'success');
                this.loadItems();
            } else {
                const error = await response.json();
                this.showMessage(`Error: ${error.error}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Network error: ${error.message}`, 'error');
        }
    }

    updateItemCount() {
        const countElement = document.getElementById('itemCount');
        countElement.textContent = `Total Items: ${this.items.length}`;
    }

    showLoading() {
        document.getElementById('itemsList').innerHTML = '<div class="loading">Loading items...</div>';
        document.getElementById('itemCount').textContent = 'Loading...';
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success, .error');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;

        // Insert after header
        const header = document.querySelector('header');
        header.insertAdjacentElement('afterend', messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
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