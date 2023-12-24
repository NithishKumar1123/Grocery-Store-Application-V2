export default {
    template: `<div>
    <div class = "p-4 bg-dark bg-gradient rounded border border-3 border-danger text-light text-center">
    <p class = "h4 text-light badge bg-danger bg-gradient fs-4">Export Products</p>
    <br><br><br>
    <button class = "btn btn-outline-primary" @click = "exportcsv">Export as CSV</button><br><br>
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token')
        }
    },
    methods: {
        async exportcsv() {
            fetch("/role", {
                method: "POST",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
        }
    }
}