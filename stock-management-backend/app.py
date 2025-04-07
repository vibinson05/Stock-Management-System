
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from dotenv import dotenv_values



app = Flask(__name__)
app.secret_key = '50d4f8951e537de400b89ff6a9a06075f3222596032d7bf17270116ee58e7235'  # Replace with a secure key in production
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

config = dotenv_values()

# ✅ MySQL connection using env variables
db = mysql.connector.connect(
    host=config["DB_HOST"],
    user=config["DB_USER"],
    password=config["DB_PASSWORD"],
    database=config["DB_NAME"]
)



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

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if user and user['password'] == password:

        session['user'] = user['username']
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received:", data)

    if not data:
        return jsonify({'message': 'No data received'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    try:
        cursor = db.cursor(dictionary=True)  # ✅ Fix added here

        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            return jsonify({'message': 'User already exists'}), 400

        # Insert new user
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )

        db.commit()
        cursor.close()  # ✅ Close cursor

        return jsonify({'message': 'User registered successfully'}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'message': 'Internal Server Error'}), 500

    
@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    cursor = db.cursor()

    sql = """
    INSERT INTO products (name, category, price, stock_quantity,items_sold, description)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        data['name'],
        data.get('category', ''),
        data['price'],
        data['stock_quantity'],
        data.get('items_sold'),
        data.get('description', ''),
       
    )

    cursor.execute(sql, values)
    db.commit()
    cursor.close()

    return jsonify({"message": "Product added successfully!"}), 201

@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    cursor = db.cursor()
    sql = """
        UPDATE products
        SET name=%s, category=%s, price=%s, stock_quantity=%s, items_sold=%s, description=%s
        WHERE id=%s
    """
    values = (
        data['name'],
        data.get('category', ''),
        data['price'],
        data['stock_quantity'],
         data.get('items_sold'),
        data.get('description', ''),
        product_id
    )
    cursor.execute(sql, values)
    db.commit()
    cursor.close()
    return jsonify({'message': 'Product updated successfully'})


@app.route('/products', methods=['GET'])
def get_products():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    return jsonify(products)

@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
    db.commit()
    cursor.close()
    return jsonify({'message': 'Product deleted successfully'})

@app.route('/')
def home():
    return "Flask Backend Running!"

if __name__ == '__main__':
    app.run(debug=True)