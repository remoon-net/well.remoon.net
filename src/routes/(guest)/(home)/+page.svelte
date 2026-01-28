<script lang="ts">
	const version = 'v0.0.1'
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
</script>

<div class="container mx-auto my-6">
	<div class="my-3">
		<h3 class="text-3xl my-1">well-net</h3>
		<p>
			<a href="https://github.com/remoon-net/well" class="link">well-net</a>
			是一款帮助用户和他人建立<b>安全交流网络</b>的组网软件.
		</p>
	</div>
	<div class="my-3">
		<h3 class="text-xl my-1" id="download">下载安装包(64位)</h3>
		<p>
			其他架构的请 自己构建 或
			<a href="https://github.com/remoon-net/well/issues" class="link">提出需求</a>
		</p>
	</div>
	<div class="my-3">
		<div class="join flex-wrap">
			<a
				href="/install/{version}/well-net-x64.exe"
				download="well-net-x64.exe"
				class="join-item btn btn-primary btn-outline"
			>
				Windows
			</a>
			<a
				href="/install/{version}/well-net-arm64.apk"
				download="well-net-arm64.apk"
				class="join-item btn btn-primary btn-outline"
			>
				Android
			</a>
			<a
				href="/install/{version}/well-net-x64.deb"
				download="well-net-x64.deb"
				class="join-item btn btn-primary btn-outline"
			>
				Linux (deb)
			</a>
			<a
				href="#disabled"
				download="well-net.exe"
				class="join-item btn btn-primary btn-outline btn-disabled"
			>
				iPhone
			</a>
			<a
				href="#disabled"
				download="well-net.exe"
				class="join-item btn btn-primary btn-outline btn-disabled"
			>
				MacOS
			</a>
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
	<div class="my-3">
		<h3 class="text-xl my-3">使用教程</h3>
		<div>
			<label for="guide-video-modal" class="btn btn-outline">
				<Iconify icon={Play}></Iconify>
				点击播放使用教程
			</label>
		</div>
	</div>
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
		<video
			bind:this={guideVideo}
			class="w-full aspect-video object-cover"
			src="/install/guide.mp4"
			controls
		></video>
		<div class="modal-action">
			<label for="guide-video-modal" class="btn btn-outline"> 关闭 </label>
		</div>
	</div>
	<label class="modal-backdrop" for="guide-video-modal">Close</label>
</div>
