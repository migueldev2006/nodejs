import swaggerAutogen from 'swagger-autogen';


const outputFile = './swagger.json';
const endPointsFiles = ['./app.js'];

const doc = {
    info:{
        title:"Api de formatrack",
        description:"Esta api permite manejar la trasabilidad de los materiales del CDGSS"
    },
    host:'localhost:3000',
    schemas:['http']
}

swaggerAutogen()(outputFile, endPointsFiles, doc)