import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, ArrowUpDown, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Distance = 'full' | 'half' | '10k';

const PaceCalculator = () => {
  const [paceSeconds, setPaceSeconds] = useState(300); // 5:00/km的配速，用秒表示
  const [treadmillSpeed, setTreadmillSpeed] = useState(10);
  const [unit, setUnit] = useState("km");
  const [distance, setDistance] = useState<Distance>('full');
  const { toast } = useToast();

  const MIN_PACE = 150; // 2:30 = 150秒
  const MAX_PACE = 420; // 7:00 = 420秒

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

  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPace = () => {
    return formatPace(paceSeconds);
  };

  const formatTimeWithSeconds = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes % 1) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalMinutes = () => {
    const distanceInKm = getDistance();
    return (paceSeconds / 60) * distanceInKm;
  };

  const handleDistanceChange = (newDistance: Distance) => {
    setDistance(newDistance);
  };

  const handlePaceChange = (newPaceSeconds: number) => {
    setPaceSeconds(newPaceSeconds);
  };

  const calculateRoadPace = (speedKmh: number) => {
    const actualSpeed = speedKmh * 1.04;
    const minutesPerKm = 60 / actualSpeed;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateTreadmillPace = (speedKmh: number) => {
    const minutesPerKm = 60 / speedKmh;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPaceRangeText = () => {
    return `${formatPace(MIN_PACE)}-${formatPace(MAX_PACE)}/km`;
  };

  return (
    <TooltipProvider>
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
                      onClick={() => handleDistanceChange('full')}
                    >
                      全马
                    </Button>
                    <Button
                      variant={distance === 'half' ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleDistanceChange('half')}
                    >
                      半马
                    </Button>
                    <Button
                      variant={distance === '10k' ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleDistanceChange('10k')}
                    >
                      10KM
                    </Button>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="text-lg text-gray-600">
                      {getDistanceLabel()}
                    </div>
                    <div>
                      <div className="text-lg text-gray-600 mb-1">目标完赛时间</div>
                      <div className="text-5xl font-bold text-primary">
                        {formatTimeWithSeconds(getTotalMinutes())}
                      </div>
                    </div>
                    <div className="text-2xl text-gray-600">
                      配速: {getCurrentPace()} 分钟/{unit}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>调整配速</Label>
                    <Slider 
                      value={[paceSeconds]}
                      max={MAX_PACE}
                      min={MIN_PACE}
                      step={5}
                      onValueChange={(value) => handlePaceChange(value[0])}
                    />
                    <div className="text-sm text-gray-500 text-center">
                      拖动滑块调整配速 ({getPaceRangeText()})
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treadmill">
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <div className="text-center space-y-4">
                    <div className="text-lg text-gray-600">跑步机速度</div>
                    <div className="text-5xl font-bold text-primary">
                      {treadmillSpeed} {unit}/h
                    </div>
                    <div>
                      <div className="text-lg text-gray-600 mb-1">实际配速</div>
                      <div className="text-2xl text-gray-600">
                        {calculateTreadmillPace(treadmillSpeed)} 分钟/{unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg text-gray-600 mb-1 flex items-center justify-center gap-2">
                        等效路跑配速
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              在跑步机上跑步比在户外路跑更轻松，主要是因为没有空气阻力。
                              通常来说，跑步机上的速度需要提高约4%才能达到与户外路跑相同的训练效果。
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-2xl text-gray-600">
                        {calculateRoadPace(treadmillSpeed)} 分钟/{unit}
                      </div>
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
    </TooltipProvider>
  );
};

export default PaceCalculator;
