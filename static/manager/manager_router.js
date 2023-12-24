import Dashboard from './components/manager_dashboard.js'
import Login from '../login.js'
import Register from '../register.js'
import Category from '../category.js'
import AllProduct from '../allproduct.js'
import Products from '../products.js'
import Product from '../product.js'
import CreateProduct from './components/create_product.js'
import UpdateProduct from './components/update_product.js'
import Profile from '../profile.js'
import Search from '../search.js'

const routes = [
    {
        path: '/dashboard', component: Dashboard, name: 'Dashboard'
    },
    {
        path: '/login', component: Login, name: 'Login'
    },
    {
        path: '/register', component: Register, name: 'Register'
    },
    {
        path: '/category', component: Category, name: 'Cat'
    },
    {
        path: '/products', component: AllProduct, name: 'AllProduct'
    },
    {
        path: '/products/:categoryid', component: Products, name: 'Products', props: true
    },
    {
        path: '/product/:productid', component: Product, name: 'Product', props: true
    },
    {
        path: '/create_product', component: CreateProduct, name: 'CreateProduct'
    },
    {
        path: '/update_product', component: UpdateProduct, name: 'UpdateProduct'
    },
    {
        path: '/profile', component: Profile, name: 'Profile'
    },
    {
        path: '/search/:search', component: Search, name: 'Search', props: true
    }
]

export default new VueRouter({
    routes,
})