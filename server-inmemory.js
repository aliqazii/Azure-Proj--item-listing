const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (for testing without MongoDB)
let items = [
  {
    _id: '1',
    name: 'Sample Laptop',
    description: 'High-performance laptop for development',
    price: 999.99,
    category: 'Electronics',
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'JavaScript Book',
    description: 'Complete guide to modern JavaScript',
    price: 29.99,
    category: 'Books',
    createdAt: new Date('2024-01-16')
  },
  {
    _id: '3',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 199.99,
    category: 'Electronics',
    createdAt: new Date('2024-01-17')
  }
];

let nextId = 4;

// Helper function to generate ID
const generateId = () => (nextId++).toString();

// Routes
// Get all items
app.get('/api/items', (req, res) => {
  try {
    // Sort by createdAt descending
    const sortedItems = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  try {
    const item = items.find(item => item._id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new item
app.post('/api/items', (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    const newItem = {
      _id: generateId(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      createdAt: new Date()
    };
    
    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update item
app.put('/api/items/:id', (req, res) => {
  try {
    const itemIndex = items.findIndex(item => item._id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const { name, description, price, category } = req.body;
    
    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    items[itemIndex] = {
      ...items[itemIndex],
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim()
    };
    
    res.json(items[itemIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  try {
    const itemIndex = items.findIndex(item => item._id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    items.splice(itemIndex, 1);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'In-Memory Storage',
    itemCount: items.length
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Using in-memory storage with ${items.length} sample items`);
  console.log(`🌍 Visit: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});