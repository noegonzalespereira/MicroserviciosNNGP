require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// gRPC
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// App
const { connectMongo } = require('./db');
const auth = require('./middleware/auth');
const vehiculosRouter = require('./routes/vehiculos.routes');
const Vehiculo = require('./model/Vehiculo');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'] }));
app.use(express.json());

const swaggerDefinition = {
  openapi: '3.0.3',
  info: { title: 'Vehiculos API', version: '1.0.0', description: 'CRUD de vehículos protegido con JWT' },
  servers: [{ url: `http://localhost:${PORT}` }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Vehiculo: {
        type: 'object',
        required: ['placa', 'tipo', 'capacidad'],
        properties: {
          _id: { type: 'string' },
          placa: { type: 'string' },
          tipo: { type: 'string', enum: ['camion', 'furgon', 'moto'] },
          capacidad: { type: 'number' },
          estado: { type: 'string', enum: ['disponible','en_ruta','mantenimiento'] },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const swaggerSpec = swaggerJsdoc({ swaggerDefinition, apis: [path.join(__dirname, 'routes/*.js')] });
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/vehiculos', auth, vehiculosRouter);

const PROTO_PATH = path.join(__dirname, '..', 'proto', 'vehiculos.proto');
const pkgDef = protoLoader.loadSync(PROTO_PATH, {});
const vehProto = grpc.loadPackageDefinition(pkgDef).vehiculos;

async function CheckAvailability(call, callback) {
  try {
    const id = call.request.vehiculo_id;
    const v = await Vehiculo.findById(id);
    if (!v) return callback(null, { available: false, estado: 'no_encontrado' });
    const available = v.estado === 'disponible';
    return callback(null, { available, estado: v.estado });
  } catch (e) {
    return callback(null, { available: false, estado: 'error' });
  }
}

function startGrpc() {
  const server = new grpc.Server();
  server.addService(vehProto.VehiculosService.service, { CheckAvailability });
  const addr = '0.0.0.0:50051';
  server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('gRPC error:', err);
      process.exit(1);
    }
    console.log(`🛰️  gRPC VehiculosService escuchando en ${addr}`);
    server.start();
  });
}


(async () => {
  try {
    await connectMongo();
    startGrpc();
    app.listen(PORT, () => {
      console.log(`vehiculos en http://localhost:${PORT}`);
      console.log(`Swagger en http://localhost:${PORT}/docs`);
    });
  } catch (e) {
    console.error('Error iniciando vehiculos-svc:', e);
    process.exit(1);
  }
})();
