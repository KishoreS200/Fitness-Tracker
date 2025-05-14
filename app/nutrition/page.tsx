"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Apple, Beef, Carrot, Fish, Egg, Utensils, Plus, Minus, Save } from "lucide-react"

export default function NutritionPage() {
  const { user } = useAuth()
  const [mealPlan, setMealPlan] = useState<string>("balanced")
  const [calorieGoal, setCalorieGoal] = useState<number>(2000)
  const [waterGoal, setWaterGoal] = useState<number>(8)
  const [waterIntake, setWaterIntake] = useState<number>(0)
  const [meals, setMeals] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would fetch from the backend
    if (user?.profile) {
      // Calculate calories based on user profile
      calculateCalories()
    }

    // Load sample meal plans
    loadMealPlan()
  }, [user, mealPlan])

  const calculateCalories = () => {
    // This would use the user's profile data to calculate their calorie needs
    // For now, we'll use a simplified calculation
    const profile = user?.profile as any
    if (!profile) return

    let bmr = 0
    if (profile.gender === "male") {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
    }

    // Activity multiplier
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const multiplier = activityMultipliers[profile.activityLevel] || 1.55

    // Goal adjustment
    let goalAdjustment = 0
    if (profile.fitnessGoal === "weightLoss") {
      goalAdjustment = -500 // Calorie deficit
    } else if (profile.fitnessGoal === "muscleGain") {
      goalAdjustment = 300 // Calorie surplus
    }

    const calculatedCalories = Math.round(bmr * multiplier) + goalAdjustment
    setCalorieGoal(calculatedCalories)
  }

  const loadMealPlan = () => {
    // In a real app, this would fetch meal plans from an API
    const sampleMeals = {
      balanced: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          calories: 400,
          foods: [
            { name: "Oatmeal with berries", portion: "1 cup", calories: 250 },
            { name: "Greek yogurt", portion: "1/2 cup", calories: 100 },
            { name: "Almonds", portion: "10", calories: 50 },
          ],
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          calories: 600,
          foods: [
            { name: "Grilled chicken sandwich", portion: "1", calories: 350 },
            { name: "Mixed green salad", portion: "2 cups", calories: 100 },
            { name: "Olive oil dressing", portion: "1 tbsp", calories: 120 },
            { name: "Apple", portion: "1 medium", calories: 80 },
          ],
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          calories: 700,
          foods: [
            { name: "Salmon fillet", portion: "5 oz", calories: 300 },
            { name: "Brown rice", portion: "1 cup", calories: 200 },
            { name: "Steamed broccoli", portion: "1 cup", calories: 50 },
            { name: "Olive oil", portion: "1 tbsp", calories: 120 },
          ],
        },
        {
          name: "Snack",
          time: "3:30 PM",
          calories: 200,
          foods: [
            { name: "Protein shake", portion: "1 scoop", calories: 120 },
            { name: "Banana", portion: "1 medium", calories: 80 },
          ],
        },
      ],
      highProtein: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          calories: 450,
          foods: [
            { name: "Egg whites", portion: "4", calories: 100 },
            { name: "Whole egg", portion: "1", calories: 70 },
            { name: "Turkey bacon", portion: "2 slices", calories: 70 },
            { name: "Whole grain toast", portion: "1 slice", calories: 80 },
            { name: "Avocado", portion: "1/4", calories: 80 },
          ],
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          calories: 650,
          foods: [
            { name: "Grilled chicken breast", portion: "6 oz", calories: 280 },
            { name: "Quinoa", portion: "1/2 cup", calories: 120 },
            { name: "Mixed vegetables", portion: "1 cup", calories: 80 },
            { name: "Hummus", portion: "2 tbsp", calories: 70 },
            { name: "Olive oil", portion: "1 tsp", calories: 40 },
          ],
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          calories: 700,
          foods: [
            { name: "Lean beef steak", portion: "5 oz", calories: 300 },
            { name: "Sweet potato", portion: "1 medium", calories: 100 },
            { name: "Asparagus", portion: "1 cup", calories: 40 },
            { name: "Greek yogurt", portion: "1/2 cup", calories: 100 },
            { name: "Mixed berries", portion: "1/2 cup", calories: 40 },
          ],
        },
        {
          name: "Snack",
          time: "3:30 PM",
          calories: 300,
          foods: [
            { name: "Protein shake", portion: "1 scoop", calories: 120 },
            { name: "Peanut butter", portion: "1 tbsp", calories: 100 },
            { name: "Apple", portion: "1 medium", calories: 80 },
          ],
        },
      ],
      lowCarb: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          calories: 450,
          foods: [
            { name: "Scrambled eggs", portion: "3", calories: 210 },
            { name: "Avocado", portion: "1/2", calories: 160 },
            { name: "Cherry tomatoes", portion: "1/2 cup", calories: 30 },
            { name: "Spinach", portion: "1 cup", calories: 10 },
          ],
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          calories: 550,
          foods: [
            { name: "Grilled chicken salad", portion: "1 bowl", calories: 300 },
            { name: "Olive oil & vinegar", portion: "2 tbsp", calories: 120 },
            { name: "Almonds", portion: "1 oz", calories: 130 },
          ],
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          calories: 650,
          foods: [
            { name: "Baked salmon", portion: "6 oz", calories: 350 },
            { name: "Cauliflower rice", portion: "1 cup", calories: 50 },
            { name: "Broccoli", portion: "1 cup", calories: 50 },
            { name: "Butter", portion: "1 tbsp", calories: 100 },
            { name: "Lemon juice", portion: "1 tbsp", calories: 5 },
          ],
        },
        {
          name: "Snack",
          time: "3:30 PM",
          calories: 200,
          foods: [
            { name: "String cheese", portion: "2 sticks", calories: 160 },
            { name: "Cucumber slices", portion: "1 cup", calories: 40 },
          ],
        },
      ],
    }

    setMeals(sampleMeals[mealPlan as keyof typeof sampleMeals] || sampleMeals.balanced)
  }

  const handleWaterIncrement = () => {
    setWaterIntake((prev) => Math.min(prev + 1, 20))
  }

  const handleWaterDecrement = () => {
    setWaterIntake((prev) => Math.max(prev - 1, 0))
  }

  const getMealIcon = (mealName: string) => {
    if (mealName.toLowerCase().includes("breakfast")) {
      return <Egg className="h-5 w-5 text-yellow-500" />
    } else if (mealName.toLowerCase().includes("lunch")) {
      return <Utensils className="h-5 w-5 text-blue-500" />
    } else if (mealName.toLowerCase().includes("dinner")) {
      return <Utensils className="h-5 w-5 text-purple-500" />
    } else {
      return <Apple className="h-5 w-5 text-green-500" />
    }
  }

  const getFoodIcon = (foodName: string) => {
    if (
      foodName.toLowerCase().includes("chicken") ||
      foodName.toLowerCase().includes("beef") ||
      foodName.toLowerCase().includes("steak")
    ) {
      return <Beef className="h-4 w-4 text-red-500" />
    } else if (foodName.toLowerCase().includes("salmon") || foodName.toLowerCase().includes("fish")) {
      return <Fish className="h-4 w-4 text-blue-400" />
    } else if (
      foodName.toLowerCase().includes("vegetable") ||
      foodName.toLowerCase().includes("broccoli") ||
      foodName.toLowerCase().includes("spinach")
    ) {
      return <Carrot className="h-4 w-4 text-orange-500" />
    } else if (
      foodName.toLowerCase().includes("apple") ||
      foodName.toLowerCase().includes("banana") ||
      foodName.toLowerCase().includes("berries")
    ) {
      return <Apple className="h-4 w-4 text-green-500" />
    } else {
      return <Utensils className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Nutrition & Meal Planning</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Meal Plan</CardTitle>
              <CardDescription>Personalized meal suggestions based on your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Daily Calorie Goal</p>
                  <p className="text-2xl font-bold">{calorieGoal} calories</p>
                </div>

                <Select value={mealPlan} onValueChange={setMealPlan}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Diet Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="highProtein">High Protein</SelectItem>
                    <SelectItem value="lowCarb">Low Carb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                {meals.map((meal, index) => (
                  <Card key={index}>
                    <CardHeader className="py-4 px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getMealIcon(meal.name)}
                          <CardTitle className="text-lg">{meal.name}</CardTitle>
                        </div>
                        <div className="text-sm text-gray-500">
                          {meal.time} • {meal.calories} cal
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-6">
                      <ul className="space-y-2">
                        {meal.foods.map((food: any, foodIndex: number) => (
                          <li key={foodIndex} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getFoodIcon(food.name)}
                              <span>{food.name}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {food.portion} • {food.calories} cal
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Water Intake</CardTitle>
              <CardDescription>Track your daily hydration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-500">{waterIntake}</p>
                  <p className="text-sm text-gray-500">of {waterGoal} glasses</p>
                </div>
              </div>

              <div className="h-4 bg-gray-100 rounded-full mb-4">
                <div
                  className="h-4 bg-blue-500 rounded-full"
                  style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" onClick={handleWaterDecrement} disabled={waterIntake <= 0}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <p className="text-sm font-medium">Add Water</p>
                  <p className="text-xs text-gray-500">1 glass = 8 oz</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleWaterIncrement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nutrition Goals</CardTitle>
              <CardDescription>Adjust your daily targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="calories">Daily Calories</Label>
                  <span className="text-sm text-gray-500">{calorieGoal} cal</span>
                </div>
                <Slider
                  id="calories"
                  min={1200}
                  max={4000}
                  step={50}
                  value={[calorieGoal]}
                  onValueChange={(value) => setCalorieGoal(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="water">Water Goal (glasses)</Label>
                  <span className="text-sm text-gray-500">{waterGoal} glasses</span>
                </div>
                <Slider
                  id="water"
                  min={4}
                  max={16}
                  step={1}
                  value={[waterGoal]}
                  onValueChange={(value) => setWaterGoal(value[0])}
                />
              </div>

              <Button className="w-full mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Nutrition Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
