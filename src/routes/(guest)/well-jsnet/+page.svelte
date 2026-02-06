<script lang="ts">
	import { withPending } from '$lib/pending.svelte'
	import eruda from 'eruda'
	import { onMount } from 'svelte'
	let erudaElem = $state<HTMLElement>()
	onMount(() => {
		eruda.init({
			container: erudaElem,
			inline: true,
			useShadowDom: true,
			tool: ['console', 'network', 'resources'],
		})
		return () => {
			eruda.destroy()
		}
	})
	import { x25519 } from '@noble/curves/ed25519.js'
	import { toString } from 'uint8arrays'
	async function tryWellNet(signal: AbortSignal, data: FormData) {
		let key = localStorage.getItem('well-jsnet-key')
		if (!key) {
			let key0 = x25519.utils.randomSecretKey()
			key = toString(key0, 'base64pad')
			localStorage.setItem('well-jsnet-key', key)
		}
		console.log('公钥:', key)
		eruda.show('network')
		await fetch('https://unpkg.com/well-net/gojs/well-jsnet.wasm')
		eruda.show('console')
		// @ts-ignore
		const WellNet = await import('https://unpkg.com/well-net/index.js')
		const net = await WellNet.connect({
			signal: signal,
			Key: key,
			Peers: [
				{
					Pubkey: data.get('pubkey')!,
					Endpoint: data.get('whip')!,
					Auto: 5, // 是否自动连接, 为零或空时不自动连接, 但大概率都是需要自动连接的
					Allow: '192.168.211.2/32',
				},
			],
		})
		let req = new Request('http://[2001:f4::192.168.211.2]')
		console.log('请求: http://[2001:f4::192.168.211.2]')
		let resp = await net.fetch(req).then((r: any) => r.text())
		console.log(resp)
	}
	let pending = withPending(false)
	let { data } = $props()
	import Iconify from '@iconify/svelte'
	import ExtraLink from '@iconify-icons/heroicons/arrow-top-right-on-square'
</script>

<div class="container mx-auto my-6">
	<div class="my-3 flex">
		<button
			class="btn btn-outline"
			onclick={() => {
				history.back()
			}}
		>
			返回
		</button>
		<div class="flex-1"></div>
		<a class="btn btn-outline" href="https://github.com/remoon-net/well-jsnet" target="_blank">
			well-jsnet
			<Iconify icon={ExtraLink}></Iconify>
		</a>
	</div>
	<div class="my-3">
		<form
			action=""
			onsubmit={(e) => {
				e.preventDefault()
				let data = new FormData(e.currentTarget)
				let controller = new AbortController()
				pending
					.call(async () => {
						await tryWellNet(controller.signal, data)
					})
					.finally(() => {
						controller.abort()
					})
			}}
		>
			<fieldset class="fieldset">
				<fieldset-legend class="fieldset-legend">节点公钥(pubkey)</fieldset-legend>
				<input
					name="pubkey"
					type="text"
					class="input w-full"
					placeholder="WireGuard公钥"
					value={data.speer.pubkey}
					disabled={pending.value}
					required
				/>
				<div class="label"></div>
			</fieldset>
			<fieldset class="fieldset">
				<fieldset-legend class="fieldset-legend">信令地址(whip)</fieldset-legend>
				<input
					name="whip"
					type="url"
					class="input w-full"
					placeholder="https://well.remoon.net/peer/xxxyyyzzz"
					value={data.speer.whip}
					disabled={pending.value}
				/>
				<div class="label"></div>
			</fieldset>
			<div class="my-2">
				<button type="submit" disabled={pending.value} class="btn btn-primary">
					在浏览器中测试连接
				</button>
			</div>
		</form>
	</div>
	<div class="eruda">
		<div class="eruda-container border">
			<div bind:this={erudaElem}></div>
		</div>
	</div>
</div>

<style>
	.eruda {
		position: relative;
	}
	.eruda-container {
		height: 500px;
		position: relative;
	}
</style>
