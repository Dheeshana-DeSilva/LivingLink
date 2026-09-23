import api from "./api";

/**
 * Auth Service
 * Communicates with backend auth-service via API Gateway at /api/auth
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  const data = response.data;

  // Backend returns a plain string response
  if (typeof data === "string") {
    if (data.toLowerCase().includes("already exists")) {
      return { success: false, message: data };
    }
    return { success: true, message: data };
  }

  return { success: true, message: "User registered successfully" };
};

/**
 * Login user and receive JWT + user info
 * POST /api/auth/login
 *
 * Expected response:
 * { userId, fullName, email, role, token, message }
 */
export const loginUser = async (loginData) => {
  const response = await api.post("/api/auth/login", loginData);
  return response.data;
};

const authService = {
  registerUser,
  loginUser,
};

export default authService;
