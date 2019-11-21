const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose');
const cors = require('cors');


app = express();

mongoose.connect('mongodb+srv://grass:grass@graphql-cluster-ps5qt.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true})
mongoose.connection.once('open',()=>{console.log('Connected to database')})

app.use(cors())

app.use('/graphql',graphqlHTTP({
    schema: schema,
    graphiql: true,
}))

app.listen(4000,()=>{
    console.log('Listening on port 4000..')
})