from .database import db
from flask_security import UserMixin, RoleMixin

roles_users = db.Table('roles_users',
    db.Column('userid', db.Integer, db.ForeignKey('user.id'), nullable = False),
    db.Column('roleid', db.Integer, db.ForeignKey('role.id'), nullable = False))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    username = db.Column(db.String)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)
    active = db.Column(db.Boolean, nullable = False)
    login = db.Column(db.Boolean, nullable = False, default = 0)
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    roles = db.relationship('Role', secondary = roles_users, backref = db.backref('users', lazy = 'subquery'))
    cart = db.relationship('Cart', backref = "user_", lazy = 'subquery', cascade = "all, delete-orphan")
    def __repr__(self):
        return '<User %r>' % self.username

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = True, unique = True)
   
class Category(db.Model):
    __tablename__ = 'category'
    categoryid = db.Column(db.Integer, autoincrement = True, primary_key = True)
    categoryname = db.Column(db.String, unique = True, nullable = False)
    categorynamet = db.Column(db.String)
    categorynameh = db.Column(db.String)
    approval = db.Column(db.Integer, nullable = False, default = 0)
    products = db.relationship('Product', backref = "category_", lazy = 'subquery', cascade = "all, delete-orphan")
    def __repr__(self):
        return '<Category %r>' % self.categoryname

class Product(db.Model):
    __tablename__ = 'product'
    productid = db.Column(db.Integer, autoincrement = True, primary_key = True)
    productname = db.Column(db.String, nullable = False)
    productnamet = db.Column(db.String, nullable = False)
    productnameh = db.Column(db.String, nullable = False)
    price = db.Column(db.Float, nullable = False)
    unit = db.Column(db.String)
    quantity = db.Column(db.Integer, nullable = False)
    categoryid = db.Column(db.Integer, db.ForeignKey('category.categoryid'), nullable = False)
    cart = db.relationship('Cart', backref = "product_", cascade = "all, delete-orphan", lazy = 'subquery')
    def __repr__(self):
        return '<Product %r>' % self.productname

class Cart(db.Model):
    __tablename__ = 'cart'
    cartid = db.Column(db.Integer, autoincrement = True, primary_key = True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    productid = db.Column(db.Integer, db.ForeignKey('product.productid'), nullable = False)
    quantity = db.Column(db.Integer, nullable = False)
    purchased = db.Column(db.Integer, nullable = False, default = 0)