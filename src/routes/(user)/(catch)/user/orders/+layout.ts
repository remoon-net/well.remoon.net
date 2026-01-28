export async function load({ parent }) {
	let { subnavs } = await parent()
	return {
		subnavs: [...subnavs, { name: '订单中心', link: '/user/orders/' }],
	}
}
