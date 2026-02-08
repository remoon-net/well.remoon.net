import { browser } from '$app/environment'
import { pb } from '$lib/pb'
import Bowser from 'bowser'

export async function load({ fetch }) {
	if (!browser) {
		return { pfiles: {} } as never
	}
	let pfiles: {
		windows?: InstallerFile
		linux?: InstallerFile
		android?: InstallerFile
		guide?: InstallerFile
	} = await pb.send('/api/collections/installer_files/platforms', { fetch }).catch((err) => {
		console.error(err)
		return {} as any
	})
	console.log(pfiles)
	let os = Bowser.parse(window.navigator.userAgent).os.name
	return {
		pfiles: pfiles,
		browserOS: os,
	}
}

export interface InstallerFile {
	filename: string
	download: string
}
