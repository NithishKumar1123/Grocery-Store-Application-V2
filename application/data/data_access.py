from application.data.models import User, Category, Product, Cart, Role
from flask_caching import Cache
from flask import current_app as app

cache = None
cache = Cache(app)

@cache.memoize(10)
def get_product(productid):
    return Product.query.filter_by(productid = productid).first()

@cache.memoize(10)
def get_category(categoryid):
    return Category.query.filter_by(categoryid = categoryid).first()

@cache.memoize(10)
def get_user(userid):
    return User.query.filter_by(id = userid).first()