import os
from flask import Flask, render_template
from flask_restful import Api, Resource
from application.config import LocalDevelopmentConfig, StageConfig
from application.data.database import db
from application.jobs import workers
from flask_security import Security, SQLAlchemySessionUserDatastore
from application.data.models import User, Role
from flask_sse import sse
import flask_excel as excel
from flask_caching import Cache

app = None
api = None
celery = None

def create_app():
    app = Flask(__name__, template_folder = 'templates')
    if(os.getenv('ENV', 'development') == 'production'):
        raise Exception("Currently no production config is setup.")
    elif(os.getenv('ENV', 'development') == 'stage'):
        print("Starting Stage")
        app.config.from_object(StageConfig)
    else:
        print("Starting Local Development")
        app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    excel.init_excel(app)
    app.app_context().push()
    celery = workers.celery
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        timezone = app.config["CELERY_TIMEZONE"],
        broker_connection_retry_on_startup = app.config["CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP"]
    )
    celery.Task = workers.ContextTask
    app.app_context().push()
    user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
    security = Security(app, user_datastore)
    app.app_context().push()
    return app, api, celery

app, api, celery = create_app()

app.register_blueprint(sse, url_prefix = '/stream')

from application.controller.controller import *

from application.controller.api import *

api.add_resource(UserAPI, "/role")
api.add_resource(AllCategoryAPI, "/allcategory")
api.add_resource(CategoryAPI, "/category/<int:categoryid>", "/category")
api.add_resource(AllProductAPI, "/products/<int:categoryid>")
api.add_resource(CategoryNameAPI, "/categoryname/<int:categoryid>")
api.add_resource(ProductAPI, "/product/<int:productid>", "/product")
api.add_resource(CartAPI, "/cart/<int:productid>", "/cart")
api.add_resource(PurchaseAPI, "/purchase/<int:cartid>", "/purchase")
api.add_resource(CartCountAPI, "/cartcount")
api.add_resource(PurchaseAllAPI, "/purchaseall")
api.add_resource(SearchPAPI, "/search/<string:search>/<int:sort>")
api.add_resource(SearchCAPI, "/searchc/<string:search>")
api.add_resource(RequestCategoryAPI, "/requestc/<string:categoryname>", "/requestc")
api.add_resource(ManagerRegisterAPI, "/requestm")
api.add_resource(UserRegisterAPI, "/register/<string:username>")
api.add_resource(DashboardAPI, "/dashboard")

# @app.errorhandler(404)
# def page_not_found(e):
#     return render_template('page_not_found.html'), 404

# @app.errorhandler(403)
# def restricted(e):
#     return render_template('retricted.html'), 403

if __name__ == '__main__':
    app.run()