export default {
    template: `<div>
    <br><br>
    <div v-if = "togglee == 1 && user.email == ''" class = "alert alert-danger" role = "alert">
        Please enter the email address!
    </div>
    <div v-if = "togglep == 1 && user.password == ''" class = "alert alert-danger" role = "alert">
        Please enter the password!
    </div>
    <div v-if = "toggle  == 1" class = "alert alert-danger" role = "alert">
        Please enter the right credentials!
    </div>
    <br><br>
    <div class = "d-flex justify-content-center">
    <div class = "p-5 bg-dark bg-gradient rounded text-light">
        <label class = "form-label h4">Email Address</label><br><br>
        <input type = "email" class = "form-control" placeholder = "name@example.com" v-model = "user.email"><br>
        <label class = "form-label h4">Password</label><br><br>
        <input type = "password" class = "form-control" placeholder = "password" v-model = "user.password"><br><br>
        <button class = "btn btn-outline-success" @click = "login">Login</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button v-if = "r != 2" class = "btn btn-outline-danger" @click = "register">Register</button>
        <div v-if = "r != 2">
        <br>
        </div>
        <a class = "btn btn-outline-primary ms-5" href = "/">Go to Home</a>
    </div>
    </div>
    </div>
    </div>`,
    data() {
        return {
            user: {
                email: "",
                password: ""
            },
            toggle: 0,
            togglee: 0,
            togglep: 0,
            img: '/static/1.png',
            r: localStorage.getItem('r')
        }
    },
    methods: {
        async login() {
            if (this.user.email == "") {
                this.togglee = 1
            }
            else if (this.user.password == "") {
                this.togglep = 1
            }
            else {
                localStorage.removeItem('r')
                const res = await fetch('/login?include_auth_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.user)
                })
                let data = await res.json()
                if (res.ok) {
                    localStorage.setItem('auth-token', data.response.user.authentication_token)
                    if (localStorage.getItem('lan') == null) {
                        localStorage.setItem('lan', 0)
                    }
                    this.role()
                }
                else {
                    this.toggle = 1
                    this.user.email = ""
                    this.user.password = ""
                }
            }
        },
        async register() {
            this.$router.push({ path: '/register' })
        },
        async role() {
            const res = await fetch('/role')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('role', data.role)
                    localStorage.setItem('username', data.username)
                    localStorage.setItem('email', this.user.email)
                    if (data.role == 'User') {
                        window.location.href = "http://localhost:5000/#/products"
                    }
                    else if (data.role == 'Admin') {
                        window.location.href = "http://localhost:5000/admin#/dashboard"
                    }
                    else if (data.role == 'Manager') {
                        window.location.href = "http://localhost:5000/manager#/dashboard"
                    }
                    else {
                        window.location.href = "http://localhost:5000"
                    }
                })
        }
    }
}