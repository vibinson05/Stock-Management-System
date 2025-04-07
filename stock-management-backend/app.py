from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import dotenv_values
import os

app = Flask(__name__)
app.secret_key = '50d4f8951e537de400b89ff6a9a06075f3222596032d7bf17270116ee58e7235'  # Replace with a secure key in production
# Add CORS configuration for frontend domain
CORS(app, supports_credentials=True, origins=["https://stock-management-system-1-ro50.onrender.com"])


CORS(app, supports_credentials=True, origins=[frontend_url])

# Load environment variables
config = dotenv_values()

# MongoDB configuration
app.config["MONGO_URI"] = f"mongodb+srv://{config['DB_USER']}:{config['DB_PASSWORD']}@{config['DB_HOST']}/{config['DB_NAME']}?retryWrites=true&w=majority"

mongo = PyMongo(app)

# Replacing MySQL connection with MongoDB
db = mongo.db  # MongoDB database object


@app.route('/logout')
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out'}), 200


@app.route('/check-session')
def check_session():
    if 'user' in session:
        return jsonify({'user': session['user']}), 200
    return jsonify({'message': 'Not logged in'}), 401


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = db.users.find_one({'username': username})

    if user and user['password'] == password:
        session['user'] = user['username']
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({'message': 'No data received'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    # Check if the user already exists
    if db.users.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 400

    # Insert new user into MongoDB
    db.users.insert_one({
        'username': username,
        'email': email,
        'password': password
    })

    return jsonify({'message': 'User registered successfully'}), 200


@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()

    product = {
        'name': data['name'],
        'category': data.get('category', ''),
        'price': data['price'],
        'stock_quantity': data['stock_quantity'],
        'items_sold': data.get('items_sold', 0),
        'description': data.get('description', '')
    }

    # Insert product into MongoDB
    db.products.insert_one(product)

    return jsonify({"message": "Product added successfully!"}), 201


@app.route('/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()

    product = {
        'name': data['name'],
        'category': data.get('category', ''),
        'price': data['price'],
        'stock_quantity': data['stock_quantity'],
        'items_sold': data.get('items_sold', 0),
        'description': data.get('description', '')
    }

    # Update product in MongoDB
    db.products.update_one({'_id': product_id}, {'$set': product})

    return jsonify({'message': 'Product updated successfully'})


@app.route('/products', methods=['GET'])
def get_products():
    products = db.products.find()
    product_list = []
    for product in products:
        product['_id'] = str(product['_id'])  # Convert ObjectId to string
        product_list.append(product)

    return jsonify(product_list)


@app.route('/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    db.products.delete_one({'_id': product_id})
    return jsonify({'message': 'Product deleted successfully'})


@app.route('/')
def home():
    return "Flask Backend Running with MongoDB!"


if __name__ == '__main__':
    app.run(debug=True)
