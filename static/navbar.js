export default {
	template: `<nav class = "navbar sticky-top navbar-expand-lg bg-dark bg-gradient">
	<div class = "container-fluid">
		<div v-if = "role == 'User'">
			<router-link to = "/products" class = "fw-bold navbar-brand fs-4 badge bg-danger bg-gradient">MarketMate</router-link>
			
		</div>
		<div v-else>
			<router-link to = "/dashboard" class = "fw-bold navbar-brand fs-4 badge bg-danger bg-gradient">MarketMate</router-link>
		</div>
		<div class = "navbar-brand fw-bold text-light text-capitalize d-inline-flex">Welcome {{ username }} 😊</div>
		<div class = "collapse navbar-collapse justify-content-end">
			<ul class = "navbar-nav">
				<li class = "nav-item">
					<input class = "form-control" type = "text" placeholder = "Search by Product" size = "12" v-model = "search"/>
				</li>
				<li class = "nav-item">
					<button class = "btn btn-outline-primary ms-2 me-2" @click = "searchfn">Search</button>
				</li>
				<li class = "nav-item">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item" v-if = "role != 'User'">
					<router-link class = "nav-link btn btn-danger text-light" to = "/dashboard">Dashboard</router-link>
				</li>
				<li class = "nav-item" v-if = "role != 'User'">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item" v-if = "role == 'User'">
					<router-link class = "nav-link btn btn-danger text-light" to = "/profile">My Profile</router-link>
				</li>
				<li class = "nav-item" v-if = "role == 'User'">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item" v-if = "role == 'User'">
					<router-link class = "nav-link btn btn-danger text-light" to = "/cart">My Cart&nbsp;&nbsp;<span class="badge bg-primary">{{ count }}</span></router-link>
				</li>
				<li class = "nav-item" v-if = "role == 'User'">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item">
					<router-link class = "nav-link btn btn-danger text-light" to = "/category">All Category</router-link>
				</li>
				<li class = "nav-item">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item">
					<router-link class = "nav-link btn btn-danger text-light" to = "/products">All Products</router-link>
				</li>
				<li class = "nav-item">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item" v-if = "role == 'Admin'">
					<router-link class = "nav-link btn btn-danger text-light" to = "/create_category">Add New Category</router-link>
				</li>
				<li class = "nav-item" v-if = "role == 'Admin'">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item" v-if = "role == 'Manager'">
					<router-link class = "nav-link btn btn-danger text-light" to = "/create_product">Add New Product</router-link>
				</li>
				<li class = "nav-item" v-if = "role == 'Manager'">
					<div class = "nav-link text-light">|</div>
				</li>
				<li class = "nav-item">
					<button class = "nav-link btn btn-danger text-light" @click = "logout">Logout</button>
				</li>
			</ul>
		</div>
	</div>
	</nav>`,
	data() {
		return {
			role: localStorage.getItem('role'),
			authToken: localStorage.getItem('auth-token'),
			username: localStorage.getItem('username'),
			count: 0,
			search: ""
		}
	},
	methods: {
		async searchfn() {
			if (this.search != "") {
				this.$router.push({ path: '/search/' + this.search })
			}
		},
		logout() {
			localStorage.removeItem('auth-token')
			localStorage.removeItem('role')
			localStorage.removeItem('username')
			localStorage.removeItem('email')
			localStorage.removeItem('lan')
			window.location.href = "http://localhost:5000/logout"
		}
	},
	mounted: async function () {
		if (this.authToken == null || this.role == null) {
			this.$router.push({ path: '/login' })
		}
		else {
			await fetch("/cartcount", {
				headers: {
					"Authentication-Token": this.authToken
				}
			})
				.then(response => response.json())
				.then(data => this.count = data)
		}
	}
}