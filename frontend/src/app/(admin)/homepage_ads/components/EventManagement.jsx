"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Calendar, Upload } from "lucide-react"
import Image from "next/image"

export default function EventManagement() {
  const [events, setEvents] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch events from backend
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomingevent/all`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleEventStatus = async (id) => {
    try {
      const event = events.find(e => e._id === id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomingevent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, isActive: !event.isActive }),
      })
      if (response.ok) {
        fetchEvents() // Refresh the events list
      }
    } catch (error) {
      console.error('Error updating event status:', error)
    }
  }

  const toggleFeatured = async (id) => {
    try {
      const event = events.find(e => e._id === id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomingevent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, featured: !event.featured }),
      })
      if (response.ok) {
        fetchEvents() // Refresh the events list
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomingevent/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchEvents() // Refresh the events list
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const EventForm = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      event || {
        name: "",
        description: "",
        date: "",
        image: "",
        isActive: true,
        category: "Sale",
        featured: false,
      },
    )
    const [uploading, setUploading] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      try {
        const url = event 
          ? `${process.env.NEXT_PUBLIC_API_URL}/upcomingevent/${event._id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/upcomingevent`
        
        const method = event ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const savedEvent = await response.json()
          onSave(savedEvent)
          fetchEvents() // Refresh the events list
        } else {
          console.error('Error saving event')
        }
      } catch (error) {
        console.error('Error saving event:', error)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Event Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Event Image</Label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0]
              if (!file) return
              setUploading(true)
              const formDataUpload = new FormData()
              formDataUpload.append('file', file)
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/single`, {
                  method: 'POST',
                  body: formDataUpload,
                })
                if (res.ok) {
                  const data = await res.json()
                  setFormData(prev => ({ ...prev, image: data.data.url }))
                } else {
                  alert('Image upload failed')
                }
              } catch (err) {
                alert('Image upload error')
              } finally {
                setUploading(false)
              }
            }}
            className="block w-full border rounded p-2"
          />
          {uploading && <div className="text-sm text-gray-500 mt-2">Uploading...</div>}
          {formData.image && (
            <div className="mt-2">
              <Image src={formData.image} alt="Preview" width={120} height={80} className="rounded" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={uploading}>
            {event ? "Update" : "Add"} Event
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Management
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <EventForm
                  onSave={(event) => {
                    setEvents([...events, event])
                    setIsAddDialogOpen(false)
                  }}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="text-lg">Loading events...</div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {event.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <Badge variant="outline">{event.category}</Badge>
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      <p className="text-sm font-medium text-purple-600">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={event.isActive} onCheckedChange={() => toggleEventStatus(event._id)} />
                          <span className="text-sm">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={event.featured} onCheckedChange={() => toggleFeatured(event._id)} />
                          <span className="text-sm">Featured</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                          </DialogHeader>
                          <EventForm
                            event={event}
                            onSave={(updatedEvent) => {
                              setEvents(events.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)))
                            }}
                            onCancel={() => {}}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => deleteEvent(event._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
