export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '测试 well-jsnet', link: '/well-jsnet/' }],
	}
}
