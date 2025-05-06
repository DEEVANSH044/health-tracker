"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Phone, Bell, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EmergencyAlarm() {
  const [contacts, setContacts] = useState([])
  const [newContact, setNewContact] = useState({ name: "", phone: "" })
  const [alarmActive, setAlarmActive] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedContacts = localStorage.getItem("emergencyContacts")
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts))
      } else {
        // Default emergency contacts
        setContacts([
          { id: 1, name: "Emergency Services", phone: "911" },
          { id: 2, name: "Dr. Johnson", phone: "555-123-4567" },
        ])
      }
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("emergencyContacts", JSON.stringify(contacts))
    }
  }, [contacts, loading])

  // Handle countdown for emergency alarm
  useEffect(() => {
    let timer
    if (alarmActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (alarmActive && countdown === 0) {
      // Trigger emergency actions
      triggerEmergencyActions()
    }

    return () => clearTimeout(timer)
  }, [alarmActive, countdown])

  const triggerEmergencyActions = () => {
    // In a real app, this would send notifications, SMS, etc.
    console.log("Emergency triggered!")
    // Keep alarm sound playing
  }

  const startAlarm = () => {
    setAlarmActive(true)
    setCountdown(5)
    // Play alarm sound
    const audio = new Audio("/alarm-sound.mp3")
    audio.loop = true
    audio.play().catch((e) => console.error("Error playing alarm sound:", e))
    window.emergencyAudio = audio
  }

  const stopAlarm = () => {
    setAlarmActive(false)
    setCountdown(5)
    // Stop alarm sound
    if (window.emergencyAudio) {
      window.emergencyAudio.pause()
      window.emergencyAudio.currentTime = 0
    }
  }

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return

    setContacts([
      ...contacts,
      {
        id: Date.now(),
        name: newContact.name,
        phone: newContact.phone,
      },
    ])

    setNewContact({ name: "", phone: "" })
  }

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-red-500" />
            Emergency Alarm
          </CardTitle>
          <CardDescription>Quickly alert your emergency contacts in case of an emergency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alarmActive ? (
            <Alert variant="destructive" className="bg-red-500 text-white border-red-600">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-white">Emergency Alarm Active!</AlertTitle>
              <AlertDescription className="text-white">
                Emergency contacts will be notified in {countdown} seconds. Click "Cancel" to stop the alarm.
              </AlertDescription>
              <Button
                variant="outline"
                className="mt-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 border-white"
                onClick={stopAlarm}
              >
                Cancel
              </Button>
            </Alert>
          ) : (
            <Button variant="destructive" size="lg" className="w-full py-8 text-lg" onClick={startAlarm}>
              <AlertTriangle className="mr-2 h-6 w-6" />
              Activate Emergency Alarm
            </Button>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Emergency Contacts</h3>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.phone}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteContact(contact.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="col-span-1"
            />
            <Input
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="col-span-1"
            />
            <Button onClick={addContact} className="col-span-1">
              Add Contact
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>In case of emergency</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-4 space-y-2 mt-2">
                <li>Stay calm and assess the situation</li>
                <li>If immediate medical attention is needed, activate the emergency alarm</li>
                <li>The alarm will notify your emergency contacts</li>
                <li>If possible, call emergency services directly (911)</li>
                <li>Follow any medical instructions you've been given</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
