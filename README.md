# Event Registration Form - Task 3 📋

A full-stack event registration form with comprehensive client-side and server-side validation, built for internship Task 3.

## ✨ Features

### Form Fields (6+ Required)
1. **Full Name** - Text input with alphabetic validation
2. **Email Address** - Email input with format validation
3. **Phone Number** - Tel input with format validation
4. **Event Type** - Dropdown/Select with 6 options
5. **Event Date** - Date picker with past/future validation
6. **Message** - Textarea with character count (10-500 chars)
7. **Profile Image** - File upload with type/size validation

### Client-Side Validation ✅
- Real-time field validation as user types
- Clear, field-specific error messages
- Visual error indicators (red borders, warning icons)
- Character counter for textarea
- File type and size validation
- Date range validation (no past dates, max 1 year ahead)
- Form-level validation before submission

### Server-Side Validation 🛡️
- Complete validation matching client rules
- Express-validator for robust validation
- File upload validation (type, size, existence)
- Sanitization and normalization
- Detailed error responses with field mapping
- Never trusts frontend data

### User Feedback 💬
- **Success Toast**: Green animated notification on successful submission
- **Error Toast**: Red animated notification on validation failure
- **Loading State**: Disabled submit button with spinner during request
- **Auto-dismiss**: Toasts automatically disappear after 5 seconds
- **Manual dismiss**: Close button on each toast

### Additional Features
- Responsive design for mobile and desktop
- Beautiful gradient UI with smooth animations
- Form reset after successful submission
- Network error handling
- File preview (shows selected filename)
- Accessibility considerations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run both client and server (Development):**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Live Demo

🌐 **Live Application:** https://internshiptask4-kh3f.vercel.app

The application is deployed on Vercel with both frontend and backend API routes.

**Note:** File uploads in production are stored in memory only (Vercel serverless limitation). For persistent storage, integrate with Cloudinary or AWS S3.

### Alternative: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev:client
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## 📹 Testing for Video Recording

### Test Case 1: Valid Submission ✅
1. Fill in all fields with valid data:
   - Full Name: `John Doe`
   - Email: `john.doe@example.com`
   - Phone: `+1 (555) 123-4567`
   - Event Type: `Workshop`
   - Event Date: (Select any future date)
   - Message: `I'm excited to learn new skills and network with professionals in this workshop.`
   - Profile Image: Upload any image (JPEG/PNG/GIF, under 5MB)

2. Click "Register for Event"
3. Watch for:
   - Submit button shows loading spinner
   - Button is disabled during request
   - Green success toast appears
   - Form resets after success

### Test Case 2: Client-Side Validation Errors ❌
Try these invalid inputs to trigger client-side errors:

1. **Empty fields** - Submit without filling anything
2. **Invalid name** - Enter `John123` (contains numbers)
3. **Invalid email** - Enter `notanemail`
4. **Invalid phone** - Enter `123` (too short)
5. **No event type** - Leave dropdown empty
6. **Past date** - Select yesterday's date
7. **Short message** - Enter `Too short` (less than 10 chars)
8. **Large message** - Enter 501+ characters
9. **Wrong file type** - Try uploading a .txt or .pdf file
10. **Large file** - Try uploading an image > 5MB

Watch for:
- Red borders on invalid fields
- Specific error messages below each field
- Error toast notification
- No network request made

### Test Case 3: Server-Side Validation ❌
To test server validation:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Fill the form with valid data
4. Before submitting, modify the HTML:
   - Remove `required` attributes
   - Change input types
   - Modify validation patterns
5. Submit the form

The server will catch invalid data and return errors, proving server-side validation works independently.

## 🏗️ Project Structure

```
task4/
├── src/
│   ├── components/
│   │   └── Toast.jsx          # Toast notification component
│   ├── App.jsx                 # Main form component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── server/
│   ├── index.js               # Express server with validation
│   └── uploads/               # Uploaded files directory
├── index.html                 # HTML entry
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔍 Validation Rules

### Full Name
- Required field
- Minimum 2 characters
- Only letters and spaces allowed

### Email
- Required field
- Must be valid email format
- Example: `user@example.com`

### Phone
- Required field
- Minimum 10 digits
- Accepts: `+1 (555) 123-4567`, `555-123-4567`, `5551234567`

### Event Type
- Required field
- Must select one of: Conference, Workshop, Seminar, Webinar, Networking Event, Training Session

### Event Date
- Required field
- Cannot be in the past
- Cannot be more than 1 year in the future

### Message
- Required field
- Minimum 10 characters
- Maximum 500 characters
- Character counter shows remaining space

### Profile Image
- Required field
- Allowed types: JPEG, JPG, PNG, GIF, WebP
- Maximum size: 5MB

## 🎨 UI Features

- **Gradient background** - Purple/blue gradient for modern look
- **Smooth animations** - Button hovers, toast slide-ins, spinner rotation
- **Loading states** - Visual feedback during async operations
- **Responsive design** - Works on mobile, tablet, and desktop
- **Accessible** - Proper labels, ARIA attributes, keyboard navigation

## 📊 API Endpoints

### POST `/api/register`
Submit a new registration.

**Request:** multipart/form-data with all form fields

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful!",
  "data": {
    "id": 1728661200000,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "eventType": "workshop",
    "eventDate": "2026-11-15"
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### GET `/api/registrations`
View all registrations (for testing).

### GET `/api/health`
Health check endpoint.

## 🎥 LinkedIn Post Tips

When recording your demo video:

1. **Show the form** - Pan through all 7 fields
2. **Valid submission** - Fill everything correctly and submit
3. **Point out feedback**:
   - Loading spinner
   - Disabled button
   - Success toast
   - Form reset
4. **Invalid submission** - Demonstrate 2-3 validation errors:
   - Empty required fields
   - Invalid email format
   - Wrong file type
5. **Server validation** - Show DevTools Network tab to prove backend validation

**Suggested caption:**
```
✅ Task 3 Complete: Built a production-ready registration form with dual-layer validation!

🎯 Features:
• 7 diverse input types (text, email, phone, select, date, textarea, file)
• Real-time client validation with specific error messages
• Server-side validation that never trusts the frontend
• Beautiful UI with loading states and toast notifications
• Full error handling and user feedback

💡 Key Learning: Good forms need validation on BOTH sides - the frontend for UX, the backend for security.

#WebDevelopment #FullStack #React #NodeJS #FormValidation #Internship
```

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Backend**: Express.js, Node.js
- **Validation**: express-validator
- **File Upload**: Multer
- **Styling**: Pure CSS with modern features

## 📝 Notes

- Uploaded files are stored in `server/uploads/`
- Registrations are stored in memory (restart clears data)
- For production, add database integration
- CORS is enabled for development

## 🎓 Learning Outcomes

This task demonstrates:
1. ✅ Building complex forms with multiple input types
2. ✅ Implementing comprehensive validation layers
3. ✅ Handling file uploads securely
4. ✅ Creating responsive user feedback systems
5. ✅ Backend API development with proper error handling
6. ✅ Full-stack integration

---

**Task Status**: ✅ Complete
**Ready for**: Video recording and LinkedIn post
