"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, MapPin, Trash2, Plus, CalendarIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(null)
  const [formData, setFormData] = useState({
    doctorName: "",
    purpose: "",
    location: "",
    time: "",
    notes: "",
  })

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedAppointments = localStorage.getItem("appointments")
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments))
      }
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("appointments", JSON.stringify(appointments))
    }
  }, [appointments, loading])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const addAppointment = () => {
    if (!formData.doctorName || !date || !formData.time) {
      alert("Please fill in doctor name, date, and time")
      return
    }

    const newAppointment = {
      id: Date.now(),
      doctorName: formData.doctorName,
      purpose: formData.purpose,
      date: date ? format(date, "PPP") : "",
      time: formData.time,
      location: formData.location,
      notes: formData.notes,
      timestamp: date
        ? new Date(date).setHours(
            Number.parseInt(formData.time.split(":")[0]),
            Number.parseInt(formData.time.split(":")[1]),
          )
        : Date.now(),
    }

    setAppointments([...appointments, newAppointment].sort((a, b) => a.timestamp - b.timestamp))

    // Reset form
    setFormData({
      doctorName: "",
      purpose: "",
      location: "",
      time: "",
      notes: "",
    })
    setDate(null)
  }

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id))
  }

  const isUpcoming = (timestamp) => {
    return timestamp > Date.now()
  }

  // Group appointments by upcoming and past
  const upcomingAppointments = appointments.filter((app) => isUpcoming(app.timestamp))
  const pastAppointments = appointments.filter((app) => !isUpcoming(app.timestamp))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Add New Appointment
          </CardTitle>
          <CardDescription>Schedule and manage your doctor appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="doctorName" className="text-sm font-medium">
                Doctor Name *
              </label>
              <Input
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                placeholder="Dr. Smith"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="purpose" className="text-sm font-medium">
                Purpose
              </label>
              <Input
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Annual checkup"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time *
              </label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="123 Medical Center Dr."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special instructions or things to remember..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addAppointment} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold">{appointment.doctorName}</div>
                      {appointment.purpose && (
                        <div className="text-sm text-muted-foreground">{appointment.purpose}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAppointment(appointment.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {appointment.time}
                    </div>
                    {appointment.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {appointment.location}
                      </div>
                    )}
                  </div>

                  {appointment.notes && <div className="mt-2 p-2 bg-muted rounded-md text-sm">{appointment.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 opacity-70">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold">{appointment.doctorName}</div>
                      {appointment.purpose && (
                        <div className="text-sm text-muted-foreground">{appointment.purpose}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAppointment(appointment.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {appointment.time}
                    </div>
                    {appointment.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {appointment.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
