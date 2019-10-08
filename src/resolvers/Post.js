const Post = {
	author(parent, args, ctx, info) {
		const { db } = ctx;
		return db.users.find(user => {
			return user.id === parent.author;
		});
	},
	comments(parent, args, ctx, info) {
		const { db } = ctx;
		return db.comments.filter(comment => {
			return comment.post === parent.id;
		});
	}
};

export { Post as default };
