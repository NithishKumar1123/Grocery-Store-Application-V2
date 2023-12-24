import router from './router.js'

var app = new Vue({
    el: '#app',
    template: `<div>
        <router-view></router-view>
    </div>`,
    router
})