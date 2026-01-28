<script lang="ts">
	import { withPending } from '$lib/pending.svelte'

	async function reload() {
		// await new Promise((rl) => {
		// 	setTimeout(rl, 5e3)
		// })
		location.reload()
		await new Promise((rl) => {})
	}
	let pending = withPending()
</script>

<div class="container mx-auto my-6">
	<div class="text-center">
		<div>
			<button
				type="button"
				class="btn btn-lg btn-outline btn-primary"
				disabled={pending.value}
				onclick={() => {
					pending.call(async () => {
						await reload()
					})
				}}
			>
				点击刷新页面
			</button>
		</div>
		<p class="label my-2">出错了, 试试刷新页面</p>
	</div>
</div>
