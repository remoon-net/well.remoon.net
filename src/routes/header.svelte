<script lang="ts">
	let navs = [
		{
			name: '首页',
			link: '/',
		},
		{
			name: '链接2',
			link: '#2',
			subnav: [
				{
					name: '子链接1',
					link: '#21',
				},
				{
					name: '子链接2',
					link: '#22',
				},
			],
		},
		{
			name: '链接3',
			link: '#3',
		},
	]
</script>

<div class="navbar container mx-auto">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost text-xl">well-net</a>
	</div>
	<div class="navbar-center">
	</div>
	<div class="navbar-end">
		<ul class="menu menu-horizontal">
			<li>
				<a href="/user/">用户中心</a>
			</li>
		</ul>
	</div>
</div>
