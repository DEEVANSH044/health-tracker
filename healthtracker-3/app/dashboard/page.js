"use client"

import { useState, useEffect } from "react"
import { Droplets, Heart, Calendar, User, Pill, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WaterTracker from "@/components/water-tracker"
import BPTracker from "@/components/bp-tracker"
import HeartbeatRecorder from "@/components/heartbeat-recorder"
import Appointments from "@/components/appointments"
import DoctorsList from "@/components/doctors-list"
import PillsReminder from "@/components/pills-reminder"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
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
            setLoading(false)
          } else {
            localStorage.removeItem("healthTrackerToken")
            router.push("/")
          }
        })
        .catch((err) => {
          console.error("Auth validation error:", err)
          localStorage.removeItem("healthTrackerToken")
          router.push("/")
        })
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("healthTrackerToken")
    setIsLoggedIn(false)
    setUser(null)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="h-12 w-12 text-primary mb-4 animate-bounce" />
          <p className="text-lg text-muted-foreground">Loading your health dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Activity className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold">HealthTracker</h1>
          </div>
          <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button variant="outline" onClick={handleLogout} className="ml-auto">
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || "User"}</h2>
          <p className="text-muted-foreground">Monitor your health metrics and stay on top of your wellness journey</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              <span className="hidden md:inline">Water</span>
            </TabsTrigger>
            <TabsTrigger value="bp" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">BP</span>
            </TabsTrigger>
            <TabsTrigger value="heartbeat" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Heartbeat</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Doctors</span>
            </TabsTrigger>
            <TabsTrigger value="pills" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <span className="hidden md:inline">Pills</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-blue-100 dark:border-blue-900/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
                  <Droplets className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4/8 glasses</div>
                  <p className="text-xs text-muted-foreground">50% of daily goal</p>
                  <div className="mt-2 h-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-100 dark:border-red-900/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                  <Activity className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">120/80</div>
                  <p className="text-xs text-muted-foreground">Last measured: Today, 9:30 AM</p>
                  <div className="mt-2 text-xs inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Normal
                  </div>
                </CardContent>
              </Card>
              <Card className="border-pink-100 dark:border-pink-900/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                  <Heart className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72 BPM</div>
                  <p className="text-xs text-muted-foreground">Last measured: Today, 9:30 AM</p>
                  <div className="mt-2 text-xs inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Normal
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1 border-purple-100 dark:border-purple-900/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">Dr. Smith</p>
                      <p className="text-sm text-muted-foreground">General Checkup</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tomorrow</p>
                      <p className="text-sm text-muted-foreground">10:00 AM</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                  </Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1 border-amber-100 dark:border-amber-900/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-amber-500" />
                    Medication Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">Vitamin D</p>
                      <p className="text-sm text-muted-foreground">1 tablet</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Today</p>
                      <p className="text-sm text-muted-foreground">After breakfast</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                  </Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1 border-red-100 dark:border-red-900/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-red-500" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="font-medium">Dr. Johnson</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="font-medium">Local Hospital</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 987-6543</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" size="sm" className="w-full">
                    Emergency Alarm
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="water">
            <WaterTracker />
          </TabsContent>

          <TabsContent value="bp">
            <BPTracker />
          </TabsContent>

          <TabsContent value="heartbeat">
            <HeartbeatRecorder />
          </TabsContent>

          <TabsContent value="appointments">
            <Appointments />
          </TabsContent>

          <TabsContent value="doctors">
            <DoctorsList />
          </TabsContent>

          <TabsContent value="pills">
            <PillsReminder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
