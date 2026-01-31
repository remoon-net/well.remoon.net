<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { errStr, pb, type Order } from '$lib/pb'
	import { withPending } from '$lib/pending.svelte'
	import { getShowToast } from '$lib/Toast.svelte'

	let pending = withPending()
	let amount = $state<HTMLInputElement>()
	const payOpts = [
		{ name: '10元', value: '10' },
		{ name: '50元', value: '50' },
		{ name: '1毛体验下', value: '0.01' },
	]
	let open = $state(false)
	// open = true
	async function orderCreate(data: FormData) {
		let v = Number(data.get('value'))
		v = v * 100
		data.set('value', v.toString())
		let orders = pb.collection<Order>('orders')
		let order = await orders.create(data)
		order = await orders.update(order.id, {})
		window.open(order.payment_link, '_blank')
		await invalidate('app:orders')
		await goto(`/user/orders/#order-${order.id}`)
	}
	const showToast = getShowToast()
	import { page } from '$app/state'
	let user = $derived(page.data.user)
</script>

<input type="checkbox" id="order_create_modal" class="modal-toggle" bind:checked={open} />
<div class="modal" role="dialog">
	<div class="modal-box">
		<form
			onsubmit={(e) => {
				e.preventDefault()
				let data = new FormData(e.currentTarget)
				pending
					.call(async () => {
						await orderCreate(data)
						open = false
					})
					.catch((err) => {
						showToast({
							color: 'error',
							msg: `创建订单出错: ${errStr(err)}`,
						})
					})
			}}
		>
			<h3 class="text-2xl">创建充值订单</h3>
			<input type="hidden" name="user" value={user.id} />
			<fieldset class="fieldset">
				<fieldset-legend class="fieldset-legend">充值金额</fieldset-legend>
				<label class="input w-full">
					<input
						name="value"
						type="number"
						class="text-end"
						placeholder="1"
						value="1"
						min="0.01"
						max="5000"
						step="0.01"
						bind:this={amount}
						disabled={pending.value}
					/>
					<span class="label">元</span>
				</label>
				<div class="label">
					充值转换比例: 1元{user.expand.psc}. 流量永久有效. 用于中继时会消耗较多流量.
				</div>
			</fieldset>
			<div>
				<div class="join">
					{#each payOpts as item}
						<button
							type="button"
							class="join-item btn btn-sm btn-outline"
							onclick={() => {
								amount!.value = item.value
							}}
						>
							{item.name}
						</button>
					{/each}
				</div>
			</div>
			<div class="modal-action">
				<label for="order_create_modal" class="btn btn-ghost" class:btn-disabled={pending.value}>
					关闭
				</label>
				<button type="submit" class="btn btn-outline btn-primary" disabled={pending.value}>
					创建并跳转支付
				</button>
			</div>
		</form>
	</div>
	<label class="modal-backdrop" for="order_create_modal">Close</label>
</div>
