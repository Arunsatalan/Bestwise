"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function SliderManagement() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    isActive: true
  })
  const [imagePreview, setImagePreview] = useState('')

  const fileInputRef = useRef(null)

  // Helper function to construct proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.svg'
    if (imagePath.startsWith('http')) return imagePath
    // Handle relative paths from backend - use direct backend URL for static files
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
    return `${backendUrl}/${imagePath.replace(/\\/g, '/')}`
  }

  // Fetch slides from MongoDB on component mount
  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/herosection/admin')
      if (!response.ok) throw new Error('Failed to fetch slides')
      
      const data = await response.json()
      console.log('Fetched slides data:', data.data)
      setSlides(data.data || [])
    } catch (error) {
      console.error('Error fetching slides:', error)
      toast.error('Failed to load slides')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.image && !editingSlide) {
      toast.error('Please upload an image')
      return
    }

    try {
      setSubmitting(true)
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('isActive', formData.isActive.toString())
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      let response
      if (editingSlide) {
        // Update existing slide
        console.log('Updating slide with ID:', editingSlide._id)
        response = await fetch(`/api/herosection/${editingSlide._id}`, {
          method: 'PUT',
          body: submitData
        })
      } else {
        // Create new slide
        response = await fetch('/api/herosection/admin/create', {
          method: 'POST',
          body: submitData
        })
      }

      if (!response.ok) throw new Error('Failed to save slide')

      const result = await response.json()
      toast.success(editingSlide ? 'Slide updated successfully' : 'Slide created successfully')
      
      // Refresh slides list
      await fetchSlides()
      
      // Reset form
      setIsDialogOpen(false)
      setEditingSlide(null)
      setFormData({ title: '', description: '', image: null, isActive: true })
      setImagePreview('')
      
    } catch (error) {
      console.error('Error saving slide:', error)
      toast.error('Failed to save slide')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (slide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      description: slide.description,
      image: null, // Don't set the file, just show preview
      isActive: slide.isActive
    })
    setImagePreview(getImageUrl(slide.image)) // Show existing image as preview
    setIsDialogOpen(true)
  }

  const handleDelete = async (slideId) => {
    if (!confirm('Are you sure you want to delete this slide?')) return

    try {
      const response = await fetch(`/api/herosection/admin/${slideId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete slide')

      toast.success('Slide deleted successfully')
      await fetchSlides() // Refresh the list
    } catch (error) {
      console.error('Error deleting slide:', error)
      toast.error('Failed to delete slide')
    }
  }

  const toggleStatus = async (slideId) => {
    try {
      const response = await fetch(`/api/herosection/${slideId}/toggle`, {
        method: 'PATCH'
      })

      if (!response.ok) throw new Error('Failed to toggle slide status')

      toast.success('Slide status updated successfully')
      await fetchSlides() // Refresh the list
    } catch (error) {
      console.error('Error toggling slide status:', error)
      toast.error('Failed to update slide status')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Set file and create preview
    setFormData(prev => ({ ...prev, image: file }))
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setImagePreview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', image: null, isActive: true })
    setImagePreview('')
    setEditingSlide(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading slides...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Slider Management</h2>
          <p className="text-gray-600">Manage your homepage hero slider</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Slide Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter slide title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Slide Image</Label>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </Button>
                  
                  {imagePreview && (
                    <div className="relative">
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={submitting || (!formData.image && !editingSlide)}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingSlide ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingSlide ? 'Update' : 'Add'} Slide</>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {slides.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <ImageIcon className="w-16 h-16 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No slides yet</h3>
              <p className="text-gray-600">Create your first hero slide to get started</p>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Slide
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <Card key={slide._id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={getImageUrl(slide.image)}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">{slide.title}</h3>
                  <Badge variant={slide.isActive ? "default" : "secondary"}>
                    {slide.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{slide.description}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={slide.isActive ? "secondary" : "default"}
                    onClick={() => toggleStatus(slide._id)}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    {slide.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(slide._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}