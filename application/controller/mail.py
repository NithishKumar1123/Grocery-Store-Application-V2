from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import render_template
from jinja2 import Template

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SMTP_SENDER_EMAIL = "21f1006725@ds.study.iitm.ac.in"
SMTP_SENDER_PASSWORD = ""

def send_mail(to, subject, body, ty):
    message = MIMEMultipart()
    message["To"] = to
    message["Subject"] = subject
    message["From"] = SMTP_SENDER_EMAIL
    message.attach(MIMEText(body, ty))
    client = SMTP(host = SMTP_HOST, port = SMTP_PORT)
    client.send_message(msg = message)
    client.quit()
    
    
def generate_reminder(user):
    body = "🌟🛒 Unwrap the Joy of Freshness! 🛒🌟\n\nDear " + user.username + ",\nGuess what's in store for you? A cartful of freshness, a bundle of savings, and a sprinkle of convenience! 🍎🛍️\n\nOur MarketMate Online Grocery Store is bursting with farm-fresh produce, pantry essentials, and all your favorite goodies. Why step out when you can shop from the comfort of your couch?\n\n🚀 Here's why you'll love shopping with us:\n1️⃣ Fresh Picks: Handpicked, farm-fresh goodness delivered to your doorstep.\n2️⃣ Amazing Deals: Jaw-dropping discounts and exclusive offers that'll make your wallet smile.\n3️⃣ Effortless Shopping: Navigate our user-friendly website with ease – it's like a shopping spree without the queues!\n\nReady to dive into a world of convenience? Visit us to start your grocery adventure now! 🛒✨\n\nHappy shopping! 😍"
    send_mail(user.email, "Daily Reminder from MarketMate - Freshness Awaits! Click NOW!", body, "plain")
    
def generate_report(user):
    with open('templates/monthly_report.html', 'r') as report:
        template = Template(report.read())
        template = render_template(template, user = user)
        send_mail(user.email, "MarketMate Monthly User Report", template, "html")