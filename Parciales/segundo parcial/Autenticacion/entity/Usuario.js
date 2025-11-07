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
    password: {
      type: "varchar",
    },
    
  },
   indices: [{ columns: ["correo"], unique: true }]
});