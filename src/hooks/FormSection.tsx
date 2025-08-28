// components/forms/FormSection.tsx
import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface FormSectionProps {
  title: string
  children: ReactNode
}

export const FormSection = ({ title, children }: FormSectionProps) => (
  <Card className="bg-white rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </Card>
)

// components/forms/FileUploadZone.tsx
import { Upload, X } from "lucide-react"

interface FileUploadZoneProps {
  id: string
  accept: string
  multiple?: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  description?: string
  selectedFile?: string | null
  children?: ReactNode
}

export const FileUploadZone = ({
  id,
  accept,
  multiple = false,
  onFileChange,
  label,
  description = "Browse and choose the files you want to upload from your computer",
  selectedFile,
  children
}: FileUploadZoneProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">{description}</p>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onFileChange}
        className="hidden"
        id={id}
      />
      <label htmlFor={id}>
        <Button type="button" variant="outline" className="mt-4 bg-transparent cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </label>
      {selectedFile && (
        <p className="text-sm text-green-600 mt-2">{selectedFile}</p>
      )}
      {children}
    </div>
  </div>
)

// components/forms/TimeSelector.tsx
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface TimeSelectorProps {
  hours: number
  minutes: number
  period: "AM" | "PM"
  onTimeChange: (time: { hours: number; minutes: number; period: "AM" | "PM" }) => void
  onAddTime: () => void
  selectedTimes: string[]
  onRemoveTime: (time: string) => void
}

export const TimeSelector = ({
  hours,
  minutes,
  period,
  onTimeChange,
  onAddTime,
  selectedTimes,
  onRemoveTime
}: TimeSelectorProps) => (
  <div className="space-y-6">
    <div className="flex space-x-2 items-center">
      <div className="flex-1">
        <Label>Hours</Label>
        <Select
          value={String(hours)}
          onValueChange={(value) => onTimeChange({ hours: Number(value), minutes, period })}
        >
          <SelectTrigger>
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent className="h-[200px]">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <SelectItem key={hour} value={String(hour)}>
                {String(hour).padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Label>Minutes</Label>
        <Select
          value={String(minutes)}
          onValueChange={(value) => onTimeChange({ hours, minutes: Number(value), period })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="h-[200px]">
            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
              <SelectItem key={minute} value={String(minute)}>
                {String(minute).padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Label>Period</Label>
        <Select
          value={period}
          onValueChange={(value: "AM" | "PM") => onTimeChange({ hours, minutes, period: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="button" onClick={onAddTime} className="self-end">
        <Plus className="h-4 w-4" />
      </Button>
    </div>

    <div className="space-y-4">
      {selectedTimes.map((time, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
          <span className="font-medium">{time}</span>
          <button
            type="button"
            onClick={() => onRemoveTime(time)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
)

// components/forms/AmenityManager.tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface AmenityManagerProps {
  amenities: string[]
  onAmenitiesChange: (amenities: string[]) => void
  predefinedAmenities: string[]
}

export const AmenityManager = ({ amenities, onAmenitiesChange, predefinedAmenities }: AmenityManagerProps) => {
  const [newAmenity, setNewAmenity] = useState("")

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      onAmenitiesChange([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    onAmenitiesChange(amenities.filter((a) => a !== amenity))
  }

  const addPredefinedAmenity = (amenity: string) => {
    if (!amenities.includes(amenity)) {
      onAmenitiesChange([...amenities, amenity])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Write Here"
          value={newAmenity}
          onChange={(e) => setNewAmenity(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
        />
        <Button type="button" onClick={addAmenity} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Amenities */}
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <Badge key={index} variant="secondary" className="flex items-center space-x-1 group">
            <span>{amenity}</span>
            <button
              type="button"
              onClick={() => removeAmenity(amenity)}
              className="ml-1 hover:bg-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Predefined Amenities */}
      <div className="flex flex-wrap gap-2">
        {predefinedAmenities.map((amenity) => (
          <button
            key={amenity}
            type="button"
            onClick={() => addPredefinedAmenity(amenity)}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={amenities.includes(amenity)}
          >
            {amenity}
          </button>
        ))}
      </div>
    </div>
  )
}

// components/forms/LoadingSpinner.tsx
export const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full mx-auto"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  </div>
)