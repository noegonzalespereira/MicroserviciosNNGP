import { Router } from "express";
import { getRepository } from "typeorm";
import { Agenda } from "../entity/Agenda";

const router = Router();

// Listar contactos
router.get("/", async (req, res) => {
  const repo = getRepository(Agenda);
  const contactos = await repo.find();
  res.render("index", { contactos });
});

// Formulario agregar
router.get("/add", (req, res) => {
  res.render("add");
});

// Guardar nuevo contacto
router.post("/add", async (req, res) => {
  const repo = getRepository(Agenda);
  const nuevo = repo.create(req.body);
  await repo.save(nuevo);
  res.redirect("/");
});

// Formulario editar
router.get("/edit/:id", async (req, res) => {
  const repo = getRepository(Agenda);
  const contacto = await repo.findOneBy({ id: parseInt(req.params.id) });
  res.render("edit", { contacto });
});

// Actualizar contacto
router.post("/edit/:id", async (req, res) => {
  const repo = getRepository(Agenda);
  await repo.update(req.params.id, req.body);
  res.redirect("/");
});

// Eliminar contacto
router.get("/delete/:id", async (req, res) => {
  const repo = getRepository(Agenda);
  await repo.delete(req.params.id);
  res.redirect("/");
});

export default router;
