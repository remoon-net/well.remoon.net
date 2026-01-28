import { pb } from '$lib/pb'

export async function load({ fetch }) {
	let auths = await pb.collection('users').listAuthMethods({ fetch })
  console.log(auths)
	return {
		auths,
	}
}
