from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from .db import Base
import enum

class EstadoEnvio(str, enum.Enum):
    pendiente = "pendiente"
    en_transito = "en_transito"
    entregado = "entregado"

class Envio(Base):
    __tablename__ = "envios"
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, nullable=False)   
    vehiculo_id = Column(String(24), nullable=False) 
    origen = Column(String(255), nullable=False)
    destino = Column(String(255), nullable=False)
    fecha_envio = Column(DateTime, nullable=False)
    estado = Column(Enum(EstadoEnvio), default=EstadoEnvio.pendiente, nullable=False)
    creado_en = Column(DateTime, server_default=func.now(), nullable=False)
