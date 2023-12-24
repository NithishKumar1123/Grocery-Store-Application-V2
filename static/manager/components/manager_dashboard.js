import NavBar from '../../navbar.js'
import RequestCategory from './request_category.js'
import ExportCSV from './export_csv.js'

export default {
    template: `<div>
    <NavBar/>
    <div class = "p-4 bg-light">
    <img :src = "productimg" class = "rounded border border-3 border-danger mb-3" height = "275px" width = "690px"/>
    <div class = "position-fixed" style = "top: 80px; right: 285px; width: 260px">
    <ExportCSV/>
    </div>
    <div class = "p-4 bg-dark bg-gradient rounded border border-3 border-danger text-light text-center d-inline-dlex position-fixed" style = "top: 80px; right: 20px; width: 250px">
        <p class = "h4 text-light badge bg-danger bg-gradient fs-4">Statistics</p><br><br>
        <p class = "fw-bold h6">Number of users: {{ userc }}</p>
        <p class = "fw-bold h6">Number of Products: {{ productc }}</p>
        <p class = "fw-bold h6">Number of Category: {{ categoryc }}</p>
    </div>
    <div class = "row d-inline-flex">
    <div class = "col" style = "width: 355px">
    <RequestCategory/>
    </div>
    <div class = "col" style = "width: 355px">
        <div class = "p-4 bg-dark bg-gradient rounded border border-3 border-danger text-light text-center" style = "height: 249px">
        <p class = "h4 text-light badge bg-danger bg-gradient fs-4">Out of Stock</p><br><br>
        <p v-for = "pro in products" class = "fw-bold h6">{{ pro }}</p>
        </div>
    </div>
    </div>
    <img :src = "categoryimg" class = "rounded border border-3 border-danger mb-3 position-fixed" height = "309px" width = "529px" style = "top: 310px; right: 16px"/>
    
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            products: "",
            product: "",
            userc: 0,
            productc: 0,
            categoryc: 0,
            productimg: "/static/product.jpg",
            categoryimg: "/static/category.jpg"
        }
    },
    components: {
        NavBar,
        RequestCategory,
        ExportCSV
    },
    async mounted() {
        if (this.authToken == null || this.role == null) {
            this.$router.push({ path: '/login' })
        }
        else if (this.role != 'Manager') {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            localStorage.removeItem('username')
            localStorage.removeItem('email')
            localStorage.removeItem('lan')
            window.location.href = "http://localhost:5000/logout"
        }
        await fetch("/dashboard", {
            headers: {
                "Authentication-Token": this.authToken
            }
        })
            .then(response => response.json())
            .then(data => {
                this.userc = data.userc,
                    this.managerc = data.managerc,
                    this.productc = data.productc,
                    this.categoryc = data.categoryc,
                    this.products = data.products,
                    this.product = data.product
            })
    }
}