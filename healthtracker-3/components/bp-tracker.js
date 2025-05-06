"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Activity, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function BPTracker() {
  const [readings, setReadings] = useState([])
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [pulse, setPulse] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedReadings = localStorage.getItem("bpReadings")
      if (savedReadings) {
        setReadings(JSON.parse(savedReadings))
      }
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("bpReadings", JSON.stringify(readings))
    }
  }, [readings, loading])

  const addReading = () => {
    // Validate inputs
    if (!systolic || !diastolic) {
      setError("Systolic and diastolic values are required")
      return
    }

    const systolicNum = Number.parseInt(systolic)
    const diastolicNum = Number.parseInt(diastolic)
    const pulseNum = pulse ? Number.parseInt(pulse) : null

    if (isNaN(systolicNum) || isNaN(diastolicNum) || (pulse && isNaN(pulseNum))) {
      setError("Please enter valid numbers")
      return
    }

    if (systolicNum < 70 || systolicNum > 250) {
      setError("Systolic value should be between 70 and 250")
      return
    }

    if (diastolicNum < 40 || diastolicNum > 150) {
      setError("Diastolic value should be between 40 and 150")
      return
    }

    if (pulseNum && (pulseNum < 40 || pulseNum > 200)) {
      setError("Pulse value should be between 40 and 200")
      return
    }

    // Clear error if validation passes
    setError("")

    // Add new reading
    const now = new Date()
    const newReading = {
      id: Date.now(),
      systolic: systolicNum,
      diastolic: diastolicNum,
      pulse: pulseNum,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now.getTime(),
    }

    setReadings([newReading, ...readings])

    // Clear form
    setSystolic("")
    setDiastolic("")
    setPulse("")
  }

  const deleteReading = (id) => {
    setReadings(readings.filter((reading) => reading.id !== id))
  }

  const getBPCategory = (systolic, diastolic) => {
    if (systolic >= 180 || diastolic >= 120) {
      return { category: "Hypertensive Crisis", color: "text-red-600", alert: true }
    } else if (systolic >= 140 || diastolic >= 90) {
      return { category: "High Blood Pressure (Stage 2)", color: "text-red-500" }
    } else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
      return { category: "High Blood Pressure (Stage 1)", color: "text-orange-500" }
    } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
      return { category: "Elevated", color: "text-yellow-500" }
    } else if (systolic < 120 && diastolic < 80) {
      return { category: "Normal", color: "text-green-500" }
    } else {
      return { category: "Unknown", color: "text-gray-500" }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-red-500" />
            Blood Pressure Tracker
          </CardTitle>
          <CardDescription>Monitor your blood pressure readings over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="systolic" className="text-sm font-medium">
                Systolic (mmHg)
              </label>
              <Input
                id="systolic"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="120"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="diastolic" className="text-sm font-medium">
                Diastolic (mmHg)
              </label>
              <Input
                id="diastolic"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="80"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pulse" className="text-sm font-medium">
                Pulse (BPM)
              </label>
              <Input
                id="pulse"
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="72"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addReading} className="w-full">
            Add Reading
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure History</CardTitle>
        </CardHeader>
        <CardContent>
          {readings.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No readings recorded yet</p>
          ) : (
            <div className="space-y-4">
              {readings.map((reading) => {
                const bpCategory = getBPCategory(reading.systolic, reading.diastolic)

                return (
                  <div key={reading.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xl font-bold">
                          {reading.systolic}/{reading.diastolic}
                          {reading.pulse && <span className="text-sm font-normal ml-2">({reading.pulse} BPM)</span>}
                        </div>
                        <div className={`text-sm font-medium ${bpCategory.color}`}>{bpCategory.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{reading.date}</div>
                        <div className="text-sm text-muted-foreground">{reading.time}</div>
                      </div>
                    </div>

                    {bpCategory.alert && (
                      <Alert className="mt-2 bg-red-50 text-red-800 border-red-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          This reading indicates a hypertensive crisis. Consult a doctor immediately if you experience
                          symptoms.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReading(reading.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
