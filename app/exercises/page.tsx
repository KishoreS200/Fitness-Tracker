import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WorkoutVisualization } from "@/components/workout-visualization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExercisesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Exercise Library</h1>

        <Tabs defaultValue="visualization" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualization">Body Map</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Exercises</TabsTrigger>
          </TabsList>
          <TabsContent value="visualization">
            <WorkoutVisualization />
          </TabsContent>
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Categories</CardTitle>
                <CardDescription>Browse exercises by category</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Category content would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Exercises</CardTitle>
                <CardDescription>Complete exercise library</CardDescription>
              </CardHeader>
              <CardContent>
                <p>All exercises would be listed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
