import { toString, fromString } from 'uint8arrays'

export async function load() {
	let speer = {
		pubkey: '',
		whip: '',
	}
	let slink = import.meta.env['VITE_PEER_SHARELINK']
	if (!!slink) {
		let u = new URL(slink)
		speer.pubkey = toString(fromString(u.hostname, 'base64url'), 'base64pad')
		speer.whip = u.searchParams.get('whip') || ''
	}
	return {
		speer,
	}
}
