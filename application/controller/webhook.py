from json import dumps
from httplib2 import Http

def google_chatroom():
    message = "🌟🛒 Unwrap the Joy of Freshness! 🛒🌟\n\nDear Customer,\nGuess what's in store for you? A cartful of freshness, a bundle of savings, and a sprinkle of convenience! 🍎🛍️\n\nOur MarketMate Online Grocery Store is bursting with farm-fresh produce, pantry essentials, and all your favorite goodies. Why step out when you can shop from the comfort of your couch?\n\n🚀 Here's why you'll love shopping with us:\n1️⃣ Fresh Picks: Handpicked, farm-fresh goodness delivered to your doorstep.\n2️⃣ Amazing Deals: Jaw-dropping discounts and exclusive offers that'll make your wallet smile.\n3️⃣ Effortless Shopping: Navigate our user-friendly website with ease – it's like a shopping spree without the queues!\n\nReady to dive into a world of convenience? Visit us to start your grocery adventure now! 🛒✨\n\nHappy shopping! 😍"
    url = "https://chat.googleapis.com/v1/spaces/AAAAKlYZfY4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=wIwEP84HH2d2z7UFUz_FpCEp_CWsfFHZejFJBqFvpbk"
    app_message = {"text": message}
    message_headers = {"Content-Type": "application/json; charset=UTF-8"}
    http_obj = Http()
    response = http_obj.request(
        uri = url,
        method = "POST",
        headers = message_headers,
        body = dumps(app_message),
    )