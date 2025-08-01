const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../db.json');
const db = require('../db.json');

const createdKits = db['createdKits'];

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

exports.getAll = (req, res) => {
  res.json(createdKits);
};

exports.getById = (req, res) => {
  const item = createdKits.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.create = (req, res) => {
  const item = req.body;
  createdKits.push(item);
  saveDb();
  res.status(201).json(item);
};

exports.update = (req, res) => {
  const idx = createdKits.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  createdKits[idx] = { ...createdKits[idx], ...req.body };
  saveDb();
  res.json(createdKits[idx]);
};

exports.remove = (req, res) => {
  const idx = createdKits.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = createdKits.splice(idx, 1);
  saveDb();
  res.json(removed[0]);
}; 