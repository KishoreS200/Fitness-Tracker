"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, ArrowRight, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export default function OnboardingPage() {
  const { user, updateUser, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: "",
    gender: "",
    height: 170, // cm
    weight: 70, // kg
    activityLevel: "moderate",
    fitnessGoal: "general",
    dietPreference: "balanced",
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    try {
      await updateUser({
        name: formData.name,
        profile: {
          age: Number.parseInt(formData.age as string),
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          activityLevel: formData.activityLevel,
          fitnessGoal: formData.fitnessGoal,
          dietPreference: formData.dietPreference,
        },
      } as any)

      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const calculateBMI = () => {
    const heightInMeters = formData.height / 100
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const calculateCalories = () => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr = 0
    if (formData.gender === "male") {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * Number.parseInt(formData.age as string) + 5
    } else {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * Number.parseInt(formData.age as string) - 161
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const multiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers] || 1.55
    return Math.round(bmr * multiplier)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Dumbbell className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your fitness journey</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="height">Height (cm)</Label>
                  <span className="text-sm text-gray-500">{formData.height} cm</span>
                </div>
                <Slider
                  id="height"
                  min={120}
                  max={220}
                  step={1}
                  value={[formData.height]}
                  onValueChange={(value) => handleChange("height", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <span className="text-sm text-gray-500">{formData.weight} kg</span>
                </div>
                <Slider
                  id="weight"
                  min={40}
                  max={150}
                  step={1}
                  value={[formData.weight]}
                  onValueChange={(value) => handleChange("weight", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value) => handleChange("activityLevel", value)}>
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (hard exercise daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select value={formData.fitnessGoal} onValueChange={(value) => handleChange("fitnessGoal", value)}>
                  <SelectTrigger id="fitnessGoal">
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weightLoss">Weight Loss</SelectItem>
                    <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                    <SelectItem value="general">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietPreference">Diet Preference</Label>
                <Select
                  value={formData.dietPreference}
                  onValueChange={(value) => handleChange("dietPreference", value)}
                >
                  <SelectTrigger id="dietPreference">
                    <SelectValue placeholder="Select diet preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="highProtein">High Protein</SelectItem>
                    <SelectItem value="lowCarb">Low Carb</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Your Fitness Summary</h3>
                <p className="text-sm text-gray-500">Based on the information you provided</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-gray-500 mb-1">BMI</p>
                    <p className="text-3xl font-bold">{calculateBMI()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-gray-500 mb-1">Daily Calories</p>
                    <p className="text-3xl font-bold">{calculateCalories()}</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="diet">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="diet">Diet Recommendations</TabsTrigger>
                  <TabsTrigger value="workout">Workout Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="diet" className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recommended Diet</h4>
                    <p className="text-sm text-gray-600">
                      Based on your {formData.dietPreference} preference and {formData.fitnessGoal} goal, we recommend a
                      daily intake of approximately {calculateCalories()} calories.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="workout" className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recommended Workout Plan</h4>
                    <p className="text-sm text-gray-600">
                      For your {formData.fitnessGoal} goal with {formData.activityLevel} activity level, we recommend
                      starting with our{" "}
                      {formData.fitnessGoal === "weightLoss"
                        ? "Fat Burn"
                        : formData.fitnessGoal === "muscleGain"
                          ? "Strength Builder"
                          : "General Fitness"}{" "}
                      program.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
