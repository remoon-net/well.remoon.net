export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '用户中心', link: '/user/' }],
	}
}
