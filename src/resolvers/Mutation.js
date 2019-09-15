import uuidv4 from "uuid/v4";

const Mutation = {
	createUser(parent, args, ctx, info) {
		const { data } = args;
		const { db } = ctx;

		const emailTaken = db.users.some(user => {
			return user.email === data.email;
		});

		if (emailTaken) {
			throw new Error("Email taken");
		}

		const user = {
			id: uuidv4(),
			...data
		};

		db.users.push(user);

		return user;
	},
	deleteUser(parent, args, ctx, info) {
		const { id } = args;
		const { db } = ctx;

		const userIndex = db.users.findIndex(user => {
			return user.id === id;
		});

		if (userIndex === -1) {
			throw new Error("User not found");
		}

		const deletedUsers = db.users.splice(userIndex, 1);
		console.log(deletedUsers);

		db.posts = db.posts.filter(post => {
			const match = post.author === id;

			if (match) {
				db.comments = db.comments.filter(comment => {
					return comment.post !== post.id;
				});
			}
			return !match;
		});

		db.comments = db.comments.filter(comment => {
			return comment.author !== id;
		});

		return deletedUsers[0];
	},
	updateUser(parent, args, ctx, info) {
		const { id, data } = args;
		const { db } = ctx;

		const user = db.users.find(user => {
			return user.id === id;
		});

		if (!user) {
			throw new Error("User not found");
		}

		if (typeof data.email === "string") {
			const emailTaken = db.users.some(user => {
				return user.email === data.email;
			});

			if (emailTaken) {
				throw new Error("Email taken");
			}

			user.email = data.email;
		}

		if (typeof data.name === "string") {
			user.name = data.name;
		}

		if (typeof data.age !== "undefined") {
			user.age = data.age;
		}

		return user;
	},
	createPost(parent, args, ctx, info) {
		const { data } = args;
		const { db } = ctx;

		const userExists = db.users.some(user => {
			return user.id === data.author;
		});

		if (!userExists) {
			throw new Error("User not found");
		}

		const post = {
			id: uuidv4(),
			...data
		};

		db.posts.push(post);

		return post;
	},
	deletePost(parent, args, ctx, info) {
		const { id } = args;
		const { db } = ctx;

		const postIndex = db.posts.findIndex(post => {
			return post.id === id;
		});

		if (postIndex === -1) {
			throw new Error("Post not found");
		}

		const deletedPost = db.posts.splice(postIndex, 1);

		db.comments = db.comments.filter(comment => {
			return comment.post !== id;
		});

		return deletedPost[0];
	},
	updatePost(parent, args, ctx, info) {
		const { id, data } = args;
		const { db } = ctx;

		const post = db.posts.find(post => {
			return post.id === id;
		});

		if (!post) {
			throw new Error("Post not found");
		}

		if (typeof data.title === "string") {
			post.title = data.title;
		}

		if (typeof data.body === "string") {
			post.body = data.body;
		}

		if (typeof data.published === "boolean") {
			post.published = data.published;
		}

		return post;
	},
	createComment(parent, args, ctx, info) {
		const { data } = args;
		const { db } = ctx;

		const userExists = db.users.some(user => {
			return user.id === data.author;
		});
		const postExists = db.posts.some(post => {
			return post.id === data.post && post.published;
		});

		if (!userExists || !postExists) {
			throw new Error("Unable to find user and/or Post!");
		}

		const comment = {
			id: uuidv4(),
			...data
		};

		db.comments.push(comment);

		return comment;
	},
	deleteComment(parent, args, ctx, info) {
		const { id } = args;
		const { db } = ctx;

		const commentIndex = db.comments.findIndex(comment => {
			return comment.id === id;
		});

		if (commentIndex === -1) {
			throw new Error("Comment not found");
		}

		const deletedComments = db.comments.splice(commentIndex, 1);

		return deletedComments[0];
	},
	updateComment(parent, args, ctx, info) {
		const { id, data } = args;
		const { db } = ctx;

		const comment = db.comments.find(comment => {
			return comment.id === id;
		});

		if (!comment) {
			throw new Error("Comment not found");
		}

		if (typeof data.text === "string") {
			comment.text = data.text;
		}

		return comment;
	}
};

export { Mutation as default };
