from flask import request, jsonify, current_app as app
from flask_restful import Resource, fields, marshal_with, reqparse
from flask_security import auth_required, roles_required, current_user
from application.data.database import db
from application.data.models import User, Category, Product, Cart, Role
from application.jobs.tasks import export_csv, publish
from application.data.data_access import *
from application.data.data_access import cache
from time import perf_counter_ns
import matplotlib.pyplot as plt

class UserAPI(Resource):
    def get(self):
        userid = current_user.id
        user = get_user(userid)
        if(user.roles[0].name == 'User'):
            user.login = 1
            db.session.commit()
        return jsonify({
            "username": user.username,
            "role": user.roles[0].name
        })
    
    @auth_required('token')
    @roles_required('Manager')
    def post(self):
        job = export_csv.apply_async()
        result = job.wait()
        publish.apply_async()
        return "", 201

class DashboardAPI(Resource):
    @auth_required('token')
    def get(self):
        
        # CHART - I
        
        category = db.session.execute(db.select(Product.categoryid, db.func.count(Product.categoryid)).group_by(Product.categoryid).order_by(db.func.count(Product.categoryid).desc())).fetchall()
        categorylabel = []
        productcount = []
        for i in category:
            c = Category.query.filter_by(categoryid = i[0]).first()
            if c.approval == 1:
                categorylabel.append(c.categoryname)
                productcount.append(i[1])
        cat = Category.query.filter_by(approval = 1).all()
        for i in cat:
            if(i.categoryname not in categorylabel):
                categorylabel.append(i.categoryname)
                productcount.append(0)
        plt.figure(figsize = (9, 5))
        plt.bar(categorylabel[:3], productcount[:3])
        plt.xlabel("Category", fontweight = "bold")
        plt.ylabel("Number of Products", fontweight = "bold")
        plt.title("Number of Products in each Category", fontweight = "bold")
        plt.savefig('static/category.jpg')
        
        # CHART - II
        
        products = db.session.execute(db.select(Product.productname, Product.quantity).order_by(Product.quantity.desc())).fetchall()
        productlabel = []
        quantity = []
        for i in products:
            productlabel.append(i[0])
            quantity.append(i[1])
        plt.figure(figsize = (12, 5))
        plt.bar(productlabel[:4], quantity[:4])
        plt.xlabel("Product", fontweight = "bold")
        plt.ylabel("Quantity", fontweight = "bold")
        plt.title("Available Stocks", fontweight = "bold")
        plt.savefig('static/product.jpg')
        
        products = db.session.execute(db.select(Product.productname).filter_by(quantity = 0)).fetchall()
        pro = []
        for i in products:
            pro.append(i[0])
            
        cart = db.session.execute(db.select(Cart.productid, db.func.sum(Cart.quantity)).filter_by(purchased = 1).group_by(Cart.productid)).fetchall()
        max = -1
        maxele = 0
        for i in cart:
            if i[1] > max:
                max = i[1]
                maxele = i[0]
        pp = Product.query.filter_by(productid = maxele).first()
        
        u = len(Role.query.filter_by(id = 3).first().users)
        m = len(Role.query.filter_by(id = 2).first().users)
        pd = len(Product.query.all())
        c = len(Category.query.filter_by(approval = 1).all())
        return jsonify({
            "userc": u,
            "managerc": m,
            "productc": pd,
            "categoryc": c,
            "products": pro,
            "product": pp.productname
        })

manager_op = {
    "id": fields.Integer,
    "username": fields.String
}

class ManagerRegisterAPI(Resource):
    @auth_required('token')
    @roles_required('Admin')
    @marshal_with(manager_op)
    def get(self):
        role = Role.query.filter_by(id = 4).first()
        return role.users

class UserRegisterAPI(Resource):
    def get(self, username):
        userid = current_user.id
        user = get_user(userid)
        user.username = username
        role = Role.query.filter_by(id = 3).first()
        user.roles.append(role)
        db.session.commit()
        return "", 201

    def post(self, username):
        userid = current_user.id
        user = User.query.filter_by(id = userid).first()
        user.username = username
        role = Role.query.filter_by(id = 4).first()
        user.roles.append(role)
        db.session.commit()
        return "", 201
    
    @auth_required('token')
    @roles_required('Admin')
    def put(self, username):
        user = User.query.filter_by(id = int(username)).first()
        user.login = 1
        user.roles = []
        role = Role.query.filter_by(id = 2).first()
        user.roles.append(role)
        db.session.commit()
        return "", 201
    
    @auth_required('token')
    @roles_required('Admin')    
    def delete(self, username):
        user = User.query.filter_by(id = int(username)).first()
        db.session.delete(user)
        db.session.commit()
        return "", 202

category_op = {
    "categoryid": fields.Integer,
    "categoryname": fields.String,
    "categorynamet": fields.String,
    "categorynameh": fields.String
}

class AllCategoryAPI(Resource):
    @auth_required('token')
    @marshal_with(category_op)
    @cache.cached(timeout = 10)
    def get(self):
        start = perf_counter_ns()
        category = Category.query.filter_by(approval = 1).all()
        stop = perf_counter_ns()
        # print("Time Taken", stop - start)
        return category

products_op = {
    "productid": fields.Integer,
    "productname": fields.String,
    "productnamet": fields.String,
    "productnameh": fields.String    
}

class AllProductAPI(Resource):
    @auth_required('token')
    @marshal_with(products_op)
    def get(self, categoryid):
        category = Category.query.filter_by(categoryid = categoryid).first()
        return category.products

cat_parser = reqparse.RequestParser()
cat_parser.add_argument('categoryid')
cat_parser.add_argument('categoryname')
cat_parser.add_argument('categorynamet')
cat_parser.add_argument('categorynameh')

class CategoryNameAPI(Resource):
    @auth_required('token')
    @marshal_with(category_op)
    def get(self, categoryid):
        category = get_category(categoryid)
        return category

class CategoryAPI(Resource):
    @auth_required('token')
    @marshal_with(category_op)
    def get(self, categoryid):
        category = get_category(categoryid)
        return category
    
    @auth_required('token')
    @roles_required('Admin')
    def post(self):
        args = cat_parser.parse_args()
        categoryname = args.get('categoryname', None)
        categorynamet = args.get('categorynamet', None)
        categorynameh = args.get('categorynameh', None)
        category = Category(categoryname = categoryname, categorynamet = categorynamet, categorynameh = categorynameh, approval = 1)
        db.session.add(category)
        db.session.commit()
        return "", 201
    
    @auth_required('token')
    @roles_required('Admin')
    def delete(self, categoryid):
        category = Category.query.filter_by(categoryid = categoryid).first()
        db.session.delete(category)
        db.session.commit()
        return "", 202
    
    @auth_required('token')
    @roles_required('Admin')
    def put(self, categoryid):
        args = cat_parser.parse_args()
        categoryname = args.get('categoryname', None)
        categorynamet = args.get('categorynamet', None)
        categorynameh = args.get('categorynameh', None)
        category = Category.query.filter_by(categoryid = categoryid).first()
        category.categoryname = categoryname
        category.categorynamet = categorynamet
        category.categorynameh = categorynameh
        db.session.commit()
        return "", 202
             
class RequestCategoryAPI(Resource):
    @auth_required('token')
    @marshal_with(category_op)
    def get(self):
        category = Category.query.filter_by(approval = 0).all()
        return category
    
    @auth_required('token')
    @roles_required('Manager')
    def post(self, categoryname):
        category = Category(categoryname = categoryname, approval = 0)
        db.session.add(category)
        db.session.commit()
        return "", 201
    
    @auth_required('token')
    @roles_required('Admin')
    def put(self, categoryname):
        category = Category.query.filter_by(categoryid = int(categoryname)).first()
        category.approval = 1
        db.session.commit()
        return "", 202
        
pro_parser = reqparse.RequestParser()
pro_parser.add_argument('productname')
pro_parser.add_argument('productnamet')
pro_parser.add_argument('productnameh')
pro_parser.add_argument('price')
pro_parser.add_argument('unit')
pro_parser.add_argument('quantity')
pro_parser.add_argument('categoryid')

product_op = {
    "productid": fields.Integer,
    "productname": fields.String,
    "productnamet": fields.String,
    "productnameh": fields.String,
    "price": fields.Integer,
    "unit": fields.String,
    "quantity": fields.Integer,
    "categoryid": fields.Integer
}

class ProductAPI(Resource):
    @auth_required('token')
    @marshal_with(product_op)
    def get(self, productid):
        start = perf_counter_ns()
        product = get_product(productid)
        stop = perf_counter_ns()
        # print("Time Taken", stop - start)
        return product
    
    @auth_required('token')
    @roles_required('Manager')
    def post(self):
        args = pro_parser.parse_args()
        productname = args.get('productname', None)
        productnamet = args.get('productnamet', None)
        productnameh = args.get('productnameh', None)
        price = args.get('price', None)
        unit = args.get('unit', None)
        quantity = args.get('quantity', None)
        categoryid = args.get('categoryid', None)
        product = Product(productname = productname, productnamet = productnamet, productnameh = productnameh, price = price, unit = unit, quantity = quantity, categoryid = categoryid)
        db.session.add(product)
        db.session.commit()
        return "", 201
    
    @auth_required('token')
    @roles_required('Manager')
    def delete(self, productid):
        product = Product.query.filter_by(productid = productid).first()
        db.session.delete(product)
        db.session.commit()
        return "", 202
    
    @auth_required('token')
    @roles_required('Manager')
    def put(self, productid):
        args = pro_parser.parse_args()
        productname = args.get('productname', None)
        productnamet = args.get('productnamet', None)
        productnameh = args.get('productnameh', None)
        price = args.get('price', None)
        unit = args.get('unit', None)
        quantity = args.get('quantity', None)
        categoryid = args.get('categoryid', None)
        product = Product.query.filter_by(productid = productid).first()
        product.productname = productname
        product.productnamet = productnamet
        product.productnameh = productnameh
        product.price = price
        product.unit = unit
        product.quantity = quantity
        product.categoryid = categoryid
        db.session.commit()
        return "", 202

cart_parser = reqparse.RequestParser()
cart_parser.add_argument('productid')
cart_parser.add_argument('quantity')

cart_op = {
    "cartid": fields.Integer,
    "productid": fields.Integer,
    "quantity": fields.Integer,
    "purchased": fields.Integer,
}

class CartAPI(Resource):
    @auth_required('token')
    @marshal_with(cart_op)
    def get(self):
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, purchased = 0).all()
        return cart
    
    @auth_required('token')
    def post(self):
        args = cart_parser.parse_args()
        productid = args.get('productid', None)
        quantity = args.get('quantity', None)
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, productid = productid, purchased = 0).first()
        if(cart):
            product = Product.query.filter_by(productid = productid).first()
            if((cart.quantity + int(quantity)) <= product.quantity):
                cart.quantity = cart.quantity + int(quantity)
            else:
                cart.quantity = product.quantity
        else:
            cart = Cart(userid = userid, productid = productid, quantity = quantity)
            db.session.add(cart)
        db.session.commit()
        return "", 201
    
    @auth_required('token')
    def delete(self, productid):
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, productid = productid).first()
        db.session.delete(cart)
        db.session.commit()
        return "", 202
    
    @auth_required('token')
    def put(self):
        args = cart_parser.parse_args()
        productid = args.get('productid', None)
        quantity = args.get('quantity', None)
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, productid = productid, purchased = 0).first()
        cart.quantity = quantity
        db.session.commit()
        return "", 201

class PurchaseAPI(Resource):
    @auth_required('token')
    @marshal_with(cart_op)
    def get(self):
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, purchased = 1).all()
        return cart
    
    @auth_required('token')
    def post(self, cartid):
        userid = current_user.id
        cart = Cart.query.filter_by(cartid = cartid, userid = userid, purchased = 0).first()
        cart.purchased = 1
        product = Product.query.filter_by(productid = cart.productid).first()
        product.quantity = product.quantity - cart.quantity
        db.session.commit()
        return "", 201
        
class CartCountAPI(Resource):
    @auth_required('token')
    def get(self):
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, purchased = 0).all()
        return len(cart)
        
class PurchaseAllAPI(Resource):
    @auth_required('token')
    def get(self):
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, purchased = 0).all()
        total = 0
        for car in cart:
            product = Product.query.filter_by(productid = car.productid).first()
            total = total + (product.price * car.quantity)
        return total
    
    @auth_required('token')
    def post(self):
        userid = current_user.id
        cart = Cart.query.filter_by(userid = userid, purchased = 0).all()
        for car in cart:
            car.purchased = 1
            product = Product.query.filter_by(productid = car.productid).first()
            product.quantity = product.quantity - car.quantity
        db.session.commit()
        return "", 201

class SearchPAPI(Resource):
    @auth_required('token')
    @marshal_with(product_op)
    def get(self, search, sort):
        like = "%" + search + "%"
        if(sort == 0):
            product = Product.query.filter(Product.productname.like(like)).order_by(Product.price).all()
        else:
            product = Product.query.filter(Product.productname.like(like)).order_by(Product.price.desc()).all()
        return product
        
class SearchCAPI(Resource):
    @auth_required('token')
    @marshal_with(category_op)
    def get(self, search):
        like = "%" + search + "%"
        category = Category.query.filter(Category.categoryname.like(like)).all()
        return category
        
        