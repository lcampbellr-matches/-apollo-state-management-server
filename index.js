const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Movie {
    title: String
    year: Int
  }

  type User {
    title: String
    favouriteBook: Book
    favouriteMovie: Movie
  }

  input UpdateInput { 
    title: String
    movie: String
    book: String
  }

  type UpdateOutput {
    title: String
    favouriteBook: Book
    favouriteMovie: Movie
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    movies: [Movie]
    users: [User]
  }

  type Mutation {
    updateUsers(input: UpdateInput): User
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const movies = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
];

const users = [
  {
    title: 'Aaron',
    favouriteBook: {
      title: 'City of Glass',
    },
    favouriteMovie: {
      title: 'The Dark Knight',
    },
  },
  {
    title: 'Betty',
    favouriteBook: {
      title: 'The Awakening'
    },
    favouriteMovie: {
      title: 'Forrest Gump',
    },
  }
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    movies: () => movies,
    users: () => users,
  },
  Mutation: {
    updateUsers: (_, { input }) => {
      console.log("input: ", input);
      let index = users.findIndex(({ title }) => title === input.title);
      if (index < 0) index = users.length;
      const updateObj = {
        title: input.title,
        favouriteBook: {
          title: input.book,
        },
        favouriteMovie: {
          title: input.movie,
        }
      };
      console.log("updateObj: ", updateObj);
      users.splice(index, 1, updateObj);
      return updateObj;
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});