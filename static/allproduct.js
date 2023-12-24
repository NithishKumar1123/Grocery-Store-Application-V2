Vue.component('productboard', {
    template: `<div>
    <div class = "p-3 bg-dark bg-gradient rounded text-light text-center" style = "width: 250px">
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
        }
    },
    mounted: async function () {
        var link = '/product/' + this.productid
        await fetch(link, {
            headers: {
                "Authentication-Token": this.authToken
            }
        })
            .then(response => response.json())
            .then(data => this.product = data)
    }
})

Vue.component('categoryboard', {
    template: `<div class = "row">
        <productboard v-for = "pro in products" class = "col-3 mb-3" v-bind:productid = "pro.productid"></productboard>
    </div>`,
    props: ['categoryid'],
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            products: []
        }
    },
    mounted: async function () {
        var link = '/products/' + this.categoryid
        await fetch(link, {
            method: 'GET',
            headers: {
                "Authentication-Token": this.authToken
            }
        })
            .then(response => response.json())
            .then(data => this.products = data)
    }
})

import NavBar from './navbar.js'

export default {
    template: `<div>
    <NavBar/>
    <div v-for = "cat in category" >
        <div class = "p-4 bg-light">
        <a class = "h1" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat.categoryid">{{ cat.categoryname }}</a>
        <a class = "h4 col-4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categorynamet }}</a>
        <a class = "h4 col-4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categorynameh }}</a><br><br>
        <categoryboard v-bind:categoryid = "cat.categoryid"></categoryboard>
        </div>
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            category: []
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
            const result = await fetch('/allcategory', {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            const data = await result.json()
            if (result.ok) {
                this.category = data
            }
        }
    }
}