const express = require('express');
const app = express();
const sequelize = require('./db'); // Importar configuración de base de datos
const Materia = require('./Materia'); // Importar el modelo Materia

// Middleware para manejar el CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Manejar la solicitud de preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    
    next();
});

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta para manejar la creación de una nueva materia
app.post('/materias', async (req, res) => {
    const { materia, alumnos } = req.body;
    
    try {
        const newMateria = await Materia.create({ materia, alumnos });
        res.status(201).json({ message: 'Materia agregada con éxito', materia: newMateria });
    } catch (error) {
        res.status(400).json({ message: 'Error al procesar la solicitud' });
    }
});

// Ruta para obtener todas las materias
app.get('/materias', async (req, res) => {
    try {
        const materias = await Materia.findAll();
        res.status(200).json(materias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las materias' });
    }
});

// Ruta para eliminar una materia por ID
app.delete('/materias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await Materia.destroy({ where: { id } });
        if (deletedCount) {
            res.sendStatus(204); // Eliminación exitosa
        } else {
            res.status(404).json({ message: 'Materia no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la materia' });
    }
});

// Ruta para eliminar todas las materias
app.delete('/materias', async (req, res) => {
    try {
        await Materia.destroy({ where: {} }); // Eliminar todas las materias
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar las materias' });
    }
});

// Sincronizar la base de datos
sequelize.sync().then(() => {
    console.log('Base de datos y tablas creadas');
});

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
