const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const db = require('./initdb');
const geoip = require('geoip-lite');
//import request
const app = express();

// Crea un stream de escritura para el archivo de log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Middleware de morgan para logging en consola y archivo
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('combined'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/imagenes', (req, res) => {
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const fecha = new Date().toISOString();
    const localizacion = geoip.lookup(ip);
    const insert = db.prepare('INSERT INTO usuarios (ip, userAgent, fecha, localizacion) VALUES (?, ?, ?, ?)');
    insert.run(ip, userAgent, fecha, localizacion.city);
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
    const stmt = "SELECT * FROM usuarios";
    const usuarios = db.prepare(stmt).all();
    res.json(usuarios);
});
app.post("/collect", (req, res) => {
    const data = req.body;
    console.log(data);
    res.send(data);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});