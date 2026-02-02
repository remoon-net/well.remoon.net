import { browser } from '$app/environment'
import { pb } from '$lib/pb'

export async function load({ fetch }) {
	if (!browser) {
		return {} as never
	}
	let pfiles: {
		windows?: InstallerFile | null
		linux?: InstallerFile | null
		android?: InstallerFile | null
		guide?: InstallerFile | null
	} = await pb.send('/api/collections/installer_files/platforms', { fetch }).catch((err) => {
		console.error(err)
		return {} as any
	})
	console.log(pfiles)
	return {
		pfiles: pfiles,
	}
}

interface InstallerFile {
	filename: string
	download: string
}
