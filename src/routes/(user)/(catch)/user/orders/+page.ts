import { pb, type Order } from '$lib/pb'

export async function load({ fetch, depends }) {
	depends('app:orders')
	let orders = await pb.collection<Order>('orders').getFullList({
		fetch,
		sort: '-created',
	})
	return {
		orders,
	}
}
