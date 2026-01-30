<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { withPending } from '$lib/pending.svelte.js'

	async function redirect() {
		let u = page.url.searchParams.get('redirect')
		if (!u) {
			u = '/user/'
		}
		await goto(u, { replaceState: true })
	}
	let { data } = $props()
	$inspect(data)
	let pending = withPending()
	import Iconify from '@iconify/svelte'
	import Google from '@iconify-icons/logos/google-icon'
	import Github from '@iconify-icons/logos/github-icon'
	import Phone from '@iconify-icons/heroicons/device-phone-mobile'
	import Wechat from './wechat-logo-svgrepo-com.svg'
	import { errStr, pb } from '$lib/pb.js'
	let tab = $derived.by(() => {
		let hash = page.url.hash.slice(1)
		if (!hash) {
			if (data.auths.password.enabled) {
				return 'email_login'
			}
			return 'email_otp'
		}
		return hash
	})
	async function login(form: FormData) {
		let email = form.get('identity') as string
		let pass = form.get('password') as string
		await pb.collection('users').authWithPassword(email, pass)
	}
	async function register(form: FormData) {
		await pb.collection('users').create(form)
	}
	async function oauth2Login(p: AuthProviderInfo) {
		await pb.collection('users').authWithOAuth2({
			provider: p.name,
		})
	}
	let phoneLink = $state('')
	let showPhoneLogin = $state(false)
	$effect(() => {
		showPhoneLogin = phoneLink != ''
	})
	async function phoneLogin(p: AuthProviderInfo) {
		await pb.collection('users').authWithOAuth2({
			requestKey: 'phone-login',
			provider: p.name,
			urlCallback: (link) => {
				phoneLink = link
			},
		})
	}
	import OTP from './otp.svelte'
	import { getShowToast } from '$lib/Toast.svelte'
	import type { AuthProviderInfo } from 'pocketbase'
	let showToast = getShowToast()
	let auths = $derived(data.auths)
</script>

<!-- Put this part before </body> tag -->
<input
	type="checkbox"
	id="phone_login_modal"
	class="modal-toggle"
	bind:checked={showPhoneLogin}
	onchange={(e) => {
		if (e.currentTarget.checked) {
			return
		}
		pb.cancelRequest('phone-login')
	}}
/>
<div class="modal" role="dialog">
	<div class="modal-box p-0">
		<iframe src={phoneLink} class="w-full h-[300px]" frameborder="0" title="手机号登录"></iframe>
		<div class="modal-action p-3">
			<label for="phone_login_modal" class="btn">关闭</label>
		</div>
	</div>
	<label class="modal-backdrop" for="phone_login_modal">Close</label>
</div>

<div class="container mx-auto my-6">
	{#if auths.password.enabled || auths.otp.enabled}
		<div role="tablist" class="tabs tabs-box justify-center my-3">
			{#if data.auths.password.enabled}
				<a
					type="radio"
					class="tab"
					href="#email_login"
					class:tab-active={tab == 'email_login'}
					class:tab-disabled={pending.value}
				>
					登录
				</a>
				<a
					type="radio"
					class="tab"
					href="#email_register"
					class:tab-active={tab == 'email_register'}
					class:tab-disabled={pending.value}
				>
					注册
				</a>
			{/if}
			{#if data.auths.otp.enabled}
				<a
					type="radio"
					class="tab"
					href="#email_otp"
					class:tab-active={tab == 'email_otp'}
					class:tab-disabled={pending.value}
				>
					验证码登录
				</a>
			{/if}
		</div>
		{#if tab === 'email_login'}
			<form
				onsubmit={(e) => {
					e.preventDefault()
					let d = new FormData(e.currentTarget)
					pending
						.call(async () => {
							await login(d)
							await redirect()
						})
						.catch((err) => {
							showToast({
								color: 'error',
								msg: `登录出错: ${errStr(err)}`,
							})
						})
				}}
			>
				<div class="my-2">
					<label class="input w-full">
						<span class="label">邮箱</span>
						<input
							type="email"
							autocomplete="email"
							name="identity"
							required
							placeholder="邮箱地址"
							disabled={pending.value}
						/>
					</label>
				</div>
				<div class="my-2">
					<label class="input w-full">
						<span class="label">密码</span>
						<input
							type="password"
							autocomplete="email"
							required
							name="password"
							placeholder="密码"
							disabled={pending.value}
						/>
					</label>
				</div>
				<div class="my-2">
					<button type="submit" class="btn btn-block btn-primary" disabled={pending.value}>
						登录
					</button>
				</div>
				<div class="my-2">
					<a href="/login/reset/" class="btn btn-block btn-outline">找回密码</a>
				</div>
			</form>
		{:else if tab == 'email_register'}
			<form
				onsubmit={(e) => {
					e.preventDefault()
					let d = new FormData(e.currentTarget)
					pending
						.call(async () => {
							if (d.get('password') != d.get('passwordConfirm')) {
								throw new Error('两次密码输入不一致')
							}
							await register(d)
							await redirect()
						})
						.catch((err) => {
							showToast({
								color: 'error',
								msg: `注册出错: ${errStr(err)}`,
							})
						})
				}}
			>
				<div class="my-2">
					<label class="input w-full">
						<span class="label">邮箱</span>
						<input
							type="email"
							autocomplete="email"
							name="email"
							required
							placeholder="邮箱地址"
							disabled={pending.value}
						/>
					</label>
				</div>
				<div class="my-2">
					<label class="input w-full">
						<span class="label">密码</span>
						<input
							type="password"
							autocomplete="email"
							required
							name="password"
							placeholder="密码"
							disabled={pending.value}
						/>
					</label>
				</div>
				<div class="my-2">
					<label class="input w-full">
						<span class="label">密码</span>
						<input
							type="password"
							autocomplete="email"
							required
							name="passwordConfirm"
							placeholder="再输入密码确认"
							disabled={pending.value}
						/>
					</label>
				</div>
				<button type="submit" class="btn btn-block btn-primary" disabled={pending.value}
					>注册</button
				>
			</form>
		{:else if tab === 'email_otp'}
			<OTP {pending}></OTP>
		{/if}
	{/if}
	{#if data.auths.oauth2.enabled}
		<div class="divider">第三方登录</div>
		<div class="my-2">
			{#each data.auths.oauth2.providers as p}
				{#if p.displayName === '微信登录'}
					<button
						type="button"
						class="btn btn-primary btn-outline btn-block mb-2"
						disabled={pending.value}
					>
						<img src={Wechat} class="size-5" alt="wechat" width="300" height="300" />
						通过微信扫码登录
					</button>
				{:else if p.displayName === '手机号登录'}
					<button
						type="button"
						class="btn btn-primary btn-outline btn-block mb-2"
						disabled={pending.value}
						onclick={(e) => {
							pending
								.call(async () => {
									await phoneLogin(p)
									await redirect()
								})
								.catch((err) => {
									if (err?.isAbort) {
										return
									}
									showToast({
										color: 'error',
										msg: `${p.displayName} 登录出错: ${errStr(err)}`,
									})
								})
						}}
					>
						<Iconify icon={Phone}></Iconify>
						使用手机号登录
					</button>
				{:else}
					<button
						type="button"
						class="btn btn-primary btn-outline btn-block mb-2"
						disabled={pending.value}
						onclick={(e) => {
							pending
								.call(async () => {
									await oauth2Login(p)
									await redirect()
								})
								.catch((err) => {
									showToast({
										color: 'error',
										msg: `${p.displayName} 登录出错: ${errStr(err)}`,
									})
								})
						}}
					>
						{#if p.name === 'google'}
							<Iconify icon={Google}></Iconify>
							通过 Google 登录
						{:else if p.name === 'github'}
							<Iconify icon={Github}></Iconify>
							通过 Github 登录
						{:else}
							通过 {p.displayName} 登录
						{/if}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
