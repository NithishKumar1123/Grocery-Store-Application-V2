import router from './manager_router.js'

new Vue({
    el: '#app',
    template: `<div>
        <router-view></router-view>
    </div>`,
    router,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token')
        }
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
    }
})

var source = new EventSource("/stream");
source.addEventListener('alert', function (event) {
    alert("The CSV file has been exported");
}, false);