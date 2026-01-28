export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '隐私条款', link: '/legal/well-net/privacy/' }],
	}
}
