export const validationMessages = {
  firstName: {
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters",
    "string.max": "First name must not exceed 50 characters",
    "any.required": "First name is required",
  },

  lastName: {
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 3 characters",
    "string.max": "Last name must not exceed 50 characters",
    "any.required": "Last name is required",
  },

  email: {
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  },

  password: {
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  },

  accountType: {
    "any.only": "Account type must be either STUDENT or ADMIN",
  },

  section: {
    "string.empty": "Section is required",
    "any.only": "Please select a valid section",
    "any.required": "Section is required",
  },

  department: {
    "string.empty": "Department is required",
    "any.only": "Please select a valid department",
    "any.required": "Department is required",
  },
};