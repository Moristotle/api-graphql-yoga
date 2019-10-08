const Query = {
	users(parent, args, ctx, info) {
		const { query } = args;
		const { db } = ctx;

		if (!query) {
			return db.users;
		}

		return db.users.filter(user => {
			return user.name.toLowerCase().includes(query.toLowerCase());
		});
	},
	posts(parent, args, ctx, info) {
		const { query } = args;
		const { db } = ctx;

		if (!query) {
			return db.posts;
		}

		return db.posts.filter(post => {
			const titleMatch = post.title
				.toLowerCase()
				.includes(args.query.toLowerCase());
			const bodyMatch = post.body
				.toLowerCase()
				.includes(args.query.toLowerCase());
			return titleMatch || bodyMatch;
		});
	},
	comments(parent, args, ctx, info) {
		const { query } = args;
		const { db } = ctx;

		if (!query) {
			return db.comments;
		}

		return db.comments.filter(comment => {
			return comment.text.toLowerCase().includes(query.toLowerCase());
		});
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
};

export { Query as default };
