Vue.component('product----board', {
    template: `<div>
    <div class = "p-3 bg-dark bg-gradient rounded text-light text-center mb-5" style = "width: 250px">
    <a class = "h4" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/product/' + productid">{{ product.productname }}</a>
    <a class = "h4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/product/' + productid">{{ product.productnamet }}</a>
    <a class = "h4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/product/' + productid">{{ product.productnameh }}</a><br><br>
    <p><b>Price: </b>₹ {{ product.price }} / {{ product.unit }}</p>
    <p v-if = "product.quantity != 0">Only {{ product.quantity }} {{ product.unit }} left</p>
    <p v-else class = "h5 text-danger"><b>Out of Stock 😓</b></p>
    <div v-if = "role == 'User' && product.quantity != 0">
    <br>
    <input type = "number" class = "form-control" placeholder = "Enter quantity" v-model = "quantity"><br>
    <button v-if = "quantity <= product.quantity" class = "btn btn-outline-success" @click = "cart">Add to Cart</button>
    <button v-else class = "btn btn-danger">Invalid Quantity</button>
    </div>
    </div>
    </div>`,
    props: ['productid'],
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            product: {
                productname: "",
                productnamet: "",
                productnameh: "",
                price: "",
                unit: "",
                quantity: "",
                categoryid: ""
            },
            quantity: "",
            toggle: true
        }
    },
    methods: {
        async cart() {
            if (this.quantity > 0) {
                await fetch('/cart', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.authToken
                    },
                    body: JSON.stringify({
                        "productid": this.productid,
                        "quantity": this.quantity
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            this.$router.push({ path: '/cart' })
                        }
                    })
            }
        },
        async refresh() {
            var link = '/product/' + this.productid
            await fetch(link, {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.product = data)
        }
    },
    watch: {
        productid() {
            this.refresh()
        }
    },
    mounted: async function () {
        this.refresh()
    }
})

import NavBar from './navbar.js'

export default {
    template: `<div>
    <NavBar/>
    <div class = "p-4 bg-light">
    <div v-if = "toggle == 0">
        <p class = "h1" >Search by Product</p><br>
    </div>
    <div v-if = "toggle == 1">
        <p class = "h1">Search by Category</p><br>
    </div>
    <div v-if = "product != '' && toggle == 0" class = "row">
        <div v-for = "pro in product" class = "col-3">
            <product----board v-bind:productid = "pro.productid"></product----board>
        </div>
    </div>
    <div v-else-if = "category != '' && toggle == 1">
        <div v-for = "cat in category" class = "row p-3">
        <a class = "h4 col-4" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categoryname }}</a>
        <a class = "h4 col-4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categorynamet }}</a>
        <a class = "h4 col-4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categorynameh }}</a>
        <a class = "btn btn-outline-primary col-2" v-bind:href = "'#/products/' + cat['categoryid']">View More</a>
        </div>
    </div>
    <div v-else-if = "toggle == 0">
        <p class = "h2">Oops! We don't have the product you are searching for. 😦</p>
    </div>
    <div v-else-if = "toggle == 1">
        <p class = "h2">Oops! We don't have the category you are searching for. 😦</p>
    </div>
    </div>
    <nav v-if = "product != '' || category != ''" class = "navbar sticky-bottom navbar-expand-lg bg-dark bg-gradient">
    <div class = "container-fluid">
    <div class = "collapse navbar-collapse justify-content-justify">
        <ul class = "navbar-nav">
			<li class = "nav-item" v-if = "toggle == 0">
                <div class = "nav-link text-light me-5"><b>Filter by Price:</b></div>
            </li>
            <li class = "nav-item" v-if = "toggle == 0">
                <button class = "btn btn-outline-primary ms-3 me-5" @click = "ascending">Ascending</button>
            </li>
            <li class = "nav-item" v-if = "toggle == 0">
                <button class = "btn btn-outline-primary ms-3 me-5" @click = "descending">Descending</button>
            </li>
            <li class = "nav-item" v-if = "toggle == 0">
                <div class = "nav-link text-light me-5">|</div>
            </li>
            <li class = "nav-item">
                <input class = "form-control" type = "text" placeholder = "Search by Category" size = "15" v-model = "searchc"/>
            </li>
            <li class = "nav-item">
                <button class = "btn btn-outline-primary ms-5" @click = "searchcfn">Search</button>
            </li>
        </ul>
    </div>
    </div>
    </nav>
    </div>`,
    props: ['search'],
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            lan: localStorage.getItem('lan'),
            product: "",
            category: "",
            sort: 0,
            searchc: "",
            toggle: 0
        }
    },
    components: {
        NavBar
    },
    watch: {
        category() {
            this.toggle = 1
        },
        search() {
            this.toggle = 0
            this.refresh()
        }
    },
    methods: {
        ascending() {
            this.sort = 0
            this.refresh()
        },
        descending() {
            this.sort = 1
            this.refresh()
        },
        async searchcfn() {
            let link = "/searchc/" + this.searchc
            await fetch(link, {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data == []) {
                    }
                    else {
                        this.category = data
                    }
                })
        },
        async refresh() {
            let link = "/search/" + this.search + "/" + this.sort
            await fetch(link, {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data == []) {
                    }
                    else {
                        this.product = data
                    }
                })
        }
    },
    mounted: async function () {
        if (this.authToken == null || this.role == null) {
            this.$router.push({ path: '/login' })
        }
        else {
            this.refresh()
        }
    }
}