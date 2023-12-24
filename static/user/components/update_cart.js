import NavBar from '../../navbar.js'

export default {
    template: `<div>
    <NavBar/><br><br><br>
    <div class = "d-flex justify-content-center">
    <div class = "p-5 bg-dark bg-gradient rounded text-light text-center">
        <p class = "h1" v-if = "lan == 0">{{ product.productname }}</p>
        <p class = "h1" v-if = "lan == 1">{{ product.productnamet }}</p>
        <p class = "h1" v-if = "lan == 2">{{ product.productnameh }}</p>
        <a class = "h4" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/products/' + product.categoryid">{{ category.categoryname }}</a>
        <a class = "h4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/products/' + product.categoryid">{{ category.categorynamet }}</a>
        <a class = "h4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/products/' + product.categoryid">{{ category.categorynameh }}</a><br><br><br>
        <p class = "fs-5"><b>Price: </b>₹ {{ product.price }} / {{ product.unit }}</p>
        <p v-if = "product.quantity != 2" class = "fs-5">Only {{ product.quantity }} {{ product.unit }} left</p>
        <p v-else class = "text-danger"><b>Out of Stock ☹</b></p><br>
        <div v-if = "role == 'User'">
        <input type = "number" class = "form-control" placeholder = "Enter quantity" v-model = "quantity"><br>
        <button v-if = "quantity <= product.quantity" class = "btn btn-outline-success" @click = "update_cart">Update Cart</button>
        <button v-else class = "btn btn-danger">Invalid Quantity</button>
        </div>
    </div>
    </div>
    </div>`,
    data() {
        return {
            product: {
                productname: "",
                productnamet: "",
                productnameh: "",
                price: "",
                unit: "",
                quantity: "",
                categoryid: ""
            },
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            productid: localStorage.getItem('up-car'),
            category: "",
            quantity: localStorage.getItem('up-q')
        }
    },
    components: {
        NavBar
    },
    methods: {
        async update_cart() {
            if (this.quantity > 0) {
                await fetch('/cart', {
                    method: 'PUT',
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
        localStorage.removeItem('up-car')
        localStorage.removeItem('up-q')
        if (this.authToken == null || this.role == null) {
            this.$router.push({ path: '/login' })
        }
        else {
            var link = '/product/' + this.productid
            const result = await fetch(link, {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            const data = await result.json()
            if (result.ok) {
                this.product = data
            }

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
    }
}