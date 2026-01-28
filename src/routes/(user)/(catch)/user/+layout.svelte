<script lang="ts">
	let { children } = $props()
	import { page } from '$app/state'
	let subnavs = $derived(page.data.subnavs.slice(1))
</script>

<div class="my-6">
	<div class="container mx-auto">
		<div class="breadcrumbs">
			<ul>
				{#each subnavs as nav}
					<li><a href={nav.link}>{nav.name}</a></li>
				{/each}
			</ul>
		</div>
	</div>
	{@render children()}
</div>
