const {gql}= require('apollo-server-express');

const typeDefs = gql`

    type Mesa {
        id: ID!
        nro_mesa: String!
        nombre_escuela: String!
        padrones: [Padron!]
    }
    type Padron {
        id: ID!
        nombres: String!
        apellidos: String!
        numero_documento: String!
        fotografia: String!
        mesa: Mesa!
    }
    type Query {
        getPadrones: [Padron!]
        getMesas: [Mesa!]
        getPadronById(id: ID!): Padron
    }
    type Mutation {
        createMesa(nro_mesa: String!, nombre_escuela: String!): Mesa
        createPadron(nombres: String!, apellidos: String!, numero_documento: String!, fotografia: String!, mesaId: ID!): Padron
    }
        
    type Libro {
        id: ID!
        titulo: String!
        autor: String!
        isbn: String!
        anio_publicacion: Int!
        prestamos: [Prestamo!]
    }

    type Prestamo {
        id: ID!
        usuario: String!
        fecha_prestamo: String!
        fecha_devolucion: String!
        libro: Libro!
    }

    extend type Query {
        getLibros: [Libro!]
        getPrestamos: [Prestamo!]
        getPrestamoById(id: ID!): Prestamo
        # opcional útil
        getPrestamosByUsuario(usuario: String!): [Prestamo!]
    }

    extend type Mutation {
        createLibro(
        titulo: String!,
        autor: String!,
        isbn: String!,
        anio_publicacion: Int!
        ): Libro

        createPrestamo(
        usuario: String!,
        fecha_prestamo: String!,
        fecha_devolucion: String!,
        libroId: ID!
        ): Prestamo
    
    }`;

module.exports = typeDefs;