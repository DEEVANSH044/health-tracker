export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // In a real app, you would store user data in a database
    // This is a mock implementation
    if (!name || !email || !password) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // Check if email is already registered (mock check)
    if (email === "user@example.com") {
      return Response.json({ success: false, message: "Email already registered" }, { status: 409 })
    }

    return Response.json({
      success: true,
      user: {
        id: Date.now(),
        name,
        email,
      },
      token: "mock-jwt-token",
    })
  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
