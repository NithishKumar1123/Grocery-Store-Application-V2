Vue.component('product--board', {
    template: `<div>
    <div class = "p-3 bg-dark bg-gradient rounded text-light text-center mb-3" style = "width: 250px">
    <a class = "h4" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/product/' + productid">{{ product.productname }}</a>
    <a class = "h4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/product/' + productid">{{ product.productnamet }}</a>
    <a class = "h4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/product/' + productid">{{ product.productnameh }}</a><br>
    <a class = "h6" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/products/' + product.categoryid">{{ category.categoryname }}</a>
    <a class = "h6" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/products/' + product.categoryid">{{ category.categorynamet }}</a>
    <a class = "h6" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/products/' + product.categoryid">{{ category.categorynameh }}</a><br><br>
    <p><b>Price: </b>₹ {{ product.price }} / {{ product.unit }}</p>
    <p v-if = "product.quantity != 0">Only {{ product.quantity }} {{ product.unit }} left</p>
    <p v-else class = "text-danger"><b>Out of Stock 😓</b></p>
    <div v-if = "role == 'User'">
    <p><b>Quantity:</b> {{ this.quantity }} {{ product.unit }}</p>
    <p><b>Total: ₹ {{ product.price * this.quantity }} /-</b></p><br>
    <div v-if = "count == 0">
    <button class = "btn btn-outline-warning" @click = "update_cart">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class = "btn btn-outline-danger" @click = "incr_count">Delete</button><br><br>
    </div>
    <div v-else>
    <button class = "btn btn-outline-warning" @click = "update_cart">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class = "btn btn-outline-danger" @click = "delete_cart">Sure?</button><br><br>
    </div>
    <button class = "btn btn-outline-success" @click = "purchase">Purchase</button>
    </div>
    </div>
    </div>`,
    props: ['cartid', 'productid', 'quantity'],
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
            category: "",
            count: 0
        }
    },
    methods: {
        update_cart() {
            localStorage.setItem('up-car', this.productid)
            localStorage.setItem('up-q', this.quantity)
            this.$router.push({ path: '/update_cart' })
        },
        async delete_cart() {
            var link = '/cart/' + this.productid
            const response = await fetch(link, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            if (response.ok) {
                this.$emit("refresh")
            }
        },
        incr_count() {
            this.count++
        },
        async purchase() {
            var link = '/purchase/' + this.cartid
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            if (response.ok) {
                this.$emit("refresh")
            }
        },
        async ref() {
            var link = '/product/' + this.productid
            await fetch(link, {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.product = data)

            var link = '/categoryname/' + this.product.categoryid
            await fetch(link, {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.category = data)
        }
    },
    watch: {
        productid() {
            this.ref()
        }
    },
    mounted: async function () {
        this.ref()
    }
})

import NavBar from '../../navbar.js'

export default {
    template: `<div>
    <NavBar/>
    <div class = "p-4">
    <div class = "h1">My Cart</div>
    <div v-if = "total != 0" class = "row">
    <div v-for = "car in cart" class = "p-3 col-3">
        <product--board v-bind:cartid = "car.cartid" v-bind:productid = "car.productid" v-bind:quantity = "car.quantity" v-on:refresh = "refresh"></product--board>
    </div>
    </div>
    <div v-else>
        <p class = "h2"><br>Items added to cart will be shown here. Have fun shopping!!! 😍</p>
    </div>
    </div>
    <nav v-if = "total != 0" class = "navbar sticky-bottom navbar-expand-lg bg-dark bg-gradient">
    <div class = "container-fluid">
    <div class = "collapse navbar-collapse justify-content-justify">
        <ul class = "navbar-nav">
			<li class = "nav-item">
            <div class = "nav-link text-light me-5"><b>Grand Total: ₹ {{ total }} /-</b></div>
            </li>
            <li class = "nav-item">
                <div class = "nav-link text-light">&nbsp;</div>
            </li>
            <li class = "nav-item" v-if = "count == 0">
            <button class = "btn btn-outline-success ms-5" @click = "incr_count">Purchase All</button>
            </li>
            <li class = "nav-item" v-else>
            <button class = "btn btn-success ms-5" @click = "purchaseall">Sure?</button>
            </li>
        </ul>
    </div>
    </div>
    </nav>
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            cart: [],
            total: 0,
            count: 0
        }
    },
    components: {
        NavBar
    },
    methods: {
        async refresh() {
            await fetch('/purchaseall', {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.total = data)
            await fetch('/cart', {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.cart = data)
        },
        async purchaseall() {
            await fetch('/purchaseall', {
                method: "POST",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => {
                    if (response.ok) {
                        this.$router.push({ path: '/profile' })
                    }
                })
        },
        incr_count() {
            this.count++
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