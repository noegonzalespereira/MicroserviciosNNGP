const express = require('express');
const Vehiculo = require('../model/Vehiculo');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehiculos
 *   description: Gestión de vehículos (JWT)
 */

/**
 * @swagger
 * /vehiculos:
 *   post:
 *     summary: Crear vehículo
 *     tags: [Vehiculos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       201:
 *         description: Creado
 */
router.post('/', async (req, res) => {
  try {
    const v = await Vehiculo.create(req.body);
    res.status(201).json(v);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @swagger
 * /vehiculos:
 *   get:
 *     summary: Listar vehículos
 *     tags: [Vehiculos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', async (_req, res) => {
  const list = await Vehiculo.find().sort({ createdAt: -1 });
  res.json(list);
});

/**
 * @swagger
 * /vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     tags: [Vehiculos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */
router.get('/:id', async (req, res) => {
  try {
    const v = await Vehiculo.findById(req.params.id);
    if (!v) return res.status(404).json({ error: 'No encontrado' });
    res.json(v);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

/**
 * @swagger
 * /vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     tags: [Vehiculos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200: { description: Actualizado }
 *       404: { description: No encontrado }
 */
router.put('/:id', async (req, res) => {
  try {
    const v = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!v) return res.status(404).json({ error: 'No encontrado' });
    res.json(v);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @swagger
 * /vehiculos/{id}:
 *   delete:
 *     summary: Eliminar vehículo
 *     tags: [Vehiculos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No encontrado }
 */
router.delete('/:id', async (req, res) => {
  try {
    const v = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
