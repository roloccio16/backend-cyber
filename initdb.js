const betterSQlite = require('better-sqlite3');

const db = new betterSQlite('database.db');

const stmt = "CREATE TABLE usuarios (id INTEGER PRIMARY KEY, ip TEXT, userAgent TEXT, fecha TEXT, localizacion TEXT)";

db.prepare(stmt).run();

//db.close();

module.exports = db;