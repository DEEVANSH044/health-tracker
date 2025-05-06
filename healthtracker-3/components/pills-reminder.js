"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pill, Clock, Calendar, Trash2, Plus, Check, X, Bell } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function PillsReminder() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "",
    startDate: new Date(),
    endDate: null,
    instructions: "",
    withFood: false,
    withWater: true,
  })

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedMedications = localStorage.getItem("medications")
      if (savedMedications) {
        setMedications(JSON.parse(savedMedications))
      } else {
        // Default medications
        setMedications([
          {
            id: 1,
            name: "Vitamin D",
            dosage: "1000 IU",
            frequency: "daily",
            time: "08:00",
            startDate: new Date().toISOString(),
            endDate: null,
            instructions: "Take with breakfast",
            withFood: true,
            withWater: true,
            taken: false,
          },
          {
            id: 2,
            name: "Ibuprofen",
            dosage: "200mg",
            frequency: "as needed",
            time: "",
            startDate: new Date().toISOString(),
            endDate: null,
            instructions: "Take for headache or pain",
            withFood: true,
            withWater: true,
            taken: false,
          },
        ])
      }
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("medications", JSON.stringify(medications))
    }
  }, [medications, loading])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    })
  }

  const addMedication = () => {
    if (!formData.name) {
      alert("Please enter medication name")
      return
    }

    const newMedication = {
      id: Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      time: formData.time,
      startDate: formData.startDate ? formData.startDate.toISOString() : new Date().toISOString(),
      endDate: formData.endDate ? formData.endDate.toISOString() : null,
      instructions: formData.instructions,
      withFood: formData.withFood,
      withWater: formData.withWater,
      taken: false,
    }

    setMedications([...medications, newMedication])

    // Reset form
    setFormData({
      name: "",
      dosage: "",
      frequency: "daily",
      time: "",
      startDate: new Date(),
      endDate: null,
      instructions: "",
      withFood: false,
      withWater: true,
    })
  }

  const deleteMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const toggleTaken = (id) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med)))
  }

  // Filter medications for today
  const todayMedications = medications.filter((med) => {
    // All medications that are daily or as needed
    if (med.frequency === "daily" || med.frequency === "as needed") {
      return true
    }

    // For other frequencies, we would need more complex logic
    return false
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5 text-primary" />
            Add New Medication
          </CardTitle>
          <CardDescription>Set up reminders for your medications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Medication Name *
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Vitamin D" />
            </div>
            <div className="space-y-2">
              <label htmlFor="dosage" className="text-sm font-medium">
                Dosage
              </label>
              <Input
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                placeholder="1 tablet, 500mg, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium">
                Frequency
              </label>
              <Select value={formData.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="twice-daily">Twice Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="as needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time
              </label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                disabled={formData.frequency === "as needed"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>No end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Instructions
            </label>
            <Textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Take with food, etc."
              rows={2}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="withFood"
                name="withFood"
                checked={formData.withFood}
                onCheckedChange={(checked) => handleSelectChange("withFood", checked)}
              />
              <Label htmlFor="withFood">Take with food</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="withWater"
                name="withWater"
                checked={formData.withWater}
                onCheckedChange={(checked) => handleSelectChange("withWater", checked)}
              />
              <Label htmlFor="withWater">Take with water</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addMedication} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Medications</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayMedications.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No medications scheduled for today</p>
          ) : (
            <div className="space-y-4">
              {todayMedications.map((med) => (
                <div key={med.id} className={`border rounded-lg p-4 ${med.taken ? "bg-muted" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="text-lg font-bold">{med.name}</div>
                        {med.taken && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            Taken
                          </Badge>
                        )}
                      </div>
                      {med.dosage && <div className="text-sm text-muted-foreground">{med.dosage}</div>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={med.taken ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleTaken(med.id)}
                        className={med.taken ? "border-green-200 text-green-700" : ""}
                      >
                        {med.taken ? <X className="mr-1 h-4 w-4" /> : <Check className="mr-1 h-4 w-4" />}
                        {med.taken ? "Undo" : "Take"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMedication(med.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    {med.frequency !== "as needed" && med.time && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {med.time}
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                      {med.frequency === "as needed" ? "Take as needed" : `Take ${med.frequency}`}
                    </div>
                  </div>

                  {med.instructions && (
                    <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                      {med.instructions}
                      {(med.withFood || med.withWater) && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {med.withFood && "Take with food. "}
                          {med.withWater && "Take with water."}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No medications added yet</p>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold">{med.name}</div>
                      {med.dosage && <div className="text-sm text-muted-foreground">{med.dosage}</div>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMedication(med.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm">
                      <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                      {med.frequency === "as needed" ? "Take as needed" : `Take ${med.frequency}`}
                      {med.frequency !== "as needed" && med.time && ` at ${med.time}`}
                    </div>
                    {med.startDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        Started: {new Date(med.startDate).toLocaleDateString()}
                        {med.endDate && ` - Ends: ${new Date(med.endDate).toLocaleDateString()}`}
                      </div>
                    )}
                  </div>

                  {med.instructions && <div className="mt-2 p-2 bg-muted rounded-md text-sm">{med.instructions}</div>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
