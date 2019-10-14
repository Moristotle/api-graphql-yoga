import getUserId from "../utils/getUserId";

const Query = {
	users(parent, { query }, { prisma }, info) {
		const opArgs = {};

		if (query) {
			opArgs.where = {
				OR: [
					{
						name_contains: query
					},
					{
						email_contains: query
					}
				]
			};
		}

		return prisma.query.users(opArgs, info);
	},
	posts(parent, { query }, { prisma }, info) {
		const opArgs = {
			where: {
				published: true
			}
		};

		if (query) {
			opArgs.where.OR = [
				{
					title_contains: query
				},
				{
					body_contains: query
				}
			];
		}

		return prisma.query.posts(opArgs, info);
	},
	comments(parent, { query }, { prisma }, info) {
		const opArgs = {};
		if (query) {
			opArgs.where = {
				text_contains: query
			};
		}
		return prisma.query.comments(opArgs, info);
	},
	me(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.query.user({
			where: {
				id: userId
			}
		});
	},
	myPosts(parent, { query }, { prisma, request }, info) {
		const userId = getUserId(request);
		const opArgs = {
			where: {
				author: {
					id: userId
				}
			}
		};

		if (query) {
			opArgs.where.OR = [
				{
					title_contains: query
				},
				{
					body_contains: query
				}
			];
		}

		return prisma.query.posts(opArgs, info);
	},
	async post(parent, { id }, { prisma, request }, info) {
		const userId = getUserId(request, false);

		const posts = await prisma.query.posts(
			{
				where: {
					id,
					OR: [
						{
							published: true
						},
						{
							author: {
								id: userId
							}
						}
					]
				}
			},
			info
		);

		if (posts.length === 0) {
			throw new Error("Post not found");
		}

		return posts[0];
	}
};

export { Query as default };
