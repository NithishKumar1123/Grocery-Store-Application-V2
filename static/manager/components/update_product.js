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
        <button class = "btn btn-outline-success mt-2" @click = "update_product">Update</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                price: 0,
                unit: "",
                quantity: 0,
                categoryid: ""
            },
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            productid: localStorage.getItem('up-pro'),
            category: []
        }
    },
    methods: {
        async update_product() {
            var link = '/product/' + this.productid
            await fetch(link, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.authToken
                },
                body: JSON.stringify(this.product)
            })
                .then(response => {
                    if (response.ok) {
                        this.$router.push({ path: '/product/' + this.productid })
                    }
                })
        }
    },
    components: {
        NavBar
    },
    mounted: async function () {
        localStorage.removeItem('up-pro')
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
        }
    }
}