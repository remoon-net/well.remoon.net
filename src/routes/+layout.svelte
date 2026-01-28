<script lang="ts">
	import '../app.css'
	import { page } from '$app/state'
	import { locales, localizeHref } from '$lib/paraglide/runtime'
	import favicon from '$lib/assets/favicon.png'

	let { children } = $props()
	import Toast from '$lib/Toast.svelte'
	import SEO from './seo.svelte'
	import Footer from './footer.svelte'
	import Header from './header.svelte'
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SEO></SEO>
<Toast>
	<div class="flex flex-col min-h-screen">
		<div class="bg-base-100 shadow-sm">
			<Header></Header>
		</div>
		<div class="flex-1">
			{@render children()}
		</div>
		<div class="bg-base-200 text-base-content">
			<Footer></Footer>
		</div>
	</div>
</Toast>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
