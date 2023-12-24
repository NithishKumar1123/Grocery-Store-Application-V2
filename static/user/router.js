import Home from './components/home.js'
import Login from '../login.js'
import Register from '../register.js'
import Dashboard from './components/dashboard.js'
import Category from '../category.js'
import AllProduct from '../allproduct.js'
import Products from '../products.js'
import Product from '../product.js'
import Cart from './components/cart.js'
import UpdateCart from './components/update_cart.js'
import Profile from '../profile.js'
import Search from '../search.js'


const routes = [
    {
        path: '/', component: Home, name: 'Home'
    },
    {
        path: '/login', component: Login, name: 'Login'
    },
    {
        path: '/register', component: Register, name: 'Register'
    },
    {
        path: '/dashboard', component: Dashboard, name: 'Dashboard'
    },
    {
        path: '/profile', component: Profile, name: 'Profile'
    },
    {
        path: '/category', component: Category, name: 'Category'
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
        path: '/cart', component: Cart, name: 'Cart'
    },
    {
        path: '/update_cart', component: UpdateCart, name: 'UpdateCart'
    },
    {
        path: '/search/:search', component: Search, name: 'Search', props: true
    }
]

export default new VueRouter({
    routes,
})