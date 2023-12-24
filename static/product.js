import NavBar from './navbar.js'

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
        <p v-if = "product.quantity != 0" class = "fs-5">Only {{ product.quantity }} {{ product.unit }} left</p>
        <p v-else class = "h3 text-danger"><br><b>Out of Stock 😓</b></p>
        <div v-if = "count == 0 && role == 'Manager'">
            <br>
            <p class = "btn btn-outline-warning col-4" @click = "update_product">Update</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p class = " col-4 btn btn-outline-danger" @click = "incr_count">Delete</p>
        </div/>
        <div v-else-if = "role == 'Manager'">
            <p class = "btn btn-outline-warning col-4" @click = "update_product">Update</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p class = "col-4 btn btn-danger" @click = "delete_product">Sure?</p>
        </div/>
        <div v-if = "role == 'User' && product.quantity != 0">
        <input type = "number" class = "form-control" placeholder = "Enter quantity" v-model = "quantity"><br>
        <button v-if = "quantity <= product.quantity" class = "btn btn-outline-success" @click = "cart">Add to Cart</button>
        <button v-else class = "btn btn-danger">Invalid Quantity</button>
        </div>
    </div>
    </div>
    </div>`,
    props: ['productid'],
    data() {
        return {
            product: {
                productname: "",
                price: "",
                unit: "",
                quantity: "",
                categoryid: ""
            },
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            category: "",
            count: 0,
            quantity: ""
        }
    },
    components: {
        NavBar
    },
    methods: {
        update_product() {
            localStorage.setItem('up-pro', this.productid)
            this.$router.push({ path: '/update_product' })
        },
        async delete_product() {
            var link = '/product/' + this.productid
            const response = await fetch(link, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            if (response.ok) {
                this.$router.push({ path: '/products/' + this.product.categoryid })
            }
        },
        incr_count() {
            this.count++
        },
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