import Dashboard from './components/admin_dashboard.js'
import Login from '../login.js'
import Category from '../category.js'
import CreateCategory from './components/create_category.js'
import UpdateCategory from './components/update_category.js'
import AllProduct from '../allproduct.js'
import Products from '../products.js'
import Product from '../product.js'
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
        path: '/category', component: Category, name: 'Cat'
    },
    {
        path: '/create_category', component: CreateCategory, name: 'CreateCategory'
    },
    {
        path: '/update_category', component: UpdateCategory, name: 'UpdateCategory'
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
        path: '/profile', component: Profile, name: 'Profile'
    },
    {
        path: '/search/:search', component: Search, name: 'Search', props: true
    }
]

export default new VueRouter({
    routes,
})