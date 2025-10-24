const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Prestamo",
  tableName: "prestamo",
  columns: {
    id: { type: Number, primary: true, generated: true },
    usuario: { type: String },
    // Usamos String para evitar tener que definir un scalar Date en GraphQL
    fecha_prestamo: { type: String },
    fecha_devolucion: { type: String },
  },
  relations: {
    libro: {
      type: "many-to-one",
      target: "Libro",
      joinColumn: true,
      eager: true, // trae el libro automáticamente al consultar préstamos
    },
  },
});
