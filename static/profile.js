Vue.component('product---board', {
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
    <p><b>Total: ₹ {{ product.price * this.quantity }} /-</b></p>
    <p class = "text-info fw-bold">Your Order is being Processed 🥳</p>
    </div>
    </div>
    </div>`,
    props: ['productid', 'quantity', 'lan'],
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            product: {
                productname: "",
                productnamet: "",
                productnameh: "",
                price: "",
                unit: "",
                quantity: "",
                categoryid: ""
            },
            category: ""
        }
    },
    watch: {
        lan() {
            this.refresh()
        }
    },
    methods: {
        async refresh() {
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
    mounted: async function () {
        this.refresh()
    }
})

import NavBar from './navbar.js'

export default {
    template: `<div>
    <NavBar/>
    <div class = "p-4 bg-light">
    <p class = "h1">My Profile</p><br>
    <div class = "d-flex">
    <div class = "p-4 bg-dark bg-gradient rounded text-light">
    <p class = "h1 text-capitalize text-left">{{ username }} 🤩</p>
    <p><b>Email:</b> {{ email }}</p>
    <p><b>Application Language:</b></p>
    <select class = "form-select" v-model = "lan">
        <option value = "0">English</option>
        <option value = "1">தமிழ்</option>
        <option value = "2">हिंदी</option>
    </select>
    </div>
    </div>
    <div v-if = "cart != ''">
    <br>
    <p class = "h1">My Orders</p>
    <div class = "row">
    <div v-for = "car in cart" class = "p-3 col-3">
        <product---board v-bind:productid = "car.productid" v-bind:quantity = "car.quantity" :lan = "lan"></product---board>
    </div>
    </div>
    </div>
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            lan: localStorage.getItem('lan'),
            cart: ""
        }
    },
    watch: {
        lan() {
            localStorage.setItem('lan', this.lan)
        }
    },
    components: {
        NavBar
    },
    mounted: async function () {
        if (this.authToken == null || this.role == null) {
            this.$router.push({ path: '/login' })
        }
        else {
            const response = await fetch('/purchase', {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.cart = data)
        }
    }
}