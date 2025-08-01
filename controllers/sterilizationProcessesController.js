const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../db.json');
const db = require('../db.json');

const sterilizationProcesses = db['sterilizationProcesses'];

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

exports.getAll = (req, res) => {
  res.json(sterilizationProcesses);
};

exports.getById = (req, res) => {
  const item = sterilizationProcesses.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.create = (req, res) => {
  const item = req.body;
  sterilizationProcesses.push(item);
  saveDb();
  res.status(201).json(item);
};

exports.update = (req, res) => {
  const idx = sterilizationProcesses.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  sterilizationProcesses[idx] = { ...sterilizationProcesses[idx], ...req.body };
  saveDb();
  res.json(sterilizationProcesses[idx]);
};

exports.remove = (req, res) => {
  const idx = sterilizationProcesses.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = sterilizationProcesses.splice(idx, 1);
  saveDb();
  res.json(removed[0]);
}; 