## This folder contains the contact tracing microservice dealing with Neo4j database.

### POST /code

#### Updates the EFTS code for the TC Kimlik Number (id)

#### Request Format
{
    id: number,
    eftsCode: string
}

#### Respose Format On Success
{
    msg: "Code Added."
    updatedNode: [Node Object] 
}

### POST /filiation

#### Creates a relationship between provided nodes

#### Request Format
{
    from: string,
    to: string[]
}

#### Respose Format On Success
{
    msg: 'Relationship Created.',
    createdRelations: [ {to, from} .. ] 
}