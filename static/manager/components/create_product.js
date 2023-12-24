import NavBar from '../../navbar.js'

export default {
    template: `<div>
    <NavBar/><br>
    <div class = "d-flex justify-content-center">
    <div class = "p-5 bg-dark bg-gradient rounded text-light">
        <label class = "form-label h4">Product Name</label><br><br>
        <input type = "text" class = "form-control" placeholder = "Enter Product Name" v-model = "product.productname"><br>
        <label class = "form-label h4">Product Name in Tamil</label><br><br>
        <input type = "text" class = "form-control" placeholder = "Enter Product Name" v-model = "product.productnamet"><br>
        <label class = "form-label h4">Product Name in Hindi</label><br><br>
        <input type = "text" class = "form-control" placeholder = "Enter Product Name" v-model = "product.productnameh"><br>
        
        <label class = "form-label h4">Price</label><br><br>
        <input type = "number" class = "form-control" placeholder = "Enter Price" v-model = "product.price"/><br>
        
        <label class = "form-label h4">Unit</label><br><br>
        <select class = "form-select" v-model = "product.unit">
            <option value = "Kgs">Kilograms</option>
            <option value = "Nos">Numbers</option>
            <option value = "Ltrs">Litres</option>
            <option value = "">Select an Unit</option>
        </select><br>
        
        <label class = "form-label h4">Quantity</label><br><br>
        <input type = "number" class = "form-control" placeholder = "Enter Product Quantity" v-model = "product.quantity"/><br>
        
        <label class = "form-label h4">Category</label><br><br>
        <select class = "form-select" v-model = "product.categoryid">
            <option v-for = "cat in category" :value = "cat.categoryid">{{ cat.categoryname }}</option>
        </select><br>
        <button class = "btn btn-outline-success mt-2" @click = "create_product">Create</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link to = "/category"><button class = "btn btn-outline-primary mt-2">Go to Category</button></router-link>
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
            category: []
        }
    },
    methods: {
        async create_product() {
            await fetch('/product', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.authToken
                },
                body: JSON.stringify({
                    "productname": this.product.productname,
                    "productnamet": this.product.productnamet,
                    "productnameh": this.product.productnameh,
                    "price": this.product.price,
                    "unit": this.product.unit,
                    "quantity": this.product.quantity,
                    "categoryid": this.product.categoryid
                })
            })
                .then(response => {
                    if (response.ok) {
                        this.$router.push({ path: '/products/' + this.product.categoryid })
                    }
                })
        }
    },
    components: {
        NavBar
    },
    mounted: async function () {
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
        else {
            await fetch('/allcategory', {
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