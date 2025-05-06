"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Minus } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0)
  const [goal, setGoal] = useState(8)
  const [waterHistory, setWaterHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedIntake = localStorage.getItem("waterIntake")
      const savedGoal = localStorage.getItem("waterGoal")
      const savedHistory = localStorage.getItem("waterHistory")

      if (savedIntake) setWaterIntake(Number.parseInt(savedIntake))
      if (savedGoal) setGoal(Number.parseInt(savedGoal))
      if (savedHistory) setWaterHistory(JSON.parse(savedHistory))

      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("waterIntake", waterIntake)
      localStorage.setItem("waterGoal", goal)
      localStorage.setItem("waterHistory", JSON.stringify(waterHistory))
    }
  }, [waterIntake, goal, waterHistory, loading])

  const addWater = (amount) => {
    const newIntake = Math.min(waterIntake + amount, 20)
    setWaterIntake(newIntake)

    // Add to history
    const now = new Date()
    setWaterHistory([
      ...waterHistory,
      {
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        amount: amount,
      },
    ])
  }

  const resetWater = () => {
    setWaterIntake(0)
    setWaterHistory([])
  }

  const percentage = Math.round((waterIntake / goal) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-blue-500" />
            Water Intake Tracker
          </CardTitle>
          <CardDescription>Track your daily water consumption to stay hydrated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-blue-500">
              {waterIntake} <span className="text-xl text-muted-foreground">/ {goal} glasses</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-sm text-muted-foreground">{percentage}% of daily goal</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Daily Goal (glasses)</span>
              <span className="text-sm font-medium">{goal}</span>
            </div>
            <Slider value={[goal]} min={1} max={15} step={1} onValueChange={(value) => setGoal(value[0])} />
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => addWater(0.5)} className="h-12 w-12 rounded-full">
              <span className="text-xs">+0.5</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => addWater(1)} className="h-16 w-16 rounded-full">
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
              className="h-16 w-16 rounded-full"
              disabled={waterIntake === 0}
            >
              <Minus className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetWater}>
            Reset
          </Button>
          <Button onClick={() => addWater(1)}>Add Glass</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Water Log</CardTitle>
        </CardHeader>
        <CardContent>
          {waterHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No water intake recorded today</p>
          ) : (
            <div className="space-y-2">
              {waterHistory
                .slice()
                .reverse()
                .map((entry, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                      <span>
                        {entry.amount} glass{entry.amount !== 1 ? "es" : ""}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{entry.time}</span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
