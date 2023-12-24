export default {
    template: `<div class = "mt-1">
    <div class = "d-flex justify-content-center">
    <div class = "p-5 bg-dark bg-gradient rounded text-light" style = "width: 400px">
        <label class = "form-label h4">Name</label><br><br>
        <input type = "text" class = "form-control" placeholder = "Enter Name" v-model = "user.name"><br>
        
        <label class = "form-label h4">Email Address</label><br><br>
        <input type = "text" class = "form-control" placeholder = "Enter Email Address" v-model = "user.email"/><br>
        
        <label class = "form-label h4">Password</label><br><br>
        <input type = "password" class = "form-control" placeholder = "Enter Password" v-model = "user.password"/><br>
        
        <label class = "form-label h4">Confirm Password</label><br><br>
        <input type = "password" class = "form-control" placeholder = "Re-Enter Password" v-model = "user.cpassword"/><br>
        
        <button v-if = "toggle == 0" class = "btn btn-outline-success mt-2" @click = "register">Register</button>
        <button v-else class = "btn btn-danger mt-2">!Password</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a class = "btn btn-outline-primary mt-2" href = "/">Go to Home</a>
    </div>
    </div>
    </div>`,
    data() {
        return {
            user: {
                name: "",
                email: "",
                password: "",
                cpassword: ""
            },
            r: localStorage.getItem('r'),
        }
    },
    computed: {
        toggle: function () {
            if (this.user.password == this.user.cpassword && this.user.password.length >= 8) {
                return 0
            }
            else {
                return 1
            }
        }
    },
    methods: {
        async register() {
            if (this.user.password == this.user.cpassword && this.user.password != '' && this.user.name != 0 && this.user.email != '') {
                if (this.r == 0) {
                    localStorage.removeItem('r')
                    const formData = new FormData()
                    formData.append('email', this.user.email)
                    formData.append('password', this.user.password)
                    formData.append('password_confirm', this.user.cpassword)
                    const res = await fetch("/register", {
                        method: "POST",
                        body: formData
                    })
                    if (res.ok) {
                        let link = '/register/' + this.user.name
                        await fetch(link)
                            .then(response => {
                                if (response.ok) {
                                    window.location.href = "http://localhost:5000/logout"
                                }
                            })
                    }
                }
                else if (this.r == 1) {
                    localStorage.removeItem('r')
                    const formData = new FormData()
                    formData.append('email', this.user.email)
                    formData.append('password', this.user.password)
                    formData.append('password_confirm', this.user.cpassword)
                    const res = await fetch("/register", {
                        method: "POST",
                        body: formData
                    })
                    if (res.ok) {
                        let link = '/register/' + this.user.name
                        await fetch(link, {
                            method: "POST"
                        })
                            .then(response => {
                                if (response.ok) {
                                    window.location.href = "http://localhost:5000/logout"
                                }
                            })
                    }
                }
            }
        }
    }
}