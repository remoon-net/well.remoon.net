import { pb, type Connection, type Endpoint } from '$lib/pb.js'

export async function load({ fetch, depends }) {
	depends('app:endpoints')
	let endpoints = await pb.collection<Endpoint>('endpoints').getFullList({
		fetch,
		filter: pb.filter(`device != ''`),
		expand: 'device',
	})
	const connections = await pb.collection<Connection>('connections').getFullList({
		fetch,
		filter: pb.filter(`disconnected = ''`),
	})
	return {
		endpoints,
		connections,
	}
}
