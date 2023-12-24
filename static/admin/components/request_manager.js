export default {
    template: `<div>
    <div class = "p-4 bg-dark bg-gradient rounded border border-3 border-danger text-light text-center">
    <p class = "h4 text-light badge bg-danger bg-gradient fs-4">New Manager Request</p>
    <br><br>
    <div v-if = "manager != ''">
    <div v-for = "man in manager" class = "p-2">
    <p class = "h6 text-light fw-bold">&nbsp;{{ man.username }}</p>
    <div v-if = "role == 'Admin'">
    <button class = "mt-2 mb-3 btn btn-outline-success" @click = "approve(man.id)">Approve</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class = "mt-2 mb-3 btn btn-outline-danger" @click = "reject(man.id)">Reject</button>
    </div>
    </div>
    </div>
    <div v-else>
    <p v-if = "role == 'Admin'" class = "fw-bold h6">No New Request 😁</p>
    </div>    
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            manager: ""
        }
    },
    methods: {
        async approve(id) {
            let link = "/register/" + id
            await fetch(link, {
                method: "PUT",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => {
                    if (response.ok) {
                        this.refresh()
                    }
                })
        },
        async reject(id) {
            let link = "/register/" + id
            await fetch(link, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => {
                    if (response.ok) {
                        this.refresh()
                    }
                })
        },
        async refresh() {
            await fetch("/requestm", {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.manager = data)
        }
    },
    mounted: async function () {
        this.refresh()
    }
}