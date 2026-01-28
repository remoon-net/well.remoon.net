<script lang="ts">
	import { page } from '$app/state'
	import { Money } from '$lib/pb'
	import { DateTime } from 'luxon'

	let { data } = $props()
	let user = $derived(data.user)
	// $inspect(user)
	import prettyBytes from 'pretty-bytes'
	import CreateModal from './create-modal.svelte'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	onMount(() => {
		function syncStatus() {
			if (document.visibilityState === 'visible') {
				invalidate('app:orders')
				invalidate('app:user')
			}
		}
		document.addEventListener('visibilitychange', syncStatus)
		return () => {
			document.removeEventListener('visibilitychange', syncStatus)
		}
	})
</script>

<CreateModal></CreateModal>

<div class="container mx-auto my-3">
	<div class="my-3">
		<div class="my-1">
			<label for="order_create_modal" class="btn btn-primary btn-outline">流量充值</label>
		</div>
		<div class="label">
			充值转换比例: 1元{user.expand.psc}, 目前余量有: {prettyBytes(user.remaining_bytes)}
		</div>
	</div>
	<div class="divider"></div>
	<div class="overflow-x-auto">
		<table class="table table-zebra">
			<thead>
				<tr>
					<th>订单ID</th>
					<th>订单状态</th>
					<th>更新时间</th>
					<th class="text-end">价格</th>
					<th class="text-end">流量包</th>
					<th>支付状态</th>
				</tr>
			</thead>
			<tbody>
				{#each data.orders as order (order.id)}
					<tr id="order-{order.id}">
						<td class:text-info={page.url.hash === `#order-${order.id}`}>{order.id}</td>
						<td>
							{#each order.status as s}
								<span class="badge badge-sm me-1">{s}</span>
							{/each}
						</td>
						<td>{DateTime.fromSQL(order.updated).toFormat('yyyy-MM-dd HH:mm')}</td>
						<td class="text-end">{Money(order.value)}</td>
						<td class="text-end">{prettyBytes(order.bytes)}</td>
						<td>
							<a class="link" href={order.payment_link} target="_blank">
								{#if order.status.indexOf('已支付') != -1}
									已支付
								{:else}
									点击去支付
								{/if}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	td {
		white-space: nowrap;
	}
</style>
