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
		const { db, pubsub } = ctx;

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

		if (data.published) {
			pubsub.publish(`post`, {
				post: {
					mutation: "CREATED",
					data: post
				}
			});
		}

		return post;
	},
	deletePost(parent, args, ctx, info) {
		const { id } = args;
		const { db, pubsub } = ctx;

		const postIndex = db.posts.findIndex(post => {
			return post.id === id;
		});

		if (postIndex === -1) {
			throw new Error("Post not found");
		}

		const [post] = db.posts.splice(postIndex, 1);

		db.comments = db.comments.filter(comment => {
			return comment.post !== id;
		});

		if (post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "DELETED",
					data: post
				}
			});
		}

		return post;
	},
	updatePost(parent, args, ctx, info) {
		const { id, data } = args;
		const { db, pubsub } = ctx;
		const post = db.posts.find(post => {
			return post.id === id;
		});

		const originalPost = { ...post };
		console.log(originalPost);
		console.log(post.published);

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

			if (originalPost.published && !post.published) {
				//deleted
				pubsub.publish("post", {
					post: {
						mutation: "DELETED",
						data: originalPost
					}
				});
			} else if (!originalPost.published && post.published) {
				//created
				pubsub.publish("post", {
					post: {
						mutation: "CREATED",
						data: post
					}
				});
			} else if (post.published) {
				//updated
				pubsub.publish("post", {
					post: {
						mutation: "UPDATED",
						data: post
					}
				});
			}
		}

		return post;
	},
	createComment(parent, args, ctx, info) {
		const { data } = args;
		const { db, pubsub } = ctx;

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
		pubsub.publish(`comment ${data.post}`, {
			comment: {
				mutation: "CREATED",
				data: comment
			}
		});

		return comment;
	},
	deleteComment(parent, args, ctx, info) {
		const { id } = args;
		const { db, pubsub } = ctx;

		const commentIndex = db.comments.findIndex(comment => {
			return comment.id === id;
		});

		if (commentIndex === -1) {
			throw new Error("Comment not found");
		}

		const [deletedComment] = db.comments.splice(commentIndex, 1);

		pubsub.publish(`comment ${deletedComment.post}`, {
			comment: {
				mutation: "DELETED",
				data: deletedComment
			}
		});

		return deletedComment;
	},
	updateComment(parent, args, ctx, info) {
		const { id, data } = args;
		const { db, pubsub } = ctx;

		const comment = db.comments.find(comment => {
			return comment.id === id;
		});

		if (!comment) {
			throw new Error("Comment not found");
		}

		if (typeof data.text === "string") {
			comment.text = data.text;
		}

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "UPDATED",
				data: comment
			}
		});

		return comment;
	}
};

export { Mutation as default };
