const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Reak_score', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  value: Number
});
const Item = mongoose.model('Item', itemSchema);

// Add (Create)
app.post('/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.status(201).json(item);
});

// Edit (Update)
app.put('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).send('Item not found');
  res.json(item);
});

// Delete
app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.json({ message: 'Item deleted' });
});

// List (Read)
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
