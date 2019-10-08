const Subscription = {
	comment: {
		subscribe(parent, args, ctx, info) {
			const { pubsub, db } = ctx;
			const { postId } = args;

			const post = db.posts.find(post => {
				return post.id === postId && post.published;
			});

			if (!post) {
				throw new Error("Post not found");
			}

			return pubsub.asyncIterator(`comment ${postId}`);
		}
	},
	post: {
		subscribe(parent, args, ctx, info) {
			const { pubsub } = ctx;

			return pubsub.asyncIterator(`post`);
		}
	}
};

export { Subscription as default };
