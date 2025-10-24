const { EntitySchema } = require("typeorm");

module.exports.Usuario = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    correo: {
      type: "varchar",
      unique: true,
    },
    contraseña: {
      type: "varchar",
    },
    nombre: {
      type: "varchar",
    },
    rol: {
      type: "varchar",
    },
  },
});