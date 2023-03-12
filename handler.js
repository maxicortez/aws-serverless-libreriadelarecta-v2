"use strict";

const serverless = require("serverless-http");
const express = require("express");

// Inicializar Express
const app = express();

// Integrar Cors
const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
};
app.use(cors);

// middlewares
// const storage = multer.diskStorage({
//     destination: path.join(__dirname, "public/uploads"),
//     filename(req, file, cb) {cb(null, new Date().getTime() + path.extname(file.originalname))}
// })
// app.use(multer({storage}).single("image"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Archivos estáticos
// app.use(express.static(path.join(__dirname, "public")))

//Configuraciones
// app.set("port", process.env.PORT)

// Rutas API REST
app.use(require("./src/routes/info.router"));
app.use(require("./src/routes/users.router"));
app.use(require("./src/routes/materiales.router"));
app.use(require("./src/routes/categorias.router"));

// Inicio de servidor HTTP
// app.listen(app.get("port"), ()=> {
//     console.log('Server run on port HTTP', app.get("port"), "Ambiente", process.env.NODE_ENV)
// });

module.exports.generic = serverless(app);

module.exports.test = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify("Hello from Lambda!"),
    };
    return response;
};
