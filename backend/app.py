
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float, default=0.0)
    max_participants = db.Column(db.Integer, default=100)
    image_url = db.Column(db.String(500))
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class EventParticipation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

# Auth decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow().timestamp() + 86400  # 24 hours
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'is_admin': user.is_admin
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    events_list = []
    
    for event in events:
        organizer = User.query.get(event.organizer_id)
        participants_count = EventParticipation.query.filter_by(event_id=event.id).count()
        
        events_list.append({
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'category': event.category,
            'location': event.location,
            'date': event.date.isoformat(),
            'time': event.time,
            'price': event.price,
            'max_participants': event.max_participants,
            'current_participants': participants_count,
            'image_url': event.image_url,
            'organizer': organizer.name if organizer else 'Unknown'
        })
    
    return jsonify(events_list)

@app.route('/api/events', methods=['POST'])
@token_required
def create_event(current_user):
    data = request.get_json()
    
    event = Event(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        location=data['location'],
        date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
        time=data['time'],
        price=data.get('price', 0.0),
        max_participants=data.get('maxParticipants', 100),
        image_url=data.get('imageUrl'),
        organizer_id=current_user.id
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Event created successfully', 'id': event.id}), 201

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    organizer = User.query.get(event.organizer_id)
    participants_count = EventParticipation.query.filter_by(event_id=event.id).count()
    
    return jsonify({
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'category': event.category,
        'location': event.location,
        'date': event.date.isoformat(),
        'time': event.time,
        'price': event.price,
        'max_participants': event.max_participants,
        'current_participants': participants_count,
        'image_url': event.image_url,
        'organizer': organizer.name if organizer else 'Unknown'
    })

@app.route('/api/events/<int:event_id>/join', methods=['POST'])
@token_required
def join_event(current_user, event_id):
    event = Event.query.get_or_404(event_id)
    
    # Check if already joined
    existing = EventParticipation.query.filter_by(
        event_id=event_id, 
        user_id=current_user.id
    ).first()
    
    if existing:
        return jsonify({'error': 'Already joined this event'}), 400
    
    # Check if event is full
    current_participants = EventParticipation.query.filter_by(event_id=event_id).count()
    if current_participants >= event.max_participants:
        return jsonify({'error': 'Event is full'}), 400
    
    participation = EventParticipation(
        event_id=event_id,
        user_id=current_user.id
    )
    
    db.session.add(participation)
    db.session.commit()
    
    return jsonify({'message': 'Successfully joined event'})

@app.route('/api/events/<int:event_id>/leave', methods=['DELETE'])
@token_required
def leave_event(current_user, event_id):
    participation = EventParticipation.query.filter_by(
        event_id=event_id,
        user_id=current_user.id
    ).first()
    
    if not participation:
        return jsonify({'error': 'Not joined to this event'}), 400
    
    db.session.delete(participation)
    db.session.commit()
    
    return jsonify({'message': 'Successfully left event'})

@app.route('/api/user/events', methods=['GET'])
@token_required
def get_user_events(current_user):
    # Events created by user
    created_events = Event.query.filter_by(organizer_id=current_user.id).all()
    
    # Events joined by user
    participations = EventParticipation.query.filter_by(user_id=current_user.id).all()
    joined_events = [Event.query.get(p.event_id) for p in participations]
    
    def format_event(event):
        participants_count = EventParticipation.query.filter_by(event_id=event.id).count()
        return {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'category': event.category,
            'location': event.location,
            'date': event.date.isoformat(),
            'time': event.time,
            'price': event.price,
            'max_participants': event.max_participants,
            'current_participants': participants_count,
            'image_url': event.image_url
        }
    
    return jsonify({
        'created': [format_event(event) for event in created_events],
        'joined': [format_event(event) for event in joined_events]
    })

# Admin routes
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], is_admin=True).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow().timestamp() + 86400
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'is_admin': user.is_admin
            }
        })
    
    return jsonify({'error': 'Invalid admin credentials'}), 401

@app.route('/api/admin/stats', methods=['GET'])
@token_required
def admin_stats(current_user):
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    total_events = Event.query.count()
    total_users = User.query.filter_by(is_admin=False).count()
    total_participations = EventParticipation.query.count()
    
    return jsonify({
        'total_events': total_events,
        'total_users': total_users,
        'total_participations': total_participations
    })

@app.route('/api/admin/users', methods=['GET'])
@token_required
def admin_get_users(current_user):
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.filter_by(is_admin=False).all()
    users_list = []
    
    for user in users:
        events_created = Event.query.filter_by(organizer_id=user.id).count()
        events_joined = EventParticipation.query.filter_by(user_id=user.id).count()
        
        users_list.append({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'created_at': user.created_at.isoformat(),
            'events_created': events_created,
            'events_joined': events_joined
        })
    
    return jsonify(users_list)

@app.route('/api/admin/events', methods=['GET'])
@token_required
def admin_get_events(current_user):
    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    events = Event.query.all()
    events_list = []
    
    for event in events:
        organizer = User.query.get(event.organizer_id)
        participants_count = EventParticipation.query.filter_by(event_id=event.id).count()
        
        events_list.append({
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'category': event.category,
            'location': event.location,
            'date': event.date.isoformat(),
            'time': event.time,
            'price': event.price,
            'max_participants': event.max_participants,
            'current_participants': participants_count,
            'image_url': event.image_url,
            'organizer': organizer.name if organizer else 'Unknown',
            'created_at': event.created_at.isoformat()
        })
    
    return jsonify(events_list)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        admin = User.query.filter_by(email='admin@admin.com').first()
        if not admin:
            admin = User(
                name='Admin',
                email='admin@admin.com',
                password_hash=generate_password_hash('admin123'),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: admin@admin.com / admin123")
    
    app.run(debug=True, port=5000)
