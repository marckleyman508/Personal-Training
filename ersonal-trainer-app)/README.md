# Personal Trainer App

A complete web application for personal trainers to manage clients, track nutrition logs, and assign customized workout plans.

## Features

✅ **Client Management**
- Add, view, and delete clients
- Track client info (name, email, age, fitness goal)
- Manage individual client details

✅ **Workout Plans**
- Pre-built workout plans (Cardio & Strength, Hypertrophy Focus, Endurance Training)
- Assign custom workout plans to each client
- View detailed exercises for each day

✅ **Nutrition Tracking**
- Log meals with detailed macronutrient tracking
- Track calories, protein, carbs, and fat
- Add notes to each meal entry
- View nutrition history by date and meal type
- Delete nutrition logs

✅ **Beautiful UI**
- Modern, responsive design
- Intuitive navigation with tabs
- Color-coded sections for easy reading
- Mobile-friendly interface

## Installation & Setup

### Prerequisites
- Node.js and npm installed on your system

### Quick Start

**Option 1: Using the batch file (Windows)**
```bash
start.bat
```

**Option 2: Manual setup**
```bash
# Install dependencies
npm install

# Start the server
npm start

# Then open http://localhost:3000 in your browser
```

## Usage

### Add a Client
1. Click "**+ Add New Client**" button
2. Enter client details (name, email, age, fitness goal, workout plan)
3. Click "Create Client"

### View Client Details
1. Click on a client from the left sidebar
2. View their current workout plan and nutrition logs
3. Switch between tabs (Workout Plan, Nutrition Logs, Settings)

### Assign Workout Plan
1. Select a client
2. Go to the "Workout Plan" tab
3. Choose a new plan from the dropdown
4. Click "Update Plan"

### Log Nutrition
1. Select a client
2. Go to the "Nutrition Logs" tab
3. Fill in meal details:
   - Date
   - Meal type (Breakfast, Lunch, Dinner, Snack)
   - Food name
   - Macronutrients (calories, protein, carbs, fat)
   - Optional notes
4. Click "Log Nutrition"

### View/Delete Logs
- All nutrition logs appear in the "Recent Nutrition Logs" section
- Click "Delete" to remove a nutrition log

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Workout Plans
- `GET /api/workout-plans` - Get all plans
- `GET /api/workout-plans/:id` - Get single plan
- `POST /api/workout-plans` - Create new plan
- `PUT /api/clients/:id/workout-plan` - Assign plan to client

### Nutrition Logs
- `GET /api/clients/:id/nutrition-logs` - Get client's logs
- `POST /api/clients/:id/nutrition-logs` - Add nutrition log
- `DELETE /api/clients/:id/nutrition-logs/:logId` - Delete log

## Project Structure

```
personal-trainer-app/
├── server.js              # Express server & API
├── package.json           # Dependencies
├── start.bat             # Windows startup script
├── public/
│   └── index.html        # Frontend UI
└── .vscode/
    └── launch.json       # VS Code debug config
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: In-memory (easily extendable to database)

## Default Test Clients

Two sample clients are included with the app:
- **John Doe** - Cardio & Strength plan
- **Jane Smith** - Hypertrophy Focus plan

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication
- Progress tracking & analytics
- Photo comparisons
- PDF workout/nutrition reports
- Mobile app version
- Calendar view for workouts

## License

MIT

## Support

For issues or questions, please contact your development team.

---

**Ready to go!** 🏋️ Start the app and begin managing your clients' fitness journeys!
