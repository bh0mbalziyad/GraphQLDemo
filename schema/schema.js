const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');


const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} = graphql;

const _= require('lodash')

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
                return Author.findById(parent.authorId)
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
                // return _.filter(books,{authorId:parent.id});
                return Book.find({authorId:parent.id})
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
                return Book.findById(args.id)
            }
        },
        author:{
            type: AuthorType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return Author.find({})
            }
        }

    }
})


const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent,args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                });

                return book.save();
            }
        },
        updateBook:{
            type: BookType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
            },
            async resolve(parent,args){
                try {
                    const doc = await Book.findById(args.id)
                    args.name ? doc.name = args.name : null;
                    args.genre ? doc.genre = args.genre : null;
                    return doc.save()
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
})
