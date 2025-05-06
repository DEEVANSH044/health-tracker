"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, Heart, Droplets, Calendar, User, Pill, ArrowRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginForm from "@/components/login-form"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("healthTrackerToken")
    if (token) {
      fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsLoggedIn(true)
            setUser(data.user)
            router.push("/dashboard")
          } else {
            localStorage.removeItem("healthTrackerToken")
          }
        })
        .catch((err) => {
          console.error("Auth validation error:", err)
          localStorage.removeItem("healthTrackerToken")
        })
    }
  }, [router])

  const handleLogin = (userData, token) => {
    localStorage.setItem("healthTrackerToken", token)
    setUser(userData)
    setIsLoggedIn(true)
    router.push("/dashboard")
  }

  const sdgGoals = [
    {
      number: 3,
      title: "Good Health and Well-being",
      description: "Ensure healthy lives and promote well-being for all at all ages.",
      color: "bg-red-500",
      features: [
        "Track vital health metrics like blood pressure and heart rate",
        "Monitor water intake for proper hydration",
        "Medication reminders to ensure adherence to treatment plans",
      ],
    },
    {
      number: 10,
      title: "Reduced Inequalities",
      description: "Reduce inequality within and among countries.",
      color: "bg-pink-500",
      features: [
        "Accessible health tracking for all demographics",
        "Simplified interface for users of all technical abilities",
        "Free tier access to essential health monitoring tools",
      ],
    },
    {
      number: 9,
      title: "Industry, Innovation and Infrastructure",
      description:
        "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
      color: "bg-purple-500",
      features: [
        "Innovative health tracking technology",
        "Digital infrastructure for personal health management",
        "Integration capabilities with healthcare systems",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">HealthTracker</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a
              href="#team"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Our Team
            </a>
            <a
              href="#sdg"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              SDG Goals
            </a>
            <a
              href="#features"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <Button
              onClick={() => document.getElementById("login-section").scrollIntoView({ behavior: "smooth" })}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
            >
              Get Started
            </Button>
          </nav>
          <Button
            className="md:hidden"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById("login-section").scrollIntoView({ behavior: "smooth" })}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container py-20 md:py-32 flex flex-col items-center text-center">
          <div className="space-y-6 max-w-4xl mx-auto px-4">
            <div className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
              Your Personal Health Companion
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              HealthTracker
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
              Track, monitor, and manage all your health metrics in one place. Supporting UN Sustainable Development
              Goals for better health and well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                onClick={() => document.getElementById("login-section").scrollIntoView({ behavior: "smooth" })}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                onClick={() => document.getElementById("team").scrollIntoView({ behavior: "smooth" })}
              >
                Meet Our Team
              </Button>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section id="team" className="py-20 bg-white dark:bg-gray-900 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400">Meet Our Team</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
                The brilliant minds behind HealthTracker, dedicated to improving health monitoring and management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Team Member 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/30 group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 transform group-hover:scale-105 transition-transform duration-500 shadow-md">
                  {/* PLACEHOLDER FOR IMAGE - Replace with actual image */}
                  
         
                  <img src="/abc.jpg" alt="Deevansh Rana" className="object-cover w-full h-full" />
                  
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 flex items-center justify-center">
                    <User className="h-20 w-20 text-blue-600/50 dark:text-blue-400/50" />
                  </div> */}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
                  Deevansh Rana
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">Team Lead & Developer</p>
                <div className="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Passionate about creating technology that improves health outcomes and quality of life.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/30 group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 transform group-hover:scale-105 transition-transform duration-500 shadow-md">
                
                
                <img src="/Edum.jpg" alt="Edum Goyal" className="object-cover w-full h-full" />


                  
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
                  Eddam Goyal
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">UX Designer & Developer</p>
                <div className="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Focused on creating intuitive and accessible health tracking interfaces for users of all abilities.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/30 group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 transform group-hover:scale-105 transition-transform duration-500 shadow-md">
                  
                <img src="/DevanshKumar.jpg" alt="Devansh Kumar" className="object-cover w-full h-full" />

                 
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
                  Devansh Kumar
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                  Backend Developer & Health Data Specialist
                </p>
                <div className="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Expert in health data management and creating secure systems for sensitive medical information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SDG Goals Section */}
        <section
          id="sdg"
          className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/50 px-4 md:px-8"
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 mb-4">
                <Globe className="h-4 w-4" />
                <span>Supporting UN Sustainable Development Goals</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-600 dark:text-green-400">
                Our Commitment to Global Health
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
                HealthTracker is aligned with the United Nations Sustainable Development Goals, focusing on improving
                health outcomes worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {sdgGoals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/30 overflow-hidden relative group"
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 ${goal.color} opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}
                  ></div>

                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`flex items-center justify-center w-14 h-14 rounded-full ${goal.color} text-white font-bold text-xl`}
                    >
                      {goal.number}
                    </div>
                    <h3 className="text-xl font-bold">{goal.title}</h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">{goal.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">How HealthTracker Contributes:</h4>
                    <ul className="space-y-2">
                      {goal.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="mt-1 h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                Comprehensive Health Tracking
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto">
                HealthTracker provides all the tools you need to monitor and improve your health metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <Droplets className="h-12 w-12 text-blue-500" />,
                  title: "Water Intake Tracking",
                  description: "Monitor your daily water consumption with easy-to-use glass tracking and reminders.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: <Activity className="h-12 w-12 text-red-500" />,
                  title: "Blood Pressure Monitoring",
                  description: "Record and analyze your blood pressure readings with automatic categorization.",
                  color: "from-red-500 to-red-600",
                },
                {
                  icon: <Heart className="h-12 w-12 text-pink-500" />,
                  title: "Heart Rate Tracking",
                  description: "Keep track of your heart rate measurements and identify patterns over time.",
                  color: "from-pink-500 to-pink-600",
                },
                {
                  icon: <Calendar className="h-12 w-12 text-purple-500" />,
                  title: "Appointment Management",
                  description: "Never miss a doctor's appointment with our intuitive scheduling system.",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: <User className="h-12 w-12 text-emerald-500" />,
                  title: "Healthcare Provider Directory",
                  description: "Maintain a list of all your doctors and specialists in one convenient place.",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  icon: <Pill className="h-12 w-12 text-amber-500" />,
                  title: "Medication Reminders",
                  description: "Set up reminders for your medications and track when you've taken them.",
                  color: "from-amber-500 to-amber-600",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-800/30 group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/80 to-blue-100/80 dark:from-gray-800/80 dark:to-blue-900/80 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md inline-block relative z-10">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>

                  <p className="text-gray-600 dark:text-gray-300 relative z-10">{feature.description}</p>

                  <div
                    className="h-1 w-16 mt-6 rounded-full bg-gradient-to-r opacity-70 relative z-10"
                    style={{ backgroundImage: `linear-gradient(to right, ${feature.color})` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Login/Signup Section */}
        <section
          id="login-section"
          className="py-20 bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-blue-950/50 dark:to-gray-900"
        >
          <div className="container">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
                  Get Started Today
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Create an account or log in to begin your health journey.
                </p>
              </div>
              <LoginForm onLogin={handleLogin} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                  HealthTracker
                </span>
              </div>
              <p className="text-gray-400">
                Your personal health companion for tracking and managing all your health metrics.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Water Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blood Pressure
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Heart Rate
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Appointments
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">SDG Goals</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Good Health and Well-being
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Reduced Inequalities
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Industry, Innovation and Infrastructure
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HealthTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
