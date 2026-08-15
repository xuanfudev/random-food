require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Database
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS graph_data (
        id INT PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);
    
    // Check if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM graph_data');
    if (parseInt(result.rows[0].count) === 0) {
      // Seed from database.json if exists
      let seedData = { members: [], relationships: [] };
      if (fs.existsSync(DB_FILE)) {
        try {
          const fileData = fs.readFileSync(DB_FILE, 'utf8');
          seedData = JSON.parse(fileData);
        } catch (e) {
          console.error("Error parsing database.json:", e);
        }
      }
      await pool.query('INSERT INTO graph_data (id, data) VALUES ($1, $2)', [1, JSON.stringify(seedData)]);
      console.log('Database seeded from database.json');
    }
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDB();

// API: Get graph data
app.get('/api/graph', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM graph_data WHERE id = 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json({ members: [], relationships: [] });
    }
  } catch (err) {
    console.error('Error reading from DB:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API: Save graph data
app.post('/api/graph', async (req, res) => {
  const data = req.body;
  if (!data || !Array.isArray(data.members) || !Array.isArray(data.relationships)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  
  try {
    await pool.query(
      'INSERT INTO graph_data (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data',
      [1, JSON.stringify(data)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to DB:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
