
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const rfs = require('rotating-file-stream');
const fs = require('fs-extra');
const https = require('https');
// const { connection } = require("./database/db")

// Inicializar Express
const app = express();

// Integrar Cors
app.use(cors());

// middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/uploads"),
    filename(req, file, cb) {cb(null, new Date().getTime() + path.extname(file.originalname))}
})
app.use(multer({storage}).single("image"))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan("dev"))
} else {
    const accessLogStream = rfs.createStream('access.log', {interval: '1d', path: path.join(__dirname, 'log', 'access')})    
    app.use(morgan("combined", { stream: accessLogStream}))
}

//Archivos estáticos
app.use(express.static(path.join(__dirname, "public")))

//Configuraciones
app.set("port", process.env.PORT)

// Rutas API REST
app.use(require("./routes/info.router"));
app.use(require("./routes/users.router"));
app.use(require("./routes/materiales.router"));


// Inicio de servidor HTTPS SSL
// https.createServer({
//     cert: fs.readFileSync("certificate-ssl.crt"), 
//     key: fs.readFileSync("certificate-ssl.key")
// }, app).listen(app.get("port"), ()=> {
//     console.log('Server run on port HTTPS SSL', app.get("port"), "Ambiente", process.env.NODE_ENV)
//     // connection.sync({ force: false }).then( ()=> console.log("Server Database connected"))
// });

// Inicio de servidor HTTP
app.listen(app.get("port"), ()=> {
    console.log('Server run on port HTTP', app.get("port"), "Ambiente", process.env.NODE_ENV)
    // connection.sync({ force: false }).then( ()=> console.log("Server Database connected"))
});
