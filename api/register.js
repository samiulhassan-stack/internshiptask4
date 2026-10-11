import multer from 'multer';
import { body, validationResult } from 'express-validator';

// Configure multer for memory storage (Vercel doesn't support disk storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
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

// Middleware to run validation
const runValidation = async (req, res) => {
  for (const validation of registrationValidation) {
    await validation.run(req);
  }
};

// Store registrations in memory (for demo purposes)
const registrations = [];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Handle file upload
    await new Promise((resolve, reject) => {
      upload.single('profileImage')(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Run validation
    await runValidation(req, res);
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
      profileImage: req.file.originalname,
      fileSize: (req.file.size / 1024).toFixed(2) + ' KB',
      uploadedAt: new Date().toISOString()
    };

    // Save registration
    registrations.push(registration);

    // Console output for demo
    console.log('✅ NEW REGISTRATION:', registration);

    return res.status(200).json({
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

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.',
          errors: [{ field: 'profileImage', message: 'Image size must be less than 5MB' }]
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Server error occurred. Please try again later.',
      error: error.message
    });
  }
}
