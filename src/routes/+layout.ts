export const prerender = true

export const ssr = false

export const trailingSlash = 'always'

export function load() {
	return {
		subnavs: [
			{
				name: 'well net',
				link: '/',
			},
		] as Nav[],
	}
}

export interface Nav {
	name: string
	link: string
}
