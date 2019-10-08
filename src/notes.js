import { GraphQLServer } from "graphql-yoga";

/** concepts to grasp & understand
 * type definitions (schema)
 * list of operations that can be used and types that might be queried using these functions (data structures)
 *
 * Scalar types (single & discrete values) - String, Boolean, Int, Float, ID
 *
 * resolvers
 * set of functions that run for each of hte operations that can be executed by a GraphQl Api
 */

//type definitions
const typeDefs = `
    type Query {
		greeting(name: String, position: String): String!
		add(numbers: [Float!]): Float!
		grades: [Int!]! 
		me: User!
		post: Post!
	}
	
	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
	}

	type Post {
		id: ID!
		title: String!
		body: String
		published: Boolean!
	}
 `;

//Resolvers
const resolvers = {
	Query: {
		greeting(parent, args, ctx, info) {
			console.log(args);
			if (args.name && args.position) {
				return `Hello, ${args.name}! You are my favorite ${args.position}.`;
			}
			return "Hello";
		},
		add(parent, args, ctx, info) {
			if (args.numbers.length === 0) {
				return 0;
			}

			return args.numbers.reduce((accumulator, currentValue) => {
				return accumulator + currentValue;
			});
		},
		grades(parent, args, ctx, info) {
			return [99, 80, 93];
		},
		me() {
			return {
				id: "123456",
				name: "Thomas",
				email: "thomas@example.com"
			};
		},
		post() {
			return {
				id: "9876",
				title: "comment",
				body: "this is a comment on the utility of GraphQL Yoda",
				published: true
			};
		}
	}
};

const server = new GraphQLServer({
	typeDefs,
	resolvers
});

server.start(() => {
	console.log("the server is up!");
});
