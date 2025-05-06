"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Phone, Mail, MapPin, Trash2, Plus, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const savedDoctors = localStorage.getItem("doctors")
      if (savedDoctors) {
        setDoctors(JSON.parse(savedDoctors))
      } else {
        // Default doctors
        setDoctors([
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Primary Care Physician",
            phone: "555-123-4567",
            email: "sjohnson@example.com",
            address: "123 Medical Center Dr, Suite 101",
            notes: "Annual checkup in October",
          },
          {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Cardiologist",
            phone: "555-987-6543",
            email: "mchen@example.com",
            address: "456 Specialist Ave, Suite 202",
            notes: "",
          },
        ])
      }
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("doctors", JSON.stringify(doctors))
    }
  }, [doctors, loading])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const addDoctor = () => {
    if (!formData.name || !formData.specialty) {
      alert("Please fill in doctor name and specialty")
      return
    }

    const newDoctor = {
      id: Date.now(),
      name: formData.name,
      specialty: formData.specialty,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      notes: formData.notes,
    }

    setDoctors([...doctors, newDoctor])

    // Reset form
    setFormData({
      name: "",
      specialty: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    })
  }

  const deleteDoctor = (id) => {
    setDoctors(doctors.filter((doctor) => doctor.id !== id))
  }

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            Add New Doctor
          </CardTitle>
          <CardDescription>Keep track of your healthcare providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Doctor Name *
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Dr. Smith" />
            </div>
            <div className="space-y-2">
              <label htmlFor="specialty" className="text-sm font-medium">
                Specialty *
              </label>
              <Input
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                placeholder="Cardiologist"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="555-123-4567"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="doctor@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
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
              placeholder="Any special notes about this doctor..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addDoctor} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Doctors</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              {searchTerm ? "No doctors match your search" : "No doctors added yet"}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDoctor(doctor.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {doctor.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doctor.phone}
                      </div>
                    )}
                    {doctor.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doctor.email}
                      </div>
                    )}
                    {doctor.address && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doctor.address}
                      </div>
                    )}
                  </div>

                  {doctor.notes && <div className="mt-2 p-2 bg-muted rounded-md text-sm">{doctor.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
