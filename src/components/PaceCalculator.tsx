
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

type Distance = 'full' | 'half' | '10k';

const PaceCalculator = () => {
  const [totalMinutes, setTotalMinutes] = useState(180);
  const [treadmillSpeed, setTreadmillSpeed] = useState(10);
  const [unit, setUnit] = useState("km");
  const [distance, setDistance] = useState<Distance>('full');
  const { toast } = useToast();

  const getDistance = () => {
    if (unit === "km") {
      switch (distance) {
        case 'full': return 42.195;
        case 'half': return 21.0975;
        case '10k': return 10;
        default: return 42.195;
      }
    } else {
      switch (distance) {
        case 'full': return 26.2;
        case 'half': return 13.1;
        case '10k': return 6.2;
        default: return 26.2;
      }
    }
  };

  const getDistanceLabel = () => {
    switch (distance) {
      case 'full': return '全程马拉松';
      case 'half': return '半程马拉松';
      case '10k': return '10公里';
      default: return '全程马拉松';
    }
  };

  const toggleUnit = () => {
    setUnit(prev => {
      const newUnit = prev === "km" ? "mile" : "km";
      toast({
        description: `单位已切换为${newUnit === "km" ? "公里" : "英里"}`,
        duration: 1500,
      });
      return newUnit;
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const calculatePace = (totalMinutes: number, distance: number) => {
    const paceMinutes = totalMinutes / distance;
    const minutes = Math.floor(paceMinutes);
    const seconds = Math.round((paceMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentPace = () => {
    return calculatePace(totalMinutes, getDistance());
  };

  const calculateRoadPace = (speedKmh: number) => {
    const actualSpeed = speedKmh * 1.04;
    const minutesPerKm = 60 / actualSpeed;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8">马拉松配速助手</h1>

        <Tabs defaultValue="marathon" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marathon">
              <Timer className="w-4 h-4 mr-2" />
              配速计算
            </TabsTrigger>
            <TabsTrigger value="treadmill">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              跑步机转换
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marathon">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={distance === 'full' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setDistance('full')}
                  >
                    全马
                  </Button>
                  <Button
                    variant={distance === 'half' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setDistance('half')}
                  >
                    半马
                  </Button>
                  <Button
                    variant={distance === '10k' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setDistance('10k')}
                  >
                    10KM
                  </Button>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-lg text-gray-600">
                    {getDistanceLabel()}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    目标完赛时间: {formatTime(totalMinutes)}
                  </div>
                  <div className="text-4xl font-bold">
                    配速: {getCurrentPace()} 分钟/{unit}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>调整完赛时间</Label>
                  <Slider 
                    defaultValue={[180]}
                    max={360}
                    min={120}
                    step={1}
                    onValueChange={(value) => setTotalMinutes(value[0])}
                  />
                  <div className="text-sm text-gray-500 text-center">
                    拖动滑块调整时间 (2-6小时)
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treadmill">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    跑步机速度: {treadmillSpeed} {unit}/h
                  </div>
                  <div className="text-4xl font-bold">
                    路跑配速: {calculateRoadPace(treadmillSpeed)} 分钟/{unit}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>调整跑步机速度</Label>
                  <Slider 
                    defaultValue={[10]}
                    max={20}
                    min={4}
                    step={0.1}
                    onValueChange={(value) => setTreadmillSpeed(value[0])}
                  />
                  <div className="text-sm text-gray-500 text-center">
                    拖动滑块调整速度 (4-20 {unit}/h)
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Button
        variant="outline"
        className="fixed bottom-6 right-6 rounded-full px-4 h-12 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:bg-gray-50 font-semibold text-primary"
        onClick={toggleUnit}
      >
        {unit === "km" ? "KM" : "MI"}
      </Button>
    </div>
  );
};

export default PaceCalculator;
