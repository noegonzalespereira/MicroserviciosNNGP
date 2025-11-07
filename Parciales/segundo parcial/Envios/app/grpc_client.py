import os
import grpc
from . import vehiculos_pb2, vehiculos_pb2_grpc

GRPC_ADDR = os.getenv("VEHICULOS_GRPC_HOST", "localhost:50051")

def check_vehicle_availability(vehiculo_id: str) -> tuple[bool, str]:
    # Crea el canal por llamada; para alto QPS podrías mantenerlo global
    with grpc.insecure_channel(GRPC_ADDR) as channel:
        stub = vehiculos_pb2_grpc.VehiculosServiceStub(channel)
        req = vehiculos_pb2.CheckRequest(vehiculo_id=vehiculo_id)
        resp = stub.CheckAvailability(req, timeout=3.0)
        return bool(resp.available), resp.estado
