
from app import app, db

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    
    print("Starting Flask backend server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
