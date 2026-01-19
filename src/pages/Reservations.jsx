import { useState } from "react";
import { Toast, Spinner } from "../components/ui";

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Validation patterns matching backend
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-+()]{7,20}$/;

// Generate time slots from 11:00 to 21:00 in 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 11; hour <= 21; hour++) {
    for (const minutes of ["00", "30"]) {
      if (hour === 21 && minutes === "30") break; // Last slot at 21:00
      const time = `${hour.toString().padStart(2, "0")}:${minutes}`;
      slots.push(time);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Format time for display (12-hour format)
const formatTime = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Get date 60 days from now for max date
const getMaxDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 60);
  return date.toISOString().split("T")[0];
};

export default function Reservations() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    party_size: "",
    special_requests: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value || value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value || !emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value || !phoneRegex.test(value)) {
          return "Please enter a valid phone number";
        }
        break;
      case "date":
        if (!value) {
          return "Please select a date";
        }
        break;
      case "time":
        if (!value) {
          return "Please select a time";
        }
        break;
      case "party_size": {
        const size = parseInt(value, 10);
        if (!value || isNaN(size) || size < 1 || size > 20) {
          return "Party size must be between 1 and 20";
        }
        break;
      }
      default:
        break;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ["name", "email", "phone", "date", "time", "party_size"];

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          party_size: parseInt(formData.party_size, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      // Success - show toast and reset form
      setToast({
        type: "success",
        message: "Reservation confirmed! We look forward to seeing you.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        party_size: "",
        special_requests: "",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:ring-primary-200 focus:border-primary-500"
    }`;

  return (
    <div className="min-h-screen bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-800 mb-4">
            Make a Reservation
          </h1>
          <p className="text-gray-600 text-lg">
            Reserve your table and enjoy an unforgettable dining experience at
            Sabor Divino.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6"
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={inputClasses("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="john@example.com"
                className={inputClasses("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="(555) 123-4567"
                className={inputClasses("phone")}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                min={getTodayDate()}
                max={getMaxDate()}
                className={inputClasses("date")}
                disabled={isSubmitting}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Time <span className="text-red-500">*</span>
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClasses("time")}
                disabled={isSubmitting}
              >
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTime(slot)}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Party Size */}
          <div>
            <label
              htmlFor="party_size"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Party Size <span className="text-red-500">*</span>
            </label>
            <select
              id="party_size"
              name="party_size"
              value={formData.party_size}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses("party_size")}
              disabled={isSubmitting}
            >
              <option value="">Select party size</option>
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
            {errors.party_size && (
              <p className="mt-1 text-sm text-red-500">{errors.party_size}</p>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label
              htmlFor="special_requests"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Special Requests <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              placeholder="Allergies, dietary restrictions, special occasions, seating preferences..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary-500 hover:bg-secondary-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                <span>Submitting...</span>
              </>
            ) : (
              "Confirm Reservation"
            )}
          </button>

          {/* Info Note */}
          <p className="text-sm text-gray-500 text-center">
            By making a reservation, you agree to our cancellation policy.
            Please arrive within 15 minutes of your reservation time.
          </p>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
