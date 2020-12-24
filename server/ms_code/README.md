## This folder will contain the EFTS Code Generation/Alteration microservice.

### POST /generate

#### Request

{
  id: number --> this is the TC Kimlik number
  ttl: number --> this is the expiration time of the EFTS code 
}

#### Response on success
status code: 200

{
  eftsCode: string --> this is the generated code
}

#### Response on failure
status code: 400

{
  msg: string --> any appropriate message
}

#### Workflow
1) Generate an efts code in a set format e.g. EFTS-XXX-XXX-XXX. Ideally it would be a function of TC Kimlik so that we can be sure it is unique for every citizen.
2) Add the generated code in mongoDB
3) Add the generated code in Neo4j (check the filiation microservice, it has a route that you can use

