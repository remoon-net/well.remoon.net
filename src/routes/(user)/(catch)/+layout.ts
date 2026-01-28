import { pb, type User } from '$lib/pb'
import { redirect } from '@sveltejs/kit'

export async function load({ url, fetch, depends }) {
	let u = new URL('/login/', url)
	u.searchParams.set('redirect', url.toString())
	if (!pb.authStore.isValid) {
		redirect(307, u)
	}
	depends('app:user')
	let user = await pb
		.collection<User>('users')
		.authRefresh({ fetch })
		.catch(() => {
			redirect(307, u)
		})
	return {
		user: user.record,
	}
}
