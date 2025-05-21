"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent,  CardFooter } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SlotSettingsFormProps {
  onSubmit: (data: any) => void
  initialData: {
    title: string
    duration: number
    buffer: number
    location: string
  }
}

export function SlotSettingsForm({ onSubmit, initialData }: SlotSettingsFormProps) {
  const [formData, setFormData] = React.useState(initialData)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      
      <CardContent>
        <div className="bg-gray-900 p-6 rounded-lg space-y-6">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-200">
              Duration
            </Label>
            <Select
              value={formData.duration.toString()}
              onValueChange={(value) => handleChange("duration", Number.parseInt(value))}
            >
              <SelectTrigger id="duration" className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buffer" className="text-gray-200">
              Buffer Time
            </Label>
            <Select
              value={formData.buffer.toString()}
              onValueChange={(value) => handleChange("buffer", Number.parseInt(value))}
            >
              <SelectTrigger id="buffer" className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select buffer time" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="0">No buffer</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label className="text-gray-200">Location</Label>
            <RadioGroup
              value={formData.location}
              onValueChange={(value) => handleChange("location", value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 bg-gray-800">
                <RadioGroupItem id="online" value="online" className="data-[state=checked]:bg-white" />
                <Label htmlFor="online" className="flex-1 cursor-pointer">
                  Online Meeting
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 bg-gray-800">
                <RadioGroupItem id="in-person" value="in-person" className="data-[state=checked]:bg-white" />
                <Label htmlFor="in-person" className="flex-1 cursor-pointer">
                  In Person
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 bg-gray-800">
                <RadioGroupItem id="phone" value="phone" className="data-[state=checked]:bg-white" />
                <Label htmlFor="phone" className="flex-1 cursor-pointer">
                  Phone Call
                </Label>
              </div>
            </RadioGroup>
          </div> */}
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-gray-200 text-black hover:bg-white">
          Next Step
        </Button>
      </CardFooter>
    </form>
  )
}
