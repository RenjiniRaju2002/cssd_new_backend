const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../db.json');
const db = require('../db.json');

const cssd_requests = db['cssd_requests'];

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

exports.getAll = (req, res) => {
  res.json(cssd_requests);
};

exports.getById = (req, res) => {
  const item = cssd_requests.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.create = (req, res) => {
  const item = req.body;
  cssd_requests.push(item);
  saveDb();
  res.status(201).json(item);
};

exports.update = (req, res) => {
  const idx = cssd_requests.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  cssd_requests[idx] = { ...cssd_requests[idx], ...req.body };
  saveDb();
  res.json(cssd_requests[idx]);
};

exports.remove = (req, res) => {
  const idx = cssd_requests.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = cssd_requests.splice(idx, 1);
  saveDb();
  res.json(removed[0]);
}; 