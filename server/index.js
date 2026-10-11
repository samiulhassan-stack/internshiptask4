import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
    }
  }
});

// Custom validators
const isValidPhone = (value) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(value);
};

const isValidName = (value) => {
  return /^[a-zA-Z\s]+$/.test(value);
};

const isFutureDate = (value) => {
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

const isWithinOneYear = (value) => {
  const selectedDate = new Date(value);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return selectedDate <= maxDate;
};

// Validation rules
const registrationValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .custom(isValidName)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .custom(isValidPhone)
    .withMessage('Please enter a valid phone number (at least 10 digits)'),

  body('eventType')
    .notEmpty()
    .withMessage('Please select an event type')
    .isIn(['conference', 'workshop', 'seminar', 'webinar', 'networking', 'training'])
    .withMessage('Invalid event type selected'),

  body('eventDate')
    .notEmpty()
    .withMessage('Event date is required')
    .isDate()
    .withMessage('Please enter a valid date')
    .custom(isFutureDate)
    .withMessage('Event date cannot be in the past')
    .custom(isWithinOneYear)
    .withMessage('Event date cannot be more than 1 year in the future'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters')
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
];

// Store registrations in memory (in production, use a database)
const registrations = [];

// Registration endpoint
app.post('/api/register', upload.single('profileImage'), registrationValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    
    // Validate file upload
    if (!req.file) {
      const fileError = {
        type: 'field',
        msg: 'Profile image is required',
        path: 'profileImage',
        location: 'body'
      };
      
      if (!errors.isEmpty()) {
        errors.errors.push(fileError);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [{ field: 'profileImage', message: fileError.msg }]
        });
      }
    }

    if (!errors.isEmpty()) {
      // If there are errors and a file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      // Format errors for client
      const formattedErrors = errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }

    // All validations passed
    const registration = {
      id: Date.now(),
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      message: req.body.message,
      profileImage: req.file.filename,
      uploadedAt: new Date().toISOString()
    };

    // Save registration
    registrations.push(registration);

    // Formatted console output
    const imagePath = path.join(uploadsDir, registration.profileImage);
    const imageSize = fs.existsSync(imagePath) ? (fs.statSync(imagePath).size / 1024).toFixed(2) : 'N/A';
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ NEW REGISTRATION RECEIVED');
    console.log('='.repeat(70));
    console.log(`📝 Registration ID    : ${registration.id}`);
    console.log(`👤 Full Name          : ${registration.fullName}`);
    console.log(`📧 Email Address      : ${registration.email}`);
    console.log(`📱 Phone Number       : ${registration.phone}`);
    console.log(`🎯 Event Type         : ${registration.eventType.toUpperCase()}`);
    console.log(`📅 Event Date         : ${registration.eventDate}`);
    console.log(`💬 Message            : ${registration.message.substring(0, 50)}${registration.message.length > 50 ? '...' : ''}`);
    console.log(`\n🖼️  IMAGE DETAILS:`);
    console.log(`   📎 Original Name   : ${req.file.originalname}`);
    console.log(`   💾 Saved As        : ${registration.profileImage}`);
    console.log(`   📏 File Size       : ${imageSize} KB`);
    console.log(`   📂 File Type       : ${req.file.mimetype}`);
    console.log(`   🔗 URL Path        : http://localhost:5000/uploads/${registration.profileImage}`);
    console.log(`   📁 Full Path       : ${imagePath}`);
    console.log(`\n⏰ Submitted At       : ${new Date(registration.uploadedAt).toLocaleString()}`);
    console.log('='.repeat(70));
    console.log(`📊 Total Registrations: ${registrations.length}`);
    console.log('='.repeat(70) + '\n');

    res.status(200).json({
      success: true,
      message: 'Registration successful!',
      data: {
        id: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        eventType: registration.eventType,
        eventDate: registration.eventDate
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    
    // If there's an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error occurred. Please try again later.',
      error: error.message
    });
  }
});

// Get all registrations (for testing)
app.get('/api/registrations', (req, res) => {
  res.json({
    success: true,
    count: registrations.length,
    data: registrations
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
        errors: [{ field: 'profileImage', message: 'Image size must be less than 5MB' }]
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Something went wrong!',
  });
});

app.listen(PORT, () => {
  console.log('🚀 Server is running!');
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💾 Uploads: ${uploadsDir}`);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /api/register - Submit registration');
  console.log('  GET  /api/registrations - View all registrations');
  console.log('  GET  /api/health - Health check');
  console.log('');
});
