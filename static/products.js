Vue.component('product-board', {
    template: `<div v-if = "count == 0" class = "row p-3">
    <a class = "h4 col-4" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/product/' + pro['productid']">{{ pro.productname }}</a>
    <a class = "h4 col-4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/product/' + pro['productid']">{{ pro.productnamet }}</a>
    <a class = "h4 col-4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/product/' + pro['productid']">{{ pro.productnameh }}</a>
    
    <a class = "btn btn-outline-primary col-2" v-bind:href = "'#/product/' + pro['productid']">View More</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
    <button v-if = "role == 'Manager'" class = "btn btn-outline-warning col-2" @click = "update_product(pro['productid'])">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
    <button v-if = "role == 'Manager'" class = " col-2 btn btn-outline-danger" @click = "incr_count">Delete</button>
    
    </div>
    
    <div v-else class = "row p-3">
    
    <a class = "h4 col-4" style = "text-decoration: none;" v-bind:href = "'#/product/' + pro['productid']">{{ pro.productname }}</a>
    
    
    <a class = "btn btn-outline-primary col-2" v-bind:href = "'#/product/' + pro['productid']">View More</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                
    <button v-if = "role == 'Manager'" class = "btn btn-outline-warning col-2" @click = "update_product(pro['productid'])">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
    <button v-if = "role == 'Manager'" class = " col-2 btn btn-danger" @click = "delete_product(pro['productid'])">Sure?</button>
    </div>`,
    props: ['pro'],
    data: function () {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            count: 0
        }
    },
    methods: {
        update_product(productid) {
            localStorage.setItem('up-pro', productid)
            this.$router.push({ path: '/update_product' })
        },
        async delete_product(productid) {
            var link = '/product/' + productid
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
        }
    }
})

import NavBar from './navbar.js'

export default {
    template: `<div>
    <NavBar/>
    <div class = "p-4 bg-light">
    <p class = "h1" v-if = "lan == 0">{{ category.categoryname }}</p>
    <p class = "h1" v-if = "lan == 1">{{ category.categorynamet }}</p>
    <p class = "h1" v-if = "lan == 2">{{ category.categorynameh }}</p>
    <div v-if = "products != ''">
    <br>
        <div v-for = "pro in products">
            <product-board v-bind:pro = "pro" v-bind:categoryid = "categoryid" v-on:refresh = "refresh"></product-board>
        </div>
    </div>
    <div v-else>
    <p class = "h2"><br>Oops! We don't have any product in this category yet. 😦</p>
    </div>
    <br>
    </div>
    </div>`,
    props: ['categoryid'],
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            category: '',
            products: "",
            count: 0
        }
    },
    methods: {
        async refresh() {
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
    },
    components: {
        NavBar
    },
    mounted: async function () {
        if (this.authToken == null || this.role == null) {
            this.$router.push({ path: '/login' })
        }
        else {
            var link = '/categoryname/' + this.categoryid
            await fetch(link, {
                method: 'GET',
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.category = data)

            this.refresh()
        }
    }
}