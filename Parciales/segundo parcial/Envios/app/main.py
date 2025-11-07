import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from .db import Base, engine, get_db
from .schema import schema

# Crear tablas (usuarios ya existe; aquí creamos 'envios')
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Envios GraphQL")

# CORS (ajusta orígenes si tu front cambia)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(
    schema,
    context_getter=lambda request: {"db": next(get_db())}
)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/healthz")
def health():
    return {"ok": True, "service": "envios-svc"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
