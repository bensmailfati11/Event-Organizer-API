# 🎉 Event Organizer API

A simple REST API to **create, manage, and attend events** — with **authentication**, **role-based permissions**.

---

## 🚀 Features

- 👤 User registration & login
- 🗓️ Create, read, update, delete events
- 🪪 Register & unregister for events
- 🔒 Roles: **Admin**, **Organizer**, **Member**

---

## ⚙️ Complete Setup & Run

Follow these steps **top-to-bottom**:

### 1️⃣ Prerequisites

- Node.js (v14+)
- MongoDB installed locally (or via Atlas)
- VS Code + REST Client extension (optional for testing)

---

### 2️⃣ Clone & Install

```bash
git clone <github.com/bensmailfati11/geeks-institute/tree/master/week_6/day_5/>
cd <Event Organizer API>
npm install
```

````

---

### 3️⃣ Environment Variables

Create a `.env` file in the project root with:

```env
PORT=3001
MONGO_URL=mongodb://localhost:27017/event-organizer
JWT_SECRET=your-secret-key-here
```

> Change `JWT_SECRET` to a strong random string in production.

---

### 4️⃣ Start MongoDB

```bash
# Windows
net start MongoDB

# macOS / Linux
sudo systemctl start mongod
```

---

### 5️⃣ Start the Server

```bash
npm run dev
```

> Server runs at **[http://localhost:3001](http://localhost:3001)**

---

## 👥 User Roles

| Role          | Permissions                            |
| ------------- | -------------------------------------- |
| **Member**    | Register / unregister for events       |
| **Organizer** | All Member actions + manage own events |
| **Admin**     | Full control over all events           |

---

## 🧭 API Endpoints

### Authentication

**Register**

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

**Login**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Events

**Get all events**

```http
GET /events
```

**Get event by ID**

```http
GET /events/:id
```

**Create event (Organizer/Admin)**

```http
POST /events
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Tech Meetup",
  "description": "A meetup for tech enthusiasts",
  "date": "2025-12-15T18:00:00Z",
  "location": "Paris",
  "capacity": 50,
  "status": "published"
}
```

**Update event (Owner/Admin)**

```http
PUT /events/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Updated Tech Meetup",
  "capacity": 100
}
```

**Delete event (Owner/Admin)**

```http
DELETE /events/:id
Authorization: Bearer YOUR_TOKEN
```

**Register for event (Member)**

```http
POST /events/:id/register
Authorization: Bearer YOUR_TOKEN
```

**Unregister from event (Member)**

```http
DELETE /events/:id/register
Authorization: Bearer YOUR_TOKEN
```

---

## 🧪 Testing (REST Client)

1. Open `rest/auth.rest` → run **register** & **login** requests.
2. Copy the `token` from login response:

```json
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

3. Paste token at the top of `rest/events.rest`:

```
@org_token = eyJhbGciOiJIUzI1NiIs...
@member_token = ...
@admin_token = ...
```

4. Create an event → copy `_id` → set:

```
@event_id = your_event_id
```

5. Run all other requests (update, delete, register, unregister).

> `.rest` files are ignored by Git to protect your tokens.

---

## 🏗️ Project Structure

```
src/
  main.js
  databases/connect-mongo.js
  routes/
    index.js
    auth/index.js
    events/index.js
  modules/
    auth/
      model/index.js
      services/index.js
    events/
      model/index.js
      services/index.js
  middlewares/
    auth.js
    roles.js
```

---

## 🧰 Tech Stack

- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

---

## 🛠️ Troubleshooting

**MongoDB not connecting**

```bash
# Windows
net start MongoDB
# macOS / Linux
sudo systemctl start mongod
```

**Invalid token** → copy full token from login response without quotes.
**Event not found** → create event first, copy `_id` into `@event_id`.
**Port 3001 already in use** → change `.env` PORT or kill process.

---

## 🔒 Security

- Never commit `.env` or `.rest` files
- Use a strong `JWT_SECRET` in production
- Tokens expire after 24h — log in again to refresh

---

## ❤️ Contributing

Found a bug or want a new feature?
Open an issue or pull request — contributions are always welcome!

---

**Made with Node, Mongo & ☕ by developers, for developers.**

```

---

This version includes **Environment setup, MongoDB, dependencies, server run, API usage, testing, troubleshooting, security** 

````
