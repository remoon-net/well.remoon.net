export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '首页', link: '/' }],
	}
}
