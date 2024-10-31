<script setup lang="ts">

</script>

<template>
	<el-container direction="vertical" class="min-100vh">
		<Header/>
		<el-container>
			<AsideLeft class="aside-left"/>
			<el-main>
				<slot/>
			</el-main>
			<AsideRight class="aside-right"/>
		</el-container>
		<Footer/>
	</el-container>
	<Background/>
</template>

<style scoped>
.el-aside {
	min-width: 12rem;
}

@media screen and (max-width: 70em) {
	.aside-left {
		width: 20%;
	}

	.aside-right {
		display: none;
	}
}

@media screen and (max-width: 55em) {
	.aside-left {
		display: none;
	}
}
</style>