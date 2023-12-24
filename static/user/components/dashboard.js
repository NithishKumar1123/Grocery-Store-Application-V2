import NavBar from '../../navbar.js'

export default {
    template: `<div>
    <NavBar/>       
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token')
        }
    },
    components: {
        NavBar
    },
    async mounted() {
        if (this.authToken == null || this.role == null) {
            this.$router.push({ path: '/login' })
        }
        else if (this.role == 'Admin') {
            window.location.href = "http://localhost:5000/admin#/"
        }
        else if (this.role == 'Manager') {
            window.location.href = "http://localhost:5000/manager#/"
        }
    }
}