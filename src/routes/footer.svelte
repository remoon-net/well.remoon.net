<script lang="ts">
	import Iconify from '@iconify/svelte'
	import ExtraLink from '@iconify-icons/heroicons/arrow-top-right-on-square'
</script>

<footer class="footer sm:footer-horizontal container mx-auto p-10">
	<aside>
		<img src="/android-chrome-512x512.png" alt="logo" width="50" height="50" />
		<p>
			ACME Industries Ltd.
			<br />
			Providing reliable tech since 1992
		</p>
	</aside>
	<nav>
		<h6 class="footer-title">well-net</h6>
		<a href="/" class="link link-hover">首页</a>
		<a href="/#download" class="link link-hover">下载</a>
		<a href="/legal/well-net/privacy/" class="link link-hover">隐私条款</a>
		<a href="https://github.com/remoon-net/well" class="link link-hover" target="_blank">
			源代码 <button><Iconify icon={ExtraLink}></Iconify></button>
		</a>
	</nav>
	<nav>
		<h6 class="footer-title">信令中继</h6>
		<a href="/user/ " class="link link-hover">用户中心</a>
		<a href="/legal/salt-linker/terms/" class="link link-hover">服务条款</a>
		<a href="/legal/salt-linker/privacy/" class="link link-hover">隐私条款</a>
		<a href="https://github.com/remoon-net/salt-linker" class="link link-hover" target="_blank">
			源代码 <button><Iconify icon={ExtraLink}></Iconify></button>
		</a>
	</nav>
	<nav>
		<h6 class="footer-title">社区</h6>
		<a href="https://github.com/remoon-net/well/issues" class="link link-hover" target="_blank">
			问题反馈 <button><Iconify icon={ExtraLink}></Iconify></button>
		</a>
		<a href="https://github.com/remoon-net/well/discussions" class="link link-hover" target="_blank">
			社区讨论 <button><Iconify icon={ExtraLink}></Iconify></button>
		</a>
	</nav>
</footer>

<style>
	nav > a {
		white-space: nowrap;
	}
</style>
