export default {
    template: `<div class = "p-5">
    <div class = "row text-center">
        <div class = "col-4">
        <div class = "card">
            <img :src = "userimg" height = "340px">
            <div class = "card-body p-3">
                <p class = "card-title h2">Are you a Customer?</p>
                <p class = "card-text">If you are a customer and here to fetch your groceries. Enter to start right away.</p><br>
                <router-link to = "/products"><a class = "btn btn-outline-success" @click = "u">Customer Platform</a></router-link>
            </div>
        </div>
        </div>
        <div class = "col-4">
            <div class = "card">
                <img :src = "managerimg" height = "340px">
                    <div class = "card-body p-3">
                        <p class = "card-title h3">Are you a Shop Manager?</p>
                        <p class = "card-text">If you are a shop manager and looking to expand your business. Enter to start right away.</p><br>
                        <a class = "btn btn-outline-warning" href = "/manager" @click = "s">Shop Manager Platform</a>
                    </div>
            </div>
        </div>
        <div class = "col-4">
            <div class = "card">
                <img :src = "adminimg" height = "340px">
                    <div class = "card-body p-3">
                        <p class = "card-title h3">Are you an Admin?</p>
                        <p class = "card-text">If you are not the admin, kindly enter your respective profile to start right away.</p><br>
                        <a class = "btn btn-outline-danger" href = "/admin" @click = "a">Admin Platform</a>
                    </div>
            </div>
        </div>
    </div>
    </div>`,
    data() {
        return {
            userimg: "/static/user.png",
            managerimg: "/static/manager.png",
            adminimg: "/static/admin.png"
        }
    },
    methods: {
        u() {
            localStorage.setItem('r', 0)
        },
        s() {
            localStorage.setItem('r', 1)
        },
        a() {
            localStorage.setItem('r', 2)
        }
    }
}