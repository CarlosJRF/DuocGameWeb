/**
 * DuocGameWeb - API REST (Express)
 *
 * Endpoints:
 *   GET /api/videojuegos -> catálogo completo de videojuegos (JSON)
 */
import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";

const PUERTO = process.env.PORT || 3000;
// Retardo artificial para que el frontend pueda mostrar su estado de carga
const RETARDO_MS = 1000;
const RUTA_VIDEOJUEGOS = new URL("./data/videojuegos.json", import.meta.url);

const app = express();
app.use(cors());

app.get("/api/videojuegos", (req, res) => {
    setTimeout(async () => {
        try {
            const contenido = await readFile(RUTA_VIDEOJUEGOS, "utf-8");
            res.json(JSON.parse(contenido));
        } catch (error) {
            console.error("Error al leer el catálogo:", error);
            res.status(500).json({ mensaje: "No se pudo obtener el catálogo de videojuegos." });
        }
    }, RETARDO_MS);
});

app.listen(PUERTO, () => {
    console.log(`API de DuocGameWeb escuchando en http://localhost:${PUERTO}`);
});
