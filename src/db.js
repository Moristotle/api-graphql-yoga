//mock DB
const users = [
	{
		id: "1",
		name: "Mori",
		email: "Mori@example.com",
		age: 26
	},
	{
		id: "2",
		name: "Sarah",
		email: "Sarah@example.com",
		age: 23
	},
	{
		id: "3",
		name: "Tony",
		email: "Tony@example.com",
		age: 19
	}
];

const posts = [
	{
		id: "10",
		title: "The Art Of War",
		body:
			"a pamflet describing the principles and strategies surrounding warfare",
		published: true,
		author: "1"
	},
	{
		id: "11",
		title: "The Prince",
		body:
			"A philosophical treatise discussing the inner workings and dynamics surrounding successfull governing - Introduces the idea of the enlightened ruler.",
		published: true,
		author: "3"
	},
	{
		id: "12",
		title: "Technosophy - A Philosophical guide to the technosphere",
		body: "",
		published: false,
		author: "2"
	}
];

const comments = [
	{
		id: "110",
		text: "This is awesome!",
		author: "1",
		post: "10"
	},
	{
		id: "111",
		text: "goodbye REST Hello GraphQL..",
		author: "2",
		post: "12"
	},
	{
		id: "112",
		text: "So.. if this is so brilliant and stuff.. What's the catch!?",
		author: "1",
		post: "12"
	},
	{
		id: "113",
		text:
			"Ok.. I get it.. So GraphQL is supposed to facilitate the hostile takeover of back-end responsibilities..? ",
		author: "3",
		post: "11"
	}
];

const db = {
	users,
	posts,
	comments
};

export { db as default };
