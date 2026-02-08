<script lang="ts">
	import Iconify from '@iconify/svelte'
	import Play from '@iconify-icons/heroicons/play'
	let guideVideo = $state<HTMLVideoElement>()
	let guideOpen = $state(false)
	$effect(() => {
		if (guideOpen) {
			guideVideo?.play()
		} else {
			guideVideo?.pause()
		}
	})
	import ExtraLink from '@iconify-icons/heroicons/arrow-top-right-on-square'
	import Expand from '@iconify-icons/heroicons/chevron-right'
	import Expand2 from '@iconify-icons/heroicons/chevron-left'
	import { copy } from 'svelte-copy'
	import { getShowToast } from '$lib/Toast.svelte'
	let { data } = $props()
	let pfiles = $derived(data.pfiles)
	const showToast = getShowToast()
	import type { InstallerFile } from './+page'
	let pfiles2 = $derived.by(() => {
		let pfiles: { name: string; installer?: InstallerFile; current: boolean }[] = [
			{
				name: 'Windows',
				installer: data.pfiles.windows,
				current: data.browserOS === 'Windows',
			},
			{
				name: 'Android',
				installer: data.pfiles.android,
				current: data.browserOS === 'Android',
			},
			{
				name: 'Linux (deb)',
				installer: data.pfiles.linux,
				current: data.browserOS === 'Linux',
			},
			{
				name: 'iPhone',
				// installer: data.pfiles.linux,
				current: data.browserOS === 'iOS',
			},
			{
				name: 'macOS',
				// installer: data.pfiles.linux,
				current: data.browserOS === 'macOS',
			},
		]
		return pfiles
	})
	let expand = $state(false)
	let pfiles3 = $derived.by(() => {
		if (expand) {
			return pfiles2.sort((a, b) => {
				if (a.current) {
					return -1
				}
				return 1
			})
		}
		let f = pfiles2.filter((v) => {
			return v.current
		})
		if (f.length === 0) {
			return pfiles2.slice(0, 1)
		}
		return f
	})
</script>

<div class="container mx-auto my-6">
	<div class="my-3">
		<h3 class="text-3xl my-1">well-net</h3>
		<p>
			<a href="https://github.com/remoon-net/well" class="link" target="_blank">
				well-net
				<button>
					<Iconify icon={ExtraLink}></Iconify>
				</button>
			</a>
			是一款帮助用户和他人建立<b>安全交流网络</b>的组网软件.
		</p>
	</div>
	<div class="my-3">
		<h3 class="text-xl my-1" id="download">下载安装包(64位)</h3>
		<p>
			其他架构的请 自己构建 或
			<a href="https://github.com/remoon-net/well/issues" class="link" target="_blank">
				提出需求
				<button>
					<Iconify icon={ExtraLink}></Iconify>
				</button>
			</a>
		</p>
	</div>
	<div class="my-3">
		<div class="join flex-wrap">
			{#each pfiles3 as pf}
				<a
					href={pf.installer?.download}
					download={pf.installer?.filename}
					class="join-item btn btn-outline"
					class:btn-primary={pf.current}
					class:btn-disabled={!pf.installer?.download}
				>
					{pf.name}
				</a>
			{/each}
			<button
				type="button"
				class="join-item btn btn-outline tooltip"
				data-tip="展开其他平台的下载安装包"
				onclick={() => {
					expand = !expand
				}}
			>
				{#if expand}
					<Iconify icon={Expand2}></Iconify>
				{:else}
					<Iconify icon={Expand}></Iconify>
				{/if}
			</button>
		</div>
	</div>
	<div class="my-3">
		<h3 class="text-xl my-3">使用教程</h3>
		<div>
			<div class="join">
				<label
					for="guide-video-modal"
					class="join-item btn btn-primary btn-outline"
					class:btn-disabled={!pfiles?.guide?.download}
				>
					用户教程
					<Iconify icon={Play}></Iconify>
				</label>
				<label
					for="guide2-video-modal"
					class="join-item btn btn-outline"
					class:btn-disabled={!pfiles?.guide?.download}
				>
					服务提供者
					<Iconify icon={Play}></Iconify>
				</label>
				<a href="/well-jsnet/" class="join-item btn btn-outline" target="well-jsnet">
					在浏览器中体验
					<Iconify icon={ExtraLink}></Iconify>
				</a>
			</div>
		</div>
	</div>
	<div class="my-3">
		<h3 class="text-xl my-1">信令服务</h3>
		<p>如果你没有公网IP则需要使用信令中继来公开你的信令以便其他用户连接</p>
	</div>
	<div class="my-3">
		<div class="join">
			<a
				href="/user/"
				class="join-item btn btn-outline btn-primary tooltip"
				data-tip="付费服务, 简单快捷"
			>
				创建信令中继
			</a>
			<a
				href="https://github.com/remoon-net/salt-linker"
				class="join-item btn btn-outline tooltip"
				data-tip="完全由你控制"
				target="_blank"
			>
				自建信令中继
				<Iconify icon={ExtraLink}></Iconify>
			</a>
		</div>
	</div>
	{#if import.meta.env['VITE_PEER_SHARELINK']}
		{@const sl = import.meta.env['VITE_PEER_SHARELINK']}
		{@const ip6 = new URL(sl).searchParams.get('ip6')!.replace('/128', '')}
		<div class="my-3">
			<h3 class="text-xl my-3">示例节点分享链接</h3>
			<div class="join w-full">
				<button
					class="join-item btn"
					type="button"
					use:copy={{
						text: sl,
						onCopy: () => {
							showToast({
								msg: `复制成功: 示例节点分享链接`,
							})
						},
					}}
				>
					点击复制
				</button>
				<input class="join-item input flex-1" type="url" readonly value={sl} />
			</div>
			<div class="my-2">
				访问此节点: <a class="link" href="http://[{ip6}]" target={ip6}>{ip6}</a>
			</div>
		</div>
	{/if}

	<div class="my-3">
		<h3 class="text-xl my-1">特性</h3>
		<p class="my-1">well-net 是基于 WireGuard 和 WebRTC 编写的</p>
		<ul class="list">
			<li class="list-row px-0">
				<div class="text-4xl font-thin">1</div>
				<div>
					<h5 class="text-lg">简单</h5>
					<p>本质上是为 WireGuard 实现了一个 WebRTC 的传输层, 很容易修改</p>
				</div>
			</li>
			<li class="list-row px-0">
				<div class="text-4xl font-thin">2</div>
				<div>
					<h5 class="text-lg">支持浏览器</h5>
					<p>well-net 最初是为了将网页请求通过代理引入现有应用程序中, 所以是支持浏览器的</p>
				</div>
			</li>
			<li class="list-row px-0">
				<div class="text-4xl font-thin">3</div>
				<div>
					<h5 class="text-lg">IP 无冲突</h5>
					<p>通过使用 NAT 确保了所有人的 IP 不会冲突, 可以组成一个大型局域网</p>
				</div>
			</li>
			<li class="list-row px-0">
				<div class="text-4xl font-thin">4</div>
				<div>
					<h5 class="text-lg">缺点: 慢</h5>
					<p>
						由于 WireGuard 运行在 WebRTC 之上, 而 WebRTC 自带加密, 双重加密导致速度较慢orz,
						追求速度性能的话可以用 <a href="https://netbird.io/" class="link">NetBird</a>
					</p>
				</div>
			</li>
		</ul>
	</div>
</div>

<input type="checkbox" id="guide-video-modal" class="modal-toggle" bind:checked={guideOpen} />
<div class="modal" role="dialog">
	<div class="modal-box max-w-6xl w-full">
		<h3 class="text-xl mb-3">well-net 使用教程</h3>
		{#if !!pfiles?.guide?.download}
			<video
				bind:this={guideVideo}
				class="w-full aspect-video object-cover"
				src={pfiles?.guide.download}
				controls
				muted
			></video>
		{/if}
		<div class="modal-action">
			<label for="guide-video-modal" class="btn btn-outline"> 关闭 </label>
		</div>
	</div>
	<label class="modal-backdrop" for="guide-video-modal">Close</label>
</div>
