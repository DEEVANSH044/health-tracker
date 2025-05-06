export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // In a real app, you would validate credentials against a database
    // This is a mock implementation
    if (email === "user@example.com" && password === "password") {
      return Response.json({
        success: true,
        user: {
          id: 1,
          name: "John Doe",
          email: "user@example.com",
        },
        token: "mock-jwt-token",
      })
    }

    return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
