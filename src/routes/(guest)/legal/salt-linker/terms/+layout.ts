export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '服务条款', link: '/legal/salt-linker/terms/' }],
	}
}
