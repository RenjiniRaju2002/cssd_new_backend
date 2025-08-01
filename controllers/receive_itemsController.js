const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../db.json');
const db = require('../db.json');

const receive_items = db['receive_items'];

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

exports.getAll = (req, res) => {
  res.json(receive_items);
};

exports.getById = (req, res) => {
  const item = receive_items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.create = (req, res) => {
  const item = req.body;
  receive_items.push(item);
  saveDb();
  res.status(201).json(item);
};

exports.update = (req, res) => {
  const idx = receive_items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  receive_items[idx] = { ...receive_items[idx], ...req.body };
  saveDb();
  res.json(receive_items[idx]);
};

exports.remove = (req, res) => {
  const idx = receive_items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = receive_items.splice(idx, 1);
  saveDb();
  res.json(removed[0]);
}; 