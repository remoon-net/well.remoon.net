<script lang="ts">
	import { errStr, pb } from '$lib/pb'
	interface Props {
		pending: {
			value: boolean
			call<T = any>(fn: () => T | Promise<T>, min?: number): Promise<T>
		}
	}
	let { pending }: Props = $props()
	import { DateTime } from 'luxon'
	import { onMount } from 'svelte'
	interface OTPSend {
		email: string
		otpId: string
		expired?: DateTime
		at?: DateTime
	}
	function updateSend(send: any) {
		let b = { ...send }
		b.expired = b.expired?.toSQL()!
		b.at = b.at?.toSQL()!
		let s = JSON.stringify(b)
		localStorage.setItem('otp_send', s)
	}
	let email = $state('')
	let code = $state('')
	let send = $state<OTPSend>({ otpId: '', email: '' })
	let resendWait = $state(0)
	function check() {
		if (send.expired) {
			let s = send.expired.diffNow('seconds')
			if (s.seconds < 0) {
				send.otpId = ''
				updateSend(send)
			}
		}
		if (send.at) {
			resendWait = send.at.plus({ minute: 1 }).diffNow('seconds').seconds
		} else {
			resendWait = 0
		}
	}
	function recoveryOTP(): OTPSend {
		let s = localStorage.getItem('otp_send')
		if (!s) {
			return { email: '', otpId: '' }
		}
		let v: OTPSend = JSON.parse(s)
		v.at = DateTime.fromSQL(v.at as any as string)
		v.expired = DateTime.fromSQL(v.expired as any as string)
		return v
	}
	onMount(() => {
		let v = recoveryOTP()
		send = v
		email = send.email
		check()
	})
	onMount(() => {
		let t = setInterval(check, 1e3)
		return () => {
			clearInterval(t)
		}
	})
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { getShowToast } from '$lib/Toast.svelte'
	let { duration: otpDuration } = $derived(page.data.auths.otp)
	const users = pb.collection('users')
	async function requestOTP() {
		email = email.trim()
		code = ''
		let result = await users.requestOTP(email)
		let now = DateTime.now()
		let v: OTPSend = {
			email: email,
			otpId: result.otpId,
			expired: now.plus({ seconds: otpDuration - 10 }),
			at: now,
		}
		updateSend(v)
		send = v
		check()
	}
	async function login() {
		await users.authWithOTP(send.otpId, code)
		localStorage.removeItem('otp_send')
	}
	async function redirect() {
		let u = page.url.searchParams.get('redirect')
		if (!u) {
			u = '/user/'
		}
		await goto(u, { replaceState: true })
	}
	const showToast = getShowToast()
</script>

<form
	onsubmit={(e) => {
		e.preventDefault()
		if (!send.otpId) {
			pending
				.call(async () => {
					await requestOTP()
				})
				.catch((err) => {
					showToast({
						color: 'error',
						msg: `请求验证码出错: ${errStr(err)}`,
					})
				})
			return
		}
		// let d = new FormData(e.currentTarget)
		pending
			.call(async () => {
				await login()
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
				bind:value={email}
				disabled={pending.value}
				onchange={() => {
					if (!send.email) {
						return
					}
					let v = recoveryOTP()
					if (v.email != email) {
						send = { otpId: '', email: '' }
					} else {
						send = v
						check()
					}
				}}
			/>
		</label>
	</div>
	<div class="my-2">
		<div class="join w-full">
			<label class="join-item input w-full">
				<span class="label">代码</span>
				<input
					type="num"
					autocomplete="email"
					required
					name="password"
					placeholder="一次性代码"
					bind:value={code}
					disabled={pending.value || !send.otpId}
				/>
			</label>
			<button
				class="join-item btn"
				type="button"
				disabled={pending.value || !send.otpId || resendWait > 0}
				onclick={() => {
					pending
						.call(async () => {
							await requestOTP()
						})
						.catch((err) => {
							showToast({
								color: 'error',
								msg: `请求验证码出错: ${errStr(err)}`,
							})
						})
				}}
			>
				{#if resendWait > 0}
					{resendWait.toFixed(0)}s后可重发
				{:else}
					重发
				{/if}
			</button>
		</div>
	</div>
	<div class="my-2">
		{#if !send.otpId}
			<button type="submit" class="btn btn-block btn-primary" disabled={pending.value}>
				{#if send.expired}
					验证码已过期, 点击重新发送
				{:else}
					发送邮件验证码
				{/if}
			</button>
		{:else}
			<button type="submit" class="btn btn-block btn-primary" disabled={pending.value}>登录</button>
		{/if}
	</div>
</form>
