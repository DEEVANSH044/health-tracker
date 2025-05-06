export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ valid: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // In a real app, you would validate the JWT token
    // This is a mock implementation
    if (token === "mock-jwt-token" || token === "demo-token-123") {
      return Response.json({
        valid: true,
        user: {
          id: 1,
          name: "John Doe",
          email: "user@example.com",
        },
      })
    }

    return Response.json({ valid: false, message: "Invalid token" }, { status: 401 })
  } catch (error) {
    return Response.json({ valid: false, message: "Server error" }, { status: 500 })
  }
}
