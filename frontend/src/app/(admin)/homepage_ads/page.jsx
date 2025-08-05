"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Upload, Eye, Save, X } from 'lucide-react'
import Image from 'next/image'
import SliderManagement from './components/SliderManagement'
import EventManagement from './components/EventManagement'


const HomepageAdsAdmin = () => {
  // State for different sections
  const [heroSlides, setHeroSlides] = useState([
    { id: 1, image: '/1.jpg', title: 'Welcome to Bestwise', description: 'Your one-stop shop for gifts' },
    { id: 2, image: '/2.jpg', title: 'Special Offers', description: 'Amazing deals on all products' },
    { id: 3, image: '/3.jpg', title: 'New Arrivals', description: 'Check out our latest collection' }
  ])
  
  const [events, setEvents] = useState([
    { id: 1, key: 'birthday', name: 'Birthday Party', image: '/birthday.jpg', description: 'Celebrate special birthdays' },
    { id: 2, key: 'anniversary', name: 'Anniversary Celebration', image: '/anniversary.jpg', description: 'Romantic anniversary gifts' },
    { id: 3, key: 'holiday', name: 'Holiday Gift Guide', image: '/holiday.jpg', description: 'Perfect holiday presents' },
    { id: 4, key: 'new-year', name: 'New Year\'s Eve', image: '/newyear.jpg', description: 'Ring in the new year' }
  ])
  
  const [services, setServices] = useState([
    { id: 1, icon: '✏️', title: 'Customizable Gift', description: 'Design gifts your way — choose packaging, add notes, select colors or themes.' },
    { id: 2, icon: '⏰', title: 'Reminder Gift Notify', description: 'Never miss special moments. Set reminders for birthdays, anniversaries, and holidays.' },
    { id: 3, icon: '👨‍👩‍👦', title: 'Collaborative Gift', description: 'Team up with friends and family to create the perfect group gift.' },
    { id: 4, icon: '🎁', title: 'Gift Wrapping', description: 'Professional gift wrapping service for all occasions.' }
  ])
  
  const [trendingServices, setTrendingServices] = useState({
    id: 1,
    title: 'Trending Services',
    description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
    images: ['/decoration1.jpg', '/decoration2.jpg', '/decoration3.jpg', '/decoration4.jpg'],
    features: ['All Decoration Items', 'Party Table', 'Other Elegant Items']
  })
  
  const [aboutUs, setAboutUs] = useState({
    id: 1,
    title: 'About Us',
    description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
    image: '/map.jpg',
    stats: [
      { label: 'Active users', value: '2500+' },
      { label: 'Products', value: '10000+' }
    ]
  })

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (currentSection === 'hero') {
      if (editingItem) {
        setHeroSlides(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        ))
        toast.success('Hero slide updated successfully!')
      } else {
        const newSlide = { id: Date.now(), ...formData }
        setHeroSlides(prev => [...prev, newSlide])
        toast.success('Hero slide added successfully!')
      }
    } else if (currentSection === 'events') {
      if (editingItem) {
        setEvents(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        ))
        toast.success('Event updated successfully!')
      } else {
        const newEvent = { id: Date.now(), ...formData }
        setEvents(prev => [...prev, newEvent])
        toast.success('Event added successfully!')
      }
    } else if (currentSection === 'services') {
      if (editingItem) {
        setServices(prev => prev.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        ))
        toast.success('Service updated successfully!')
      } else {
        const newService = { id: Date.now(), ...formData }
        setServices(prev => [...prev, newService])
        toast.success('Service added successfully!')
      }
    }
    
    closeModal()
  }

  // Handle delete
  const handleDelete = (section, id) => {
    if (section === 'hero') {
      setHeroSlides(prev => prev.filter(item => item.id !== id))
      toast.success('Hero slide deleted successfully!')
    } else if (section === 'events') {
      setEvents(prev => prev.filter(item => item.id !== id))
      toast.success('Event deleted successfully!')
    } else if (section === 'services') {
      setServices(prev => prev.filter(item => item.id !== id))
      toast.success('Service deleted successfully!')
    }
  }

  // Open modal for editing/adding
  const openModal = (section, item = null) => {
    setCurrentSection(section)
    setEditingItem(item)
    setFormData(item || {})
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentSection('')
    setEditingItem(null)
    setFormData({})
  }

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Ads Management</h1>
        <Badge variant="outline" className="text-sm">
          Admin Panel
        </Badge>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Slider</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
        </TabsList>

        {/* Hero Slider Tab */}
        <TabsContent value="hero" className="space-y-4">
  <SliderManagement />
</TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <EventManagement events={events} setEvents={setEvents} />
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Services Management</h2>
            <Button onClick={() => openModal('services')} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal('services', service)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete('services', service.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trending Services Tab */}
        <TabsContent value="trending" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending Services</h2>
            <Button onClick={() => openModal('trending', trendingServices)} className="bg-purple-600 hover:bg-purple-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Section
            </Button>
          </div>
          
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-purple-600 text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">💖</div>
                {trendingServices.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    {trendingServices.images.map((image, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image src={image} alt={`Decoration ${index + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">{trendingServices.description}</p>
                  <div className="space-y-2">
                    {trendingServices.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="w-2 bg-purple-600 rounded-full h-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Us Tab */}
        <TabsContent value="about" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">About Us Section</h2>
            <Button onClick={() => openModal('about', aboutUs)} className="bg-purple-600 hover:bg-purple-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Section
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image src={aboutUs.image} alt="Our location" fill className="object-cover" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">{aboutUs.title}</h3>
                  <p className="text-gray-600">{aboutUs.description}</p>
                  <div className="grid grid-cols-2 gap-8">
                    {aboutUs.stats.map((stat, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 bg-purple-600 rounded-full"></div>
                        <div>
                          <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
                          <div className="text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal for Add/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {currentSection === 'hero' ? 'Hero Slide' : 
               currentSection === 'events' ? 'Event' : 
               currentSection === 'services' ? 'Service' : 
               currentSection === 'trending' ? 'Trending Services' : 'About Us'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentSection === 'hero' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter slide title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter slide description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Enter image URL"
                    required
                  />
                </div>
              </>
            )}
            
            {currentSection === 'events' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter event name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key">Event Key</Label>
                  <Input
                    id="key"
                    value={formData.key || ''}
                    onChange={(e) => handleInputChange('key', e.target.value)}
                    placeholder="Enter event key (e.g., birthday)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter event description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Enter image URL"
                    required
                  />
                </div>
              </>
            )}
            
            {currentSection === 'services' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter service title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon || ''}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    placeholder="Enter emoji icon"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter service description"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Update' : 'Add'}
              </Button>
              <Button type="button" variant="outline" onClick={closeModal}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HomepageAdsAdmin