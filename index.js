const express = require('express');
const PORT = 3000;
const db = require('./initdb');
const geoip = require('geoip-lite');
//import request
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
    });

app.get('/imagenes', (req, res) => {
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const fecha = new Date().toISOString();
    const localizacion = geoip.lookup(ip);
    const insert = db.prepare('INSERT INTO usuarios (ip, userAgent, fecha, localizacion) VALUES (?, ?, ?, ?)');
    insert.run(ip, userAgent, fecha, localizacion);
    const imagenes = [
        "1.png",
        "2.png",
        "3.png",
        "4.png",
        "5.png"
    ];
    const random = Math.random() * imagenes.length;
    const index = Math.floor(random);
    const imagen = imagenes[index];
    res.sendFile(__dirname + `/${imagen}`);
    });

app.get('/usuarios', (req, res) => {
    const stmt = db.prepare('SELECT * FROM usuarios');
    const usuarios = db.prepare(stmt).all();
    res.json(usuarios);
    });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    })