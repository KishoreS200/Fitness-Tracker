"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, User, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Set to true to always use mock data in development
const USE_MOCK_DATA = process.env.NODE_ENV === "development"

type Message = {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: string
}

// Update the getMockResponse function to provide more GPT-4o like responses
const getMockResponse = (message: string) => {
  const lowerMessage = message.toLowerCase()

  // Default response if no patterns match
  let response =
    "I'm here to help with your fitness journey. Could you tell me more about your specific goals or challenges? I can provide personalized advice on workouts, nutrition, recovery, or motivation."

  // Workout related questions
  if (lowerMessage.includes("workout") || lowerMessage.includes("exercise") || lowerMessage.includes("training")) {
    if (lowerMessage.includes("beginner") || lowerMessage.includes("start")) {
      response =
        "For beginners, I recommend starting with 3 full-body workouts per week with at least one rest day between sessions. Focus on mastering these fundamental movements:\n\n1. **Squats**: Start with bodyweight, then progress to goblet squats\n2. **Push-ups**: Begin on an incline if needed\n3. **Rows**: Use a sturdy table or TRX straps\n4. **Lunges**: Focus on balance and control\n5. **Planks**: Start with 20-second holds\n\nAim for 2-3 sets of 8-12 reps, with form as your priority. Would you like me to create a specific beginner workout plan for you?"
    } else if (lowerMessage.includes("weight loss") || lowerMessage.includes("lose weight")) {
      response =
        "For effective weight loss, you'll want to combine these key elements:\n\n1. **Strength training**: 3-4 sessions weekly to preserve muscle mass and boost metabolism\n2. **HIIT workouts**: 2-3 sessions (20-30 minutes) for efficient calorie burning\n3. **Low-intensity cardio**: 1-2 longer sessions (30-45 minutes) in your target heart rate zone\n4. **Nutrition**: Create a moderate calorie deficit (300-500 calories/day) while maintaining adequate protein intake\n5. **Recovery**: Ensure 7-8 hours of quality sleep to regulate hunger hormones\n\nConsistency is more important than intensity when starting out. Would you like me to help you create a sustainable workout schedule based on your preferences?"
    } else if (lowerMessage.includes("muscle") || lowerMessage.includes("strength") || lowerMessage.includes("gain")) {
      response =
        "To build muscle effectively, focus on these principles:\n\n1. **Progressive overload**: Gradually increase weight, reps, or sets over time\n2. **Training split**: Either full-body 3x/week or a push/pull/legs split for more advanced trainees\n3. **Compound movements**: Prioritize squats, deadlifts, bench press, rows, and overhead press\n4. **Volume**: Aim for 10-20 sets per muscle group per week\n5. **Nutrition**: Consume a slight caloric surplus (200-300 calories) with 1.6-2.2g protein per kg bodyweight\n6. **Rest**: Ensure 48+ hours before training the same muscle group again\n\nWhat's your current training experience and what specific muscle groups are you looking to develop?"
    } else {
      response =
        "Based on your fitness profile, I recommend a balanced approach with:\n\n1. **Strength training**: 3-4 days per week focusing on compound movements\n2. **Cardiovascular training**: 2-3 days per week mixing HIIT and steady-state cardio\n3. **Active recovery**: 1-2 days with mobility work, light walking, or yoga\n\nThis balance will help you build strength, improve endurance, and maintain joint health. Would you like me to create a more detailed weekly workout schedule based on your specific goals and available equipment?"
    }
  }
  // Nutrition related questions
  else if (
    lowerMessage.includes("nutrition") ||
    lowerMessage.includes("diet") ||
    lowerMessage.includes("food") ||
    lowerMessage.includes("eat")
  ) {
    if (lowerMessage.includes("protein") || lowerMessage.includes("protein sources")) {
      response =
        "Here are excellent protein sources categorized by type:\n\n**Animal-based:**\n- Chicken breast (31g per 100g)\n- Turkey breast (29g per 100g)\n- Lean beef (26g per 100g)\n- Fish (20-25g per 100g)\n- Greek yogurt (10g per 100g)\n- Cottage cheese (11g per 100g)\n- Eggs (6g per egg)\n\n**Plant-based:**\n- Tofu (8g per 100g)\n- Tempeh (19g per 100g)\n- Seitan (25g per 100g)\n- Lentils (9g per 100g)\n- Chickpeas (9g per 100g)\n- Quinoa (4g per 100g)\n- Nutritional yeast (14g per 28g)\n\nFor muscle building, aim for 1.6-2.2g of protein per kg of bodyweight spread across 4-5 meals daily. How would you like to incorporate more protein into your current diet?"
    } else if (lowerMessage.includes("carb") || lowerMessage.includes("carbohydrate")) {
      response =
        "Quality carbohydrates are essential for energy, especially for active individuals. Here are excellent sources ranked by nutritional value:\n\n**Complex carbs (prioritize these):**\n- Oats\n- Sweet potatoes\n- Brown rice\n- Quinoa\n- Beans and lentils\n- Whole grain bread\n- Barley\n\n**Fruits:**\n- Berries (lower glycemic impact)\n- Apples\n- Oranges\n- Bananas (great pre/post workout)\n\n**Simple carbs (limit these):**\n- White rice\n- White potatoes\n- White bread\n- Pasta\n\nTiming matters: consume more carbs before and after workouts when your body utilizes them most efficiently. For active individuals, carbs should comprise about 40-60% of total calories. How active are you, and would you like guidance on carb timing around your workouts?"
    } else if (lowerMessage.includes("fat") || lowerMessage.includes("healthy fat")) {
      response =
        "Healthy fats are crucial for hormone production, brain health, and nutrient absorption. Here are excellent sources:\n\n**Monounsaturated fats:**\n- Avocados\n- Olive oil\n- Almonds, cashews\n- Peanut butter\n\n**Polyunsaturated fats (including omega-3s):**\n- Fatty fish (salmon, mackerel, sardines)\n- Walnuts\n- Flaxseeds and chia seeds\n- Hemp seeds\n\n**Saturated fats (consume moderately):**\n- Coconut oil\n- Grass-fed butter\n- Dark chocolate\n\nAim for about 0.5-1g of fat per kg of bodyweight daily (roughly 25-35% of total calories). Prioritize unsaturated sources while moderating saturated fats. Would you like specific recommendations for incorporating these into your meals?"
    } else {
      response =
        "For optimal fitness results, I recommend this nutritional approach:\n\n1. **Protein**: 1.6-2.2g per kg of bodyweight (lean meats, fish, eggs, legumes)\n2. **Carbohydrates**: 3-5g per kg depending on activity level (whole grains, fruits, vegetables)\n3. **Fats**: 0.5-1g per kg (avocados, nuts, olive oil, fatty fish)\n4. **Hydration**: Minimum 3L water daily (more during intense training)\n5. **Meal timing**: 4-5 meals spaced 3-4 hours apart\n6. **Pre-workout**: Carb-protein meal 1-2 hours before training\n7. **Post-workout**: Protein-carb meal within 45 minutes after training\n\nThis balanced approach provides sustained energy, supports recovery, and helps maintain body composition. Would you like me to help you create a specific meal plan based on your preferences and goals?"
    }
  }
  // Goal related questions
  else if (lowerMessage.includes("goal") || lowerMessage.includes("target") || lowerMessage.includes("objective")) {
    if (lowerMessage.includes("realistic") || lowerMessage.includes("achievable")) {
      response =
        'Setting realistic fitness goals follows the SMART framework:\n\n**Specific**: "I want to deadlift 225 lbs" vs. "I want to get stronger"\n**Measurable**: Track with numbers (weight, reps, measurements)\n**Achievable**: Based on your starting point and timeline:\n- Weight loss: 0.5-1% of bodyweight weekly (0.5-2 lbs)\n- Muscle gain: 0.25-0.5% of bodyweight monthly (beginners can gain faster)\n- Strength: 2.5-5% increase in lifts every 2-4 weeks (beginners)\n**Relevant**: Aligned with your overall fitness vision\n**Time-bound**: Set deadlines to create urgency\n\nWhat specific area would you like to set goals for, and what\'s your current baseline?'
    } else if (lowerMessage.includes("track") || lowerMessage.includes("measure")) {
      response =
        "Effective progress tracking combines multiple metrics for a complete picture:\n\n1. **Body composition**:\n   - Weight: Weekly, same time/conditions\n   - Measurements: Bi-weekly (chest, waist, hips, arms, thighs)\n   - Photos: Monthly, same lighting/poses\n   - Body fat: Monthly (if available)\n\n2. **Performance**:\n   - Strength: Log weights, sets, reps\n   - Endurance: Track distance, time, heart rate\n   - Mobility: Record range of motion\n\n3. **Recovery/Wellness**:\n   - Sleep quality and duration\n   - Energy levels (1-10 scale)\n   - Stress levels (1-10 scale)\n\nI recommend using a fitness app or journal to identify patterns and make data-driven adjustments. Which metrics would be most meaningful for your specific goals?"
    } else {
      response =
        "Setting effective fitness goals requires balancing ambition with realism. Based on your profile, here are suggested targets:\n\n1. **Short-term (1 month):**\n   - Establish consistent workout routine (3-4 sessions weekly)\n   - Master proper form on fundamental movements\n   - Track nutrition consistently\n\n2. **Medium-term (3 months):**\n   - Increase strength by 15-20% on major lifts\n   - Improve workout capacity by 25%\n   - Achieve 80% adherence to nutrition targets\n\n3. **Long-term (6-12 months):**\n   - Reach specific strength benchmarks (e.g., bodyweight squat, 10 pull-ups)\n   - Achieve body composition targets\n   - Complete a fitness event/challenge\n\nWhat specific area would you like to prioritize, and what timeline are you working with?"
    }
  }
  // Recovery related questions
  else if (lowerMessage.includes("recovery") || lowerMessage.includes("rest") || lowerMessage.includes("sore")) {
    if (lowerMessage.includes("sore") || lowerMessage.includes("soreness") || lowerMessage.includes("doms")) {
      response =
        "Muscle soreness (DOMS) is normal, especially after new exercises. Here's how to manage it effectively:\n\n**Immediate strategies:**\n- **Active recovery**: Light movement increases blood flow (walking, swimming)\n- **Proper hydration**: Aim for 3+ liters daily\n- **Adequate protein**: 1.6-2.2g/kg bodyweight to support repair\n- **Sleep quality**: 7-9 hours for optimal recovery\n\n**Physical techniques:**\n- **Self-myofascial release**: Foam rolling, massage balls (10-15 min daily)\n- **Contrast therapy**: Alternating hot and cold exposure\n- **Compression garments**: Can reduce inflammation\n\n**Preventative measures:**\n- **Progressive overload**: Increase intensity gradually\n- **Proper warm-up**: Dynamic movements before training\n- **Cool-down**: 5-10 minutes post-workout\n\nSoreness typically peaks 24-72 hours post-exercise. If pain is sharp, localized, or lasts beyond 5 days, consider consulting a healthcare professional. How severe is your current soreness on a scale of 1-10?"
    } else {
      response =
        "Effective recovery is as important as your workouts. Here's a comprehensive approach:\n\n**Daily practices:**\n- **Sleep**: 7-9 quality hours (consistent schedule)\n- **Nutrition**: Protein within 30 min post-workout, adequate carbs to replenish glycogen\n- **Hydration**: Minimum 3L water daily (more during intense training)\n- **Movement**: Light activity on rest days (walking, swimming)\n\n**Weekly practices:**\n- **Deload weeks**: Reduce volume/intensity every 4-6 weeks\n- **Stress management**: Meditation, nature exposure, social connection\n- **Mobility work**: 15-20 min daily targeting tight areas\n\n**Recovery modalities:**\n- **Foam rolling/massage**: 10-15 min daily\n- **Contrast therapy**: Hot/cold exposure\n- **Compression**: Garments or pneumatic devices\n\nYour recovery needs increase with training intensity, age, and stress levels. What specific recovery challenges are you facing?"
    }
  }
  // Motivation related questions
  else if (lowerMessage.includes("motivat") || lowerMessage.includes("habit") || lowerMessage.includes("consistent")) {
    response =
      'Building lasting fitness motivation combines multiple strategies:\n\n**Identity-based approach:**\n- Focus on becoming "someone who exercises" rather than "someone trying to exercise"\n- Use affirmations: "I am becoming stronger" vs. "I want to be stronger"\n\n**Habit formation:**\n- **Trigger**: Link workouts to existing habits (e.g., after morning coffee)\n- **Routine**: Start with "minimum effective dose" (even 5-10 minutes)\n- **Reward**: Immediate positive reinforcement after completion\n\n**Environmental design:**\n- Reduce friction (prepare workout clothes night before)\n- Increase accountability (scheduled sessions, workout partners)\n- Visual cues (calendar tracking, visible equipment)\n\n**Psychological techniques:**\n- Focus on immediate benefits (energy, mood) vs. distant goals\n- Track non-scale victories (strength, energy, sleep quality)\n- Connect to deeper values (health for family, mental wellbeing)\n\nWhat specific motivation challenges are you facing right now?'
  }
  // Greeting or introduction
  else if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey") ||
    lowerMessage.includes("greetings")
  ) {
    response =
      "Hello! I'm your AI fitness coach, designed to provide personalized guidance for your fitness journey. I can help with:\n\n- Creating customized workout plans\n- Nutrition strategies for your specific goals\n- Recovery optimization techniques\n- Motivation and habit-building strategies\n- Form corrections and exercise variations\n\nI'm continuously learning to provide you with evidence-based recommendations. What specific aspect of your fitness journey would you like help with today?"
  }
  // Help or capabilities
  else if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("what can you do") ||
    lowerMessage.includes("capabilities")
  ) {
    response =
      "I'm your AI fitness coach, equipped to help you with:\n\n**Workout Programming:**\n- Custom training plans based on your goals, experience, and available equipment\n- Exercise technique guidance and form tips\n- Progressive overload strategies\n\n**Nutrition Guidance:**\n- Macro and calorie recommendations\n- Meal timing strategies\n- Food suggestions for specific goals\n\n**Recovery Optimization:**\n- Sleep improvement strategies\n- Managing muscle soreness\n- Active recovery techniques\n\n**Goal Setting:**\n- Realistic target establishment\n- Progress tracking methods\n- Milestone planning\n\n**Motivation & Psychology:**\n- Habit building techniques\n- Overcoming plateaus and setbacks\n- Maintaining consistency\n\nWhat specific area would you like guidance on today?"
  }

  return {
    text: response,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }
}

const formatTime = () => {
  return new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export function AICoach() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI fitness coach. How can I help you with your fitness journey today?",
      sender: "ai",
      timestamp: formatTime(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isLoading) return

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: formatTime(),
      }

      // Update UI immediately with user message
      setMessages((prev) => [...prev, userMessage])
      setMessage("")
      setIsLoading(true)
      setConnectionError(null)

      try {
        // Always use mock responses for now to ensure functionality
        console.log("Using mock AI coach response")
        const mockData = getMockResponse(userMessage.text)

        // Add a small delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 500))

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: mockData.text,
          sender: "ai",
          timestamp: formatTime(),
        }

        // Safely update messages state
        setMessages((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, aiMessage]
          } else {
            // If prev is somehow not an array, reset with initial messages plus new ones
            console.error("Messages state was not an array, resetting")
            return [
              {
                id: "1",
                text: "Hello! I'm your AI fitness coach. How can I help you with your fitness journey today?",
                sender: "ai",
                timestamp: formatTime(),
              },
              userMessage,
              aiMessage,
            ]
          }
        })
      } catch (error) {
        console.error("Error in AI coach:", error)
        setConnectionError(error instanceof Error ? error.message : "An unknown error occurred")

        // Add a fallback message even in case of error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "ai",
          timestamp: formatTime(),
        }

        setMessages((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, errorMessage]
          } else {
            return [
              {
                id: "1",
                text: "Hello! I'm your AI fitness coach. How can I help you with your fitness journey today?",
                sender: "ai",
                timestamp: formatTime(),
              },
              userMessage,
              errorMessage,
            ]
          }
        })
      }
    } catch (error) {
      console.error("Unexpected error in message handling:", error)
      setIsLoading(false)
      setConnectionError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Fitness Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="p-4 space-y-4">
            {connectionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}>
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 text-sm max-w-[80%] ${
                    msg.sender === "ai" ? "bg-gray-100" : "bg-blue-100"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.sender === "ai" ? "AI Coach" : "You"} · {msg.timestamp}
                  </div>
                  <p>{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t mt-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Ask your fitness coach..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              disabled={isLoading}
              suppressHydrationWarning
            />
            <Button size="icon" type="submit" disabled={isLoading || !message.trim()} suppressHydrationWarning>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
