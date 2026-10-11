import { useState } from 'react';
import Toast from './components/Toast';

const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';

      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';

      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) return 'Please enter a valid phone number (at least 10 digits)';
        return '';

      case 'eventType':
        if (!value) return 'Please select an event type';
        return '';

      case 'eventDate':
        if (!value) return 'Event date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Event date cannot be in the past';
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        if (selectedDate > maxDate) return 'Event date cannot be more than 1 year in the future';
        return '';

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 500) return 'Message cannot exceed 500 characters';
        return '';

      case 'profileImage':
        if (!value) return 'Profile image is required';
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(value.type)) {
          return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
        }
        if (value.size > 5 * 1024 * 1024) {
          return 'Image size must be less than 5MB';
        }
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profileImage: file }));
    
    if (errors.profileImage) {
      setErrors((prev) => ({ ...prev, profileImage: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please fix all errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for submission
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Server validation errors
        if (result.errors) {
          const serverErrors = {};
          result.errors.forEach((error) => {
            serverErrors[error.field] = error.message;
          });
          setErrors(serverErrors);
          addToast('Server validation failed. Please check the form.', 'error');
        } else {
          addToast(result.message || 'Registration failed. Please try again.', 'error');
        }
      } else {
        // Success
        addToast('🎉 Registration successful! Welcome to the event.', 'success');
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          message: '',
          profileImage: null,
        });
        setErrors({});
        
        // Reset file input
        const fileInput = document.getElementById('profileImage');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Submission error:', error);
      addToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = formData.message.length;
  const maxLength = 500;

  return (
    <div className="app">
      <div className="form-container">
        <div className="form-header">
          <h1>Event Registration Form</h1>
          <p>Fill out all fields to register for our upcoming event</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
          </div>

          {/* Event Type (Dropdown) */}
          <div className="form-group">
            <label htmlFor="eventType">
              Event Type <span className="required">*</span>
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className={errors.eventType ? 'error' : ''}
            >
              <option value="">-- Select Event Type --</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="webinar">Webinar</option>
              <option value="networking">Networking Event</option>
              <option value="training">Training Session</option>
            </select>
            {errors.eventType && (
              <div className="error-message">{errors.eventType}</div>
            )}
          </div>

          {/* Event Date */}
          <div className="form-group">
            <label htmlFor="eventDate">
              Event Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className={errors.eventDate ? 'error' : ''}
            />
            {errors.eventDate && (
              <div className="error-message">{errors.eventDate}</div>
            )}
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">
              Why do you want to attend? <span className="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? 'error' : ''}
              placeholder="Tell us why you're interested in this event..."
              rows="4"
            />
            {errors.message && (
              <div className="error-message">{errors.message}</div>
            )}
            <div className={`char-counter ${messageLength > maxLength * 0.9 ? 'warning' : ''}`}>
              {messageLength} / {maxLength}
            </div>
          </div>

          {/* Profile Image */}
          <div className="form-group">
            <label htmlFor="profileImage">
              Profile Image <span className="required">*</span>
            </label>
            <div className="file-input-wrapper">
              <label
                htmlFor="profileImage"
                className={`file-input-label ${formData.profileImage ? 'has-file' : ''} ${errors.profileImage ? 'error' : ''}`}
              >
                {formData.profileImage ? '✓ File Selected' : '📁 Click to upload image'}
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleFileChange}
                className="file-input"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              />
              {formData.profileImage && (
                <div className="file-name">
                  📎 {formData.profileImage.name}
                </div>
              )}
            </div>
            {errors.profileImage && (
              <div className="error-message">{errors.profileImage}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? '' : 'Register for Event'}
            {isSubmitting && <div className="loading-spinner"></div>}
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;
