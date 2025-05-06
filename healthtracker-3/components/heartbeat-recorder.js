"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function HeartbeatRecorder() {
  const [readings, setReadings] = useState([])
  const [currentReading, setCurrentReading] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [averageRate, setAverageRate] = useState(0)

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedReadings = localStorage.getItem("heartbeatReadings")
      if (savedReadings) {
        const parsedReadings = JSON.parse(savedReadings)
        setReadings(parsedReadings)

        // Calculate average
        if (parsedReadings.length > 0) {
          const sum = parsedReadings.reduce((acc, reading) => acc + reading.value, 0)
          setAverageRate(Math.round(sum / parsedReadings.length))
        }
      }
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("heartbeatReadings", JSON.stringify(readings))

      // Update average when readings change
      if (readings.length > 0) {
        const sum = readings.reduce((acc, reading) => acc + reading.value, 0)
        setAverageRate(Math.round(sum / readings.length))
      } else {
        setAverageRate(0)
      }
    }
  }, [readings, loading])

  const addReading = () => {
    if (!currentReading) return

    const value = Number.parseInt(currentReading)
    if (isNaN(value) || value < 30 || value > 220) {
      alert("Please enter a valid heart rate between 30 and 220 BPM")
      return
    }

    const now = new Date()
    const newReading = {
      id: Date.now(),
      value: value,
      notes: notes,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now.getTime(),
    }

    setReadings([newReading, ...readings])
    setCurrentReading("")
    setNotes("")
  }

  const deleteReading = (id) => {
    setReadings(readings.filter((reading) => reading.id !== id))
  }

  const getHeartRateCategory = (rate) => {
    if (rate < 60) return { label: "Bradycardia", color: "text-blue-500" }
    if (rate <= 100) return { label: "Normal", color: "text-green-500" }
    if (rate <= 120) return { label: "Elevated", color: "text-yellow-500" }
    return { label: "Tachycardia", color: "text-red-500" }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Heart Rate Recorder
            </CardTitle>
            <CardDescription>Track your heart rate measurements over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="Enter heart rate"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="e.g., After exercise, Resting, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addReading} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Reading
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center h-40">
              {averageRate > 0 ? (
                <>
                  <div className="text-5xl font-bold text-red-500 flex items-center">
                    {averageRate}
                    <span className="text-base ml-1">BPM</span>
                  </div>
                  <div className="text-sm mt-2">Average Heart Rate</div>
                  <div className={`text-sm font-medium mt-1 ${getHeartRateCategory(averageRate).color}`}>
                    {getHeartRateCategory(averageRate).label}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">No readings recorded yet</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resting heart rate (adult):</span>
                <span className="font-medium">60-100 BPM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Athlete resting heart rate:</span>
                <span className="font-medium">40-60 BPM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tachycardia threshold:</span>
                <span className="font-medium">&gt;100 BPM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bradycardia threshold:</span>
                <span className="font-medium">&lt;60 BPM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heart Rate History</CardTitle>
        </CardHeader>
        <CardContent>
          {readings.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No readings recorded yet</p>
          ) : (
            <div className="space-y-4">
              {readings.map((reading) => {
                const category = getHeartRateCategory(reading.value)

                return (
                  <div key={reading.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xl font-bold flex items-center">
                          {reading.value} <span className="text-sm font-normal ml-1">BPM</span>
                          <span className={`text-sm font-medium ml-2 ${category.color}`}>({category.label})</span>
                        </div>
                        {reading.notes && <div className="text-sm text-muted-foreground mt-1">{reading.notes}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{reading.date}</div>
                        <div className="text-sm text-muted-foreground">{reading.time}</div>
                      </div>
                    </div>

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
