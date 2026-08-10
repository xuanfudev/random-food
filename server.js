const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper to read DB
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    return { members: [], relationships: [] };
  }
  const data = fs.readFileSync(DB_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch (e) {
    return { members: [], relationships: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// API: Get graph data
app.get('/api/graph', (req, res) => {
  res.json(readDB());
});

// API: Save graph data
app.post('/api/graph', (req, res) => {
  const data = req.body;
  if (!data || !Array.isArray(data.members) || !Array.isArray(data.relationships)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  writeDB(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
