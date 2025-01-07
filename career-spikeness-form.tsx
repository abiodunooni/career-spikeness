"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import { categories } from "./categories";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function CareerSpikenessForm() {
  const [shuffledQuestions, setShuffledQuestions] = useState<
    {
      category: string;
      question: string;
      options: { text: string; value: number }[];
    }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetSurvey();
  }, []);

  const resetSurvey = () => {
    const allQuestions = categories.flatMap((category) =>
      category.questions.map((q) => ({ category: category.name, ...q }))
    );
    const newShuffledQuestions = shuffleArray(allQuestions);
    setShuffledQuestions(newShuffledQuestions);
    setCurrentQuestionIndex(0);
    setScores(Object.fromEntries(categories.map((cat) => [cat.name, 0])));
    setShowResults(false);
  };

  const handleInputChange = (category: string, value: number) => {
    setScores((prev) => {
      const currentScore = prev[category] || 0;
      const newScore = currentScore + value;
      return { ...prev, [category]: newScore }; // Average of two questions
    });
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const chartData = categories.map((cat) => ({
    subject: cat.name,
    A: scores[cat.name] || 0,
    fullMark: 10,
  }));

  const downloadChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "career-spikeness-chart.png";
        link.click();
      } catch (error) {
        console.error("Error generating chart image:", error);
        alert(
          "There was an error generating the chart image. Please try again."
        );
      }
    }
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl mx-auto mb-16">
        <CardHeader>
          <CardTitle>Career Spikeness Assessment</CardTitle>
          <CardDescription>
            Answer the questions to see your career spikeness chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showResults ? (
            <>
              <Progress
                value={(currentQuestionIndex / shuffledQuestions.length) * 100}
                className="mb-4"
              />
              {currentQuestion && (
                <div key={currentQuestionIndex} className="mb-6">
                  <Label className="text-lg font-semibold mb-2">
                    {currentQuestion.question}
                  </Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleInputChange(
                        currentQuestion.category,
                        parseInt(value)
                      )
                    }
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <RadioGroupItem
                          value={option.value.toString()}
                          id={`${currentQuestionIndex}-${index}`}
                        />
                        <Label htmlFor={`${currentQuestionIndex}-${index}`}>
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Your Career Spikeness Chart
              </h3>
              <div ref={chartRef} className="w-full max-w-md mx-auto">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={chartData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Spikeness"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={resetSurvey} variant="outline">
            Reset
          </Button>
          {showResults && (
            <Button onClick={downloadChart}>Download Chart</Button>
          )}
        </CardFooter>
      </Card>
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground py-4 text-center text-lg font-bold">
        <a href="https://usenebula.io" target="_blank">
          Hosted on Nebula: Cloud for Africa
        </a>
      </div>
    </div>
  );
}
