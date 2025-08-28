// -----------------------------
// Login User (Verify OTP)
// -----------------------------
export const loginUser = async (data: { email: string; otp: string }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // { email, otp }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to verify user");
    }

    return result; // token, user info, etc.
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

// -----------------------------
// Register User
// -----------------------------
export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to register user");
    }

    return result;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

//forgate password

export const forgatePassword = async (email: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/forget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to forgate password");
    }
  }
};

// change password
export const resetPassword = async (password: string, token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({password}),
      }
    );
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

// -----------------------------
