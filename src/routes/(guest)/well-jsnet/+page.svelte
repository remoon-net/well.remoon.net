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
	import { toString, fromString } from 'uint8arrays'
	const showToast = getShowToast()
	async function tryWellNet(signal: AbortSignal, data: FormData) {
		let key = localStorage.getItem('well-jsnet-key')
		if (!key) {
			let key0 = x25519.utils.randomSecretKey()
			key = toString(key0, 'base64pad')
			localStorage.setItem('well-jsnet-key', key)
		}
		let pubkey = x25519.getPublicKey(fromString(key, 'base64pad'))
		console.log('公钥:', toString(pubkey, 'base64pad'))
		eruda.show('network')
		showToast({ msg: '下载well-jsnet.wasm(5M)中, 耗时较久请耐心等待' })
		await fetch('https://unpkg.com/well-net/gojs/well-jsnet.wasm').then((r) => r.arrayBuffer())
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
	import { getShowToast } from '$lib/Toast.svelte'

	let pubkey = $state('')
	let whip = $state('')
	onMount(() => {
		pubkey = localStorage.getItem('well-jsnet-test-pubkey') || data.speer.pubkey
		whip = localStorage.getItem('well-jsnet-test-whip') || data.speer.whip
	})
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
					bind:value={pubkey}
					disabled={pending.value}
					required
					onchange={(e) => {
						let v = e.currentTarget.value.trim()
						if (!v) {
							localStorage.removeItem('well-jsnet-test-pubkey')
							return
						}
						localStorage.setItem('well-jsnet-test-pubkey', v)
					}}
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
					bind:value={whip}
					disabled={pending.value}
					required
					onchange={(e) => {
						let v = e.currentTarget.value.trim()
						if (!v) {
							localStorage.removeItem('well-jsnet-test-whip')
							return
						}
						localStorage.setItem('well-jsnet-test-whip', v)
					}}
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
