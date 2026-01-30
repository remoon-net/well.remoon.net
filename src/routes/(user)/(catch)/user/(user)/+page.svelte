<script lang="ts" module>
	function Links(ep: Endpoint) {
		let linker = new URL(`/api/salt/link/${ep.id}/${ep.token}`, location.href)
		let whip = new URL(`/api/salt/whip/${ep.id}`, linker)
		return {
			linker: linker.toString(),
			whip: whip.toString(),
		}
	}
</script>

<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { errStr, pb, type Connection, type Device, type Endpoint, type Order } from '$lib/pb.js'
	import { withPending } from '$lib/pending.svelte'
	import { getShowToast } from '$lib/Toast.svelte'
	import prettyBytes from 'pretty-bytes'
	let { data } = $props()
	let user = $derived(data.user)
	async function logout() {
		let confirmed = confirm('是否确认退出')
		if (!confirmed) {
			return
		}
		pb.authStore.clear()
		await goto('/login/')
	}
	// $inspect(user)
	async function linkerAdd() {
		const name = prompt('输入易于你辨识的信令中继名称(可不填)')
		if (typeof name !== 'string') {
			return
		}
		await pb.collection('devices').create({ name: name, user: user.id })
		await invalidate('app:endpoints')
	}
	async function linkerEdit(dev: Device) {
		const name = prompt('输入易于你辨识的名称', dev.name)
		if (!name) {
			return
		}
		await pb.collection('devices').update(dev.id, { name: name })
		await invalidate('app:endpoints')
	}
	async function linkerDelete(dev: Device) {
		const confirmed = confirm(`是否真的要删除此设备节点: ${dev.name || dev.id} ?`)
		if (!confirmed) {
			return
		}
		await pb.collection('devices').delete(dev.id)
		await invalidate('app:endpoints')
	}
	const onlines = $derived.by(() => {
		return data.connections.reduce(
			(t, c) => {
				t[c.endpoint] = c
				return t
			},
			{} as { [k: string]: Connection },
		)
	})
	function displayDate(d: string) {
		return DateTime.fromSQL(d).toFormat('yyyy-MM-dd HH:mm')
	}

	let pending = withPending()
	const showToast = getShowToast()
	import Iconify from '@iconify/svelte'
	import Edit from '@iconify-icons/heroicons/pencil'
	import Copy from '@iconify-icons/heroicons/clipboard'
	import ExtraLink from '@iconify-icons/heroicons/arrow-top-right-on-square'
	import Delete from '@iconify-icons/heroicons/trash'
	import { copy } from 'svelte-copy'
	import { DateTime } from 'luxon'

	import OrderCreateModal from '../orders/create-modal.svelte'
</script>

<OrderCreateModal></OrderCreateModal>

<div class="container mx-auto">
	<div class="my-1">
		Email: {user.email}
		<button type="button" class="btn btn-xs btn-outline" onclick={logout}>退出</button>
	</div>
	<div class="my-1">
		余量:
		<span class="tooltip" data-tip={user.remaining_bytes < 0 ? '负数是正常的' : ''}>
			{prettyBytes(user.remaining_bytes)}
		</span>
		{#if !!user.expand.psc}
			<label for="order_create_modal" class="btn btn-xs btn-outline">充值</label>
		{/if}
	</div>
	{#if !!user.expand.psc}
		<div class="my-1">
			<span>进入:</span>
			<a href="/user/orders">
				<span class="link">订单中心</span>
			</a>
		</div>
	{/if}
	<div class="divider"></div>
	<div class="my-3">
		<button
			type="button"
			class="btn btn-outline btn-primary"
			disabled={pending.value}
			onclick={() => {
				pending
					.call(async () => {
						await linkerAdd()
					})
					.catch((err) => {
						showToast({
							color: 'error',
							msg: `创建信令中继出错: ${errStr(err)}`,
						})
					})
			}}
		>
			添加信令中继
		</button>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
		{#each data.endpoints as ep (ep.id)}
			{@const dev = ep.expand.device}
			{@const ll = Links(ep)}
			{@const name = dev.name || dev.id}
			<div class="card card-xs border rounded">
				<div class="card-body">
					<div class="card-title">
						{name}
						<button
							type="button"
							class="btn btn-xs btn-ghost btn-square tooltip"
							data-tip="点击修改名称"
							disabled={pending.value}
							onclick={() => {
								pending
									.call(async () => {
										await linkerEdit(dev)
									})
									.catch((err) => {
										showToast({
											color: 'error',
											msg: `修改名称出错: ${errStr(err)}`,
										})
									})
							}}
						>
							<Iconify icon={Edit}></Iconify>
						</button>
					</div>
					<fieldset class="fieldset">
						<fieldset-legend class="fieldset-legend">中继器地址 (linker)</fieldset-legend>
						<div class="join">
							<input
								class="join-item input"
								name="linker"
								type="url"
								placeholder="中继器地址"
								value={ll.linker}
								disabled={pending.value}
								readonly
							/>
							<button
								type="button"
								class="join-item btn btn-outline btn-square tooltip"
								data-tip="点击复制"
								use:copy={{
									text: ll.linker,
									onCopy: () => {
										showToast({
											msg: `复制中继器连接地址成功. of ${name}`,
										})
									},
									onError: ({ error: err }) => {
										showToast({
											color: 'error',
											msg: `复制中继器连接地址出错: ${errStr(err)}`,
										})
									},
								}}
							>
								<Iconify icon={Copy}></Iconify>
							</button>
						</div>
					</fieldset>
					<fieldset class="fieldset">
						<fieldset-legend class="fieldset-legend">信令地址 (whip)</fieldset-legend>
						<div class="join">
							<input
								class="join-item input"
								name="whip"
								type="url"
								placeholder="信令地址"
								value={ll.whip}
								disabled={pending.value}
								readonly
							/>
							<a
								href={ll.whip}
								class="join-item btn btn-outline btn-square tooltip"
								data-tip="点击新窗口打开"
								target="_blank"
							>
								<Iconify icon={ExtraLink}></Iconify>
							</a>
							<button
								type="button"
								class="join-item btn btn-outline btn-square tooltip"
								data-tip="点击复制"
								use:copy={{
									text: ll.whip,
									onCopy: () => {
										showToast({
											msg: `复制信令地址成功. of ${name}`,
										})
									},
									onError: ({ error: err }) => {
										showToast({
											color: 'error',
											msg: `复制信令地址出错: ${errStr(err)}`,
										})
									},
								}}
							>
								<Iconify icon={Copy}></Iconify>
							</button>
						</div>
					</fieldset>
					<div class="card-actions justify-between items-center">
						<button
							type="button"
							class="btn btn-sm btn-outline btn-square btn-error"
							disabled={pending.value}
							onclick={() => {
								pending
									.call(async () => {
										await linkerDelete(dev)
									})
									.catch((err) => {
										showToast({
											color: 'error',
											msg: `删除信令中继出错: ${errStr(err)}`,
										})
									})
							}}
						>
							<Iconify icon={Delete}></Iconify>
						</button>
						<div>
							{#if onlines[ep.id]}
								{@const c = onlines[ep.id]}
								{displayDate(c.updated)}
								使用中 {prettyBytes(ep.transmit_bytes + c.transmit_bytes)}
							{:else}
								{displayDate(ep.updated)}
								已使用 {prettyBytes(ep.transmit_bytes)}
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
