export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '一些条款', link: '#' }],
	}
}
