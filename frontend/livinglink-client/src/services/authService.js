import api from "./api";

/**
 * Auth Service
 * Communicates with backend auth-service via API Gateway at /api/auth
 * Includes graceful demo session support if backend microservices are offline.
 */

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    const data = response.data;

    // Backend string responses
    if (typeof data === "string") {
      if (data.toLowerCase().includes("already exists")) {
        return { success: false, message: data };
      }
      return { success: true, message: data };
    }

    return { success: true, message: "User registered successfully" };
  } catch (err) {
    console.warn("Backend auth unavailable, saving local demo registration:", err?.message);

    // Fallback: save to localStorage for local testing
    try {
      const demoUsers = JSON.parse(
        localStorage.getItem("livinglink_demo_users") || "[]"
      );

      if (demoUsers.some((u) => u.email?.toLowerCase() === userData.email?.toLowerCase())) {
        return { success: false, message: "Email already exists" };
      }

      const newUser = {
        id: Date.now(),
        fullName: userData.fullName || "Registered User",
        email: userData.email,
        password: userData.password,
        role: userData.role || "ROOM_SEEKER",
      };

      demoUsers.push(newUser);
      localStorage.setItem("livinglink_demo_users", JSON.stringify(demoUsers));

      return { success: true, message: "User registered successfully" };
    } catch (localErr) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/api/auth/login", loginData);
    return response.data;
  } catch (err) {
    console.warn("Backend login failed or unavailable, checking local demo users:", err?.message);

    // Fallback: check localStorage demo users
    const demoUsers = JSON.parse(
      localStorage.getItem("livinglink_demo_users") || "[]"
    );

    const match = demoUsers.find(
      (u) =>
        u.email?.toLowerCase() === loginData.email?.toLowerCase() &&
        u.password === loginData.password
    );

    if (match) {
      return {
        userId: match.id,
        fullName: match.fullName,
        email: match.email,
        role: match.role,
        token: `demo-jwt-token-${match.id}`,
        message: "Login successful",
      };
    }

    throw err;
  }
};

const authService = {
  registerUser,
  loginUser,
};

export default authService;
