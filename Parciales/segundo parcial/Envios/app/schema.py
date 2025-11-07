import strawberry
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from strawberry.types import Info
from strawberry.exceptions import GraphQLError

from .db import get_db
from .models import Envio, EstadoEnvio
from .grpc_client import check_vehicle_availability

@strawberry.type
class EnvioType:
    id: int
    usuario_id: int
    vehiculo_id: str
    origen: str
    destino: str
    fecha_envio: datetime
    estado: EstadoEnvio

@strawberry.input
class EnvioInput:
    usuario_id: int
    vehiculo_id: str
    origen: str
    destino: str
    fecha_envio: datetime

def db_from_info(info: Info) -> Session:
    return info.context["db"]

@strawberry.type
class Query:
    envios: List[EnvioType] = strawberry.field()
    envio: Optional[EnvioType] = strawberry.field(description="Obtener envío por ID", resolver=None)

    @strawberry.field
    def envios(self, info: Info) -> List[EnvioType]:
        db = db_from_info(info)
        return db.query(Envio).order_by(Envio.id.desc()).all()

    @strawberry.field
    def envio(self, info: Info, id: int) -> Optional[EnvioType]:
        db = db_from_info(info)
        return db.query(Envio).filter(Envio.id == id).first()

@strawberry.type
class Mutation:
    @strawberry.mutation
    def crear_envio(self, info: Info, data: EnvioInput) -> EnvioType:
        db = db_from_info(info)

        available, estado = check_vehicle_availability(data.vehiculo_id)
        if not available:
            raise GraphQLError(f"Vehículo no disponible (estado: {estado})")

        nuevo = Envio(
            usuario_id=data.usuario_id,
            vehiculo_id=data.vehiculo_id,
            origen=data.origen,
            destino=data.destino,
            fecha_envio=data.fecha_envio,
            estado=EstadoEnvio.pendiente,
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)

        return nuevo

    @strawberry.mutation
    def actualizar_estado(self, info: Info, id: int, estado: EstadoEnvio) -> EnvioType:
        db = db_from_info(info)
        envio = db.query(Envio).get(id)
        if not envio:
            raise GraphQLError("Envio no encontrado")
        envio.estado = estado
        db.commit()
        db.refresh(envio)
        return envio

schema = strawberry.Schema(query=Query, mutation=Mutation)
