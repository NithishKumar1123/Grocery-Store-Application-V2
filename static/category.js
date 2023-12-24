Vue.component('category-board', {
    template: `<div v-if = "count == 0" class = "row p-3">
    <a class = "h4 col-4" v-if = "lan == 0" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categoryname }}</a>
    
    <a class = "h4 col-4" v-if = "lan == 1" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categorynamet }}</a>
    
    <a class = "h4 col-4" v-if = "lan == 2" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categorynameh }}</a>
    
    <a class = "btn btn-outline-primary col-2" v-bind:href = "'#/products/' + cat['categoryid']">View More</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            
    <button v-if = "role == 'Admin'" class = "btn btn-outline-warning col-2" @click = "update_category(cat['categoryid'])">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
    <button v-if = "role == 'Admin'" class = "col-2 btn btn-outline-danger" @click = "incr_count">Delete</button>
    
    </div>
    
    <div v-else class = "row p-3">
    
    <a class = "h4 col-4" style = "text-decoration: none;" v-bind:href = "'#/products/' + cat['categoryid']">{{ cat.categoryname }}</a>
        
    <a class = "btn btn-outline-primary col-2" v-bind:href = "'#/products/' + cat['categoryid']">View More</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            
    <button v-if = "role == 'Admin'" class = "btn btn-outline-warning col-2" @click = "update_category(cat['categoryid'])">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
    <button v-if = "role == 'Admin'" class = "col-2 btn btn-danger" @click = "delete_category(cat['categoryid'])">Sure?</button>
    
    </div>`,
    props: ['cat'],
    data: function () {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            lan: localStorage.getItem('lan'),
            count: 0
        }
    },
    methods: {
        update_category(categoryid) {
            localStorage.setItem('up-cat', categoryid)
            this.$router.push({ path: '/update_category' })
        },
        async delete_category(categoryid) {
            var link = '/category/' + categoryid
            const result = await fetch(link, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.authToken
                }
            })
            if (result.ok) {
                this.$emit("refresh")
            }
        },
        incr_count() {
            this.count++
        }
    }

})

import NavBar from './navbar.js'
import RequestCategory from './manager/components/request_category.js'

export default {
    template: `<div>
    <NavBar/>
    <div class = "p-4 bg-light">
    <p class = "h1">All Category</p><br>
    <div v-if = "role == 'Manager'" class = "position-fixed" style = "top: 175px; right: 100px; width: 385px">
        <RequestCategory/>
    </div>
    <div v-for = "cat in category">
        <category-board v-bind:cat = "cat" v-on:refresh = "refresh"></category-board>
    </div>
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            category: []
        }
    },
    components: {
        NavBar,
        RequestCategory
    },
    methods: {
        async refresh() {
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