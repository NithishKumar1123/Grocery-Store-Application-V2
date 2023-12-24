export default {
    template: `<div>
    <div class = "p-4 bg-dark bg-gradient rounded border border-3 border-danger text-light text-center">
    <p class = "h4 text-light badge bg-danger bg-gradient fs-4">New Category Request</p>
    <br><br>
    <div v-if = "category != ''">
    <div v-for = "cat in category" class = "p-2">
    <p class = "h6 text-light fw-bold">&nbsp;{{ cat.categoryname }}</p>
    <div v-if = "role == 'Admin'">
    <button class = "mt-2 mb-3 btn btn-outline-success" @click = "approve(cat.categoryid)">Approve</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button class = "mt-2 mb-3 btn btn-outline-danger" @click = "reject(cat.categoryid)">Reject</button>
    </div>
    </div>
    </div>
    <div v-else>
    <p v-if = "role == 'Admin'" class = "fw-bold h6">No New Request 😁</p>
    </div>
    <div v-if = "role == 'Manager'" class = "d-flex flex-column">
    <br>
    <input class = "form-control" type = "text" placeholder = "Enter Category Name" v-model = "categoryname"><br>
    <button class = "btn btn-outline-primary" @click = "requestcat">Request for Approval</button>
    </div>
    </div>
    </div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            category: "",
            categoryname: ""
        }
    },
    methods: {
        async requestcat() {
            if (this.categoryname != "") {
                let link = "/requestc/" + this.categoryname
                let res = await fetch(link, {
                    method: "POST",
                    headers: {
                        "Authentication-Token": this.authToken
                    }
                })
                if (res.ok) {
                    this.refresh()
                    this.categoryname = ""
                }
            }
        },
        async approve(categoryid) {
            let link = "/requestc/" + categoryid
            let res = await fetch(link, {
                method: "PUT",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            if (res.ok) {
                this.refresh()
            }
        },
        async reject(categoryid) {
            let link = "/category/" + categoryid
            let res = await fetch(link, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
            if (res.ok) {
                this.refresh()
            }
        },
        async refresh() {
            await fetch('/requestc', {
                headers: {
                    "Authentication-Token": this.authToken
                }
            })
                .then(response => response.json())
                .then(data => this.category = data)
        }
    },
    mounted: async function () {
        this.refresh()
    }
}