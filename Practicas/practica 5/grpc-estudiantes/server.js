import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// ====== Rutas a los protos ======
const PROTO_EST = "./proto/estudiantes.proto";
const PROTO_CUR = "./proto/cursos.proto";
const PROTO_INS = "./proto/inscripciones.proto";

// ====== Cargar definiciones ======
const estDef = protoLoader.loadSync(PROTO_EST, {});
const curDef = protoLoader.loadSync(PROTO_CUR, {});
const insDef = protoLoader.loadSync(PROTO_INS, {});

const estudiantesProto = grpc.loadPackageDefinition(estDef).estudiantes;
const cursosProto = grpc.loadPackageDefinition(curDef).cursos;
const inscProto = grpc.loadPackageDefinition(insDef).inscripciones;

// ====== Base de datos en memoria ======
const estudiantes = [];
const cursos = [];
const inscripciones = []; // { ci, codigo }

// --- Estudiantes ---
const estudianteImpl = {
  AgregarEstudiante: (call, callback) => {
    const nuevo = call.request;
    estudiantes.push(nuevo);
    callback(null, { estudiante: nuevo });
  },

  ObtenerEstudiante: (call, callback) => {
    const { ci } = call.request;
    const est = estudiantes.find(e => e.ci === ci);
    if (est) {
      callback(null, { estudiante: est });
    } else {
      callback({ code: grpc.status.NOT_FOUND, message: "Estudiante no encontrado" });
    }
  },

  ListarEstudiantes: (call, callback) => {
    callback(null, { estudiantes });
  }
};

// --- Cursos ---
const cursoImpl = {
  AgregarCurso: (call, callback) => {
    const nuevo = call.request;
    cursos.push(nuevo);
    callback(null, { curso: nuevo });
  },

  ObtenerCurso: (call, callback) => {
    const { codigo } = call.request;
    const curso = cursos.find(c => c.codigo === codigo);
    if (curso) {
      callback(null, { curso });
    } else {
      callback({ code: grpc.status.NOT_FOUND, message: "Curso no encontrado" });
    }
  },

  ListarCursos: (call, callback) => {
    callback(null, { cursos });
  }
};

// --- Inscripciones ---
const inscripcionImpl = {
  InscribirEstudiante: (call, callback) => {
    const { ci, codigo } = call.request;

    // Verificar existencia de estudiante y curso
    const est = estudiantes.find(e => e.ci === ci);
    const curso = cursos.find(c => c.codigo === codigo);
    if (!est) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Estudiante no encontrado" });
    }
    if (!curso) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Curso no encontrado" });
    }

    // Verificar duplicado
    const yaInscrito = inscripciones.find(i => i.ci === ci && i.codigo === codigo);
    if (yaInscrito) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: "Ya está inscrito en este curso" });
    }

    // Registrar inscripción
    inscripciones.push({ ci, codigo });
    callback(null, { mensaje: `Estudiante ${ci} inscrito en curso ${codigo}` });
  },

  ListarCursosDeEstudiante: (call, callback) => {
    const { ci } = call.request;
    const cursosEst = inscripciones
      .filter(i => i.ci === ci)
      .map(i => cursos.find(c => c.codigo === i.codigo))
      .filter(curso => curso); // eliminar nulls
    callback(null, { cursos: cursosEst });
  },

  ListarEstudiantesDeCurso: (call, callback) => {
    const { codigo } = call.request;
    const estsCurso = inscripciones
      .filter(i => i.codigo === codigo)
      .map(i => estudiantes.find(e => e.ci === i.ci))
      .filter(est => est); // eliminar nulls
    callback(null, { estudiantes: estsCurso });
  }
};
// ====== Iniciar servidor ======
const server = new grpc.Server();

server.addService(estudiantesProto.EstudianteService.service, estudianteImpl);
server.addService(cursosProto.CursoService.service, cursoImpl);
server.addService(inscProto.InscripcionService.service, inscripcionImpl);

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) {
      console.error(" Error al iniciar servidor:", err);
      return;
    }
    console.log(` Servidor gRPC escuchando en puerto ${bindPort}`);
    server.start();
  }
);
