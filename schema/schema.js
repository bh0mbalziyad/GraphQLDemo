const graphql = require('graphql');

const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLSchema
} = graphql;

const _= require('lodash')

// dummy data
var books = [
    {name:'A book one', genre:'sci-fi', id: '123',authorId:'100'},
    {name:'A book two ', genre:'fiction', id: '127',authorId:'101'},
    {name:'A book three', genre:'self-help', id: '124',authorId:'102'},
    {name:'A book four', genre:'sci-fi', id: '120',authorId:'100'},
    {name:'A book five', genre:'fiction', id: '128',authorId:'101'},
    {name:'A book six', genre:'self-help', id: '129',authorId:'102'},
]

var authors = [
    {name:'Pewdiepie', age:45, id: '100'},
    {name:'Jacksepticeye ', age:48, id: '101'},
    {name:'CinnamonToastKen', age:50, id: '102'},
]

// data structure for object
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                return _.find(authors,{id:parent.authorId})
            }
        }
    })
});



// data structure for object
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorId:parent.id});
            }
        }
    })
});

// handler for queries 
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type: BookType,
            args: {id:{type: GraphQLID}},
            resolve(parent,args){
                // code to get request data from data source/database
                return _.find(books,{id:args.id});
            }
        },
        author:{
            type: AuthorType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                return _.find(authors,{id:args.id});
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
