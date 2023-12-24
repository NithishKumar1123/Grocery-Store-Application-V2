import time
import csv
from application.jobs.workers import celery
from datetime import datetime
from celery.schedules import crontab
from application.controller.webhook import google_chatroom
from application.controller.mail import send_mail, generate_reminder, generate_report
from application.data.database import db
from application.data.models import User, Role, Product, Category
from flask_sse import sse
import flask_excel as excel

@celery.on_after_finalize.connect
def Daily_Reminder(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour = 17, minute = 30),
        send_reminder.s(),
    )

@celery.on_after_finalize.connect
def Monthly_Report(sender, **kwargs):
    sender.add_periodic_task(
        crontab(day_of_month = 1, hour = 9, minute = 0),
        send_report.s(),
    )

@celery.task()
def send_reminder():
    google_chatroom()
    role = Role.query.filter_by(id = 3).first()
    users = role.users
    for user in users:
        if(user.login == 0):
            generate_reminder(user)
        else:
            user.login = 0
    db.session.commit()
    
@celery.task()
def send_report():
    role = Role.query.filter_by(id = 3).first()
    users = role.users
    for user in users:
        generate_report(user)
        
@celery.task()
def export_csv():
    products = Product.query.with_entities(
        Product.productid, Product.productname, Product.productnamet, Product.productnameh, Product.price, Product.unit, Product.quantity, Product.categoryid
    ).all()
    csv_output = excel.make_response_from_query_sets(
        products, ['productid', 'productname', 'productnamet', 'productnameh', "price", "unit", "quantity", "categoryid"], "csv"
    )
    with open("static/Products.csv", 'wb') as f:
        f.write(csv_output.data)
    
    with open("static/Products.csv", 'r') as f:
        reader = csv.reader(f)
        next(reader)
        data = [row for row in reader]
        f.close()
    
    for row in data:
        productid = row[0]
        carts = Product.query.filter_by(productid = productid).first().cart
        sold = 0
        profit = 0
        for cart in carts:
            if(cart.purchased == 1):
                sold = sold + cart.quantity
                profit = profit + int(cart.quantity * int(row[4]))
        categoryid = row[7]
        row[7] = sold
        categoryname = Category.query.filter_by(categoryid = categoryid).first().categoryname
        row.append(categoryname)
        row.append(profit)
    
    with open("static/Products.csv", 'w') as f:
        writer = csv.writer(f)
        writer.writerow(["Product ID", "Product Name", "Product Name in Tamil", "Product Name in Hindi", "Price", "Unit", "Stock Remaining", "Stock Sold", "Category Name", "Total Revenue"])
        writer.writerows(data)
        f.close()            

@celery.task()
def publish():
    sse.publish({"message": "Hello!"}, type = "alert")