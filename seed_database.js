#!/usr/bin/node

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/gddy.sqlite');
const fs = require('fs');
const data = fs.readFileSync('./db/seed_database.sql', 'utf8');

db.run(data, {}, (err) => {
  if (err) {
    return console.log(err.message);
  }

  console.log('Database seeded');
});
