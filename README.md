# Grocery Store Application V2

## Description
The objective of the Modern Application Development - II project is to develop a robust and user-friendly multi user online grocery shopping platform that provides role based access control and enables users to search and purchase groceries categorized for easy navigation providing a seamless and convenient way to shop for groceries online.

## Technologies used
The following Technologies have been used in implementing the web application:
### Python
Python is a programming language which is used for backend development.
### Flask
Flask is a web framework for Python which is used to build the application programming interface (API) quickly and efficiently.
### Flask-restful
Flask-restful is a python framework which is used to create RESTful APIs and handle requests and responses.
### Flask-SQLAlchemy
Flask-SQLAlchemy is a database toolkit for Flask web applications which is used to conveniently interact with the SQLite3 databases for the application.
### Flask-security-too
Flask-security-too is a python framework which is used for secure and flexible authentication for the application.
### VueJS
VueJS is an open source framework which is used for building user interfaces.
### Celery
Celery handles asynchronous tasks and job queues for building scalable and reliable python applications.
### Redis
Redis is an in-memory data store with advanced data structures which is used for caching in the application.
### Bootstrap
Bootstrap is a frontend framework which is used to design the application.
### SQLite3
SQLite3 is a SQL database management system which is used to store the data of the application.
### Matplotlib
Matplotlib is a plotting library for Python which is used to visualize the data in the admin dashboard of the application.

## DB Schema Design
The following tables are used to store the data for the web application:

### The User table contains the following attributes:
id - integer, auto increment, primary key.

username - string, not null.
Email - string, unique, not null

password - string, not null.

active - boolean, not null.

login - boolean, not null, stores 1 when user logs in at least once in a day, else 0.

fs_uniquifier - string, unique, not null.

roles - relationship with Role table. Easy access to the role of the user.

cart - relationship with Cart table. Easy access to the carts of the user.

### The Role table contains the following attributes:
id - integer, auto increment, primary key.

name - string, unique, not null.

### The Roles Users table contains the following attributes:
userid - foreign key for id of User table, not null.

roleid - foreign key for id of Role table, not null.

### The Category table contains the following attributes:
categoryid - integer, auto increment, primary key.

categoryname - string, unique, not null.

categorynamet - string, unique, not null. Category name in Tamil

categorynameh - string, unique, not null. Category name in Hindi

approval - boolean, not null, stores 1 when it is approved by the admin, else 0.

products - relationship with Product table. Easy access to the products of the category.

### The Product table contains the following attributes:
productid - integer, auto increment, primary key.

productname - string, not null.

productname - string, not null. Product name in Tamil

productname - string, not null. Product name in Hindi

price - float, not null.

unit - string.

quantity - integer, not null.

categoryid - foreign key for categoryid of Category table, not null.

cart - relationship with Cart table. Easy access to the cart data of the product.

### The Cart table contains the following attributes:
cartid - integer, auto increment, primary key.

userid - foreign key for userid of User table, not null.

productid - foreign key for productid of Product table, not null.

quantity - integer, not null.

purchased - boolean, not null, default = 0, stores 1 when the user purchases the product.

## API Design
Application Programming Interfaces of the MarketMate grocery application are designed using Flask-RESTful APIs which involves implementing API endpoints that handle various operations related to managing registration and authentication of a user. Furthermore, APIs are used to retrieve and manipulate data regarding category, product and cart entities. The APIs also facilitate various other functionalities like searching for products and categories and requesting new categories to be administered by managers. The APIs are secured using authentication token which enables role based access control over various operations and functionalities of the application. Moreover, the detailed design of APIs used in the application is discussed in the following page:

	https://app.swaggerhub.com/apis-docs/21f1006725/MarketMate/1.0.0

## Architecture and Features
The project exhibits a well-defined organizational structure. This includes Marketate.py, README.txt, requirements.txt, local_setup.sh, local_run.sh, local_workers.sh, and local_beat.sh files, alongside the application, db_directory, static, and templates folders. Furthermore, the application folder contains controller, data and jobs folders along with a config.py file. The controller folder contains api.py, controller.py, mail.py and webhook.py files which manages the views employed in the applications backend. The data folder contains data_access.py, database.py, and models.py files, which manage critical configuration and database aspects. Notably, the jobs folder is organized into tasks.py and workers.py files which manages the batch jobs. Additionally, the db_directory stores the application's database, while the static folder contains images, csv and java script files utilized throughout the project. Finally, the templates folder contains HTML templates employed in the application's interface.

The project is implemented with comprehensive features, catering to customer, store manager and administrative needs. A dedicated login page enables seamless access for registered users, while a separate register page allows new users to join. The user-friendly interface permits customers to effortlessly browse products organized into categories or utilize a robust search function to find specific items. Detailed product pages display vital information, such as prices and availability, and allow users to efficiently add items to their cart. The shopping cart provides an extensive overview of selected products, including the total amount, fostering informed purchasing decisions. Purchased products are conveniently displayed within each user's profile. Asynchronous jobs and tasks are implemented to send automated reminders and reports to the customers. On the administrative side, the project offers valuable insights through visual representations of categories, products, unavailable stock, top-selling items, and website statistics. Additionally, admins can efficiently manage categories while the store managers can manage inventory by adding, updating, and deleting products as needed and even add categories upon admin approval.

## Commands

The following are the terminal commands to run the MarketMate Grocery Store Application: 

### REDIS
	cd Downloads/redis-7.2.3
	src/redis-server

### MARKETMATE
	cd Documents/'Capstone Project'/Code/
	sh local_run.sh

### WORKERS
	cd Documents/'Capstone Project'/Code/
	sh local_workers.sh

### BEAT
	cd Documents/'Capstone Project'/Code/
	sh local_beat.sh

### MAIL
	~/go/bin/MailHog

## YAML
	https://app.swaggerhub.com/apis-docs/21f1006725/MarketMate/1.0.0

## Video
	https://drive.google.com/file/d/1LZCdGyKifVvq2619AHD2VcdZirydrWbT/view?usp=sharing
