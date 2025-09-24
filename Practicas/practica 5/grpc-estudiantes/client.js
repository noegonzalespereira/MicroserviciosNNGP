import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_EST = "./proto/estudiantes.proto";
const PROTO_CUR = "./proto/cursos.proto";
const PROTO_INS = "./proto/inscripciones.proto";

const estDef = protoLoader.loadSync(PROTO_EST, {});
const curDef = protoLoader.loadSync(PROTO_CUR, {});
const insDef = protoLoader.loadSync(PROTO_INS, {});

const estudiantesProto = grpc.loadPackageDefinition(estDef).estudiantes;
const cursosProto = grpc.loadPackageDefinition(curDef).cursos;
const inscProto = grpc.loadPackageDefinition(insDef).inscripciones;

const estudianteClient = new estudiantesProto.EstudianteService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const cursoClient = new cursosProto.CursoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const inscClient = new inscProto.InscripcionService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// 1. Registrar un estudiante
estudianteClient.AgregarEstudiante(
  { ci: "12345", nombres: "Carlos", apellidos: "Montellano", carrera: "Sistemas" },
  (err, response) => {
    if (err) return console.error(" Error al agregar estudiante:", err);
    console.log("Estudiante agregado:", response.estudiante);

    // 2. Registrar dos cursos
    cursoClient.AgregarCurso(
      { codigo: "CURSO1", nombre: "Microservicios", docente: "Ing. Pérez" },
      (err, res1) => {
        if (err) return console.error(" Error al agregar curso 1:", err);
        console.log(" Curso agregado:", res1.curso);

        cursoClient.AgregarCurso(
          { codigo: "CURSO2", nombre: "Bases de Datos", docente: "Lic. López" },
          (err, res2) => {
            if (err) return console.error(" Error al agregar curso 2:", err);
            console.log(" Curso agregado:", res2.curso);

            // 3. Inscribir al estudiante en ambos cursos
            inscClient.InscribirEstudiante(
              { ci: "12345", codigo: "CURSO1" },
              (err, resIns1) => {
                if (err) return console.error(" Error inscripción curso 1:", err);
                console.log("Inscripción curso 1:", resIns1.mensaje);

                inscClient.InscribirEstudiante(
                  { ci: "12345", codigo: "CURSO2" },
                  (err, resIns2) => {
                    if (err) return console.error(" Error inscripción curso 2:", err);
                    console.log(" Inscripción curso 2:", resIns2.mensaje);

                    // 4. Consultar los cursos del estudiante
                    inscClient.ListarCursosDeEstudiante(
                      { ci: "12345" },
                      (err, resCursos) => {
                        if (err) return console.error(" Error al listar cursos:", err);
                        console.log(" Cursos del estudiante:", resCursos.cursos);

                        // 5. Consultar los estudiantes de un curso
                        inscClient.ListarEstudiantesDeCurso(
                          { codigo: "CURSO1" },
                          (err, resEsts) => {
                            if (err) return console.error(" Error al listar estudiantes:", err);
                            console.log(" Estudiantes en CURSO1:", resEsts.estudiantes);
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);
