
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
  TooltipProvider,
  ResponsiveTooltip,
} from "@/components/ui/tooltip";

type Distance = 'full' | 'half' | '10k';

const PaceCalculator = () => {
  const [paceSeconds, setPaceSeconds] = useState(300); // 5:00/km的配速，用秒表示
  const [treadmillSpeed, setTreadmillSpeed] = useState(10);
  const [unit, setUnit] = useState("km");
  const [distance, setDistance] = useState<Distance>('full');
  const { toast } = useToast();

  // 为不同单位设置不同的配速范围
  const getPaceRange = () => {
    if (unit === "km") {
      return {
        MIN_PACE: 150, // 2:30 min/km
        MAX_PACE: 420, // 7:00 min/km
      };
    } else {
      return {
        MIN_PACE: 240, // 4:00 min/mile
        MAX_PACE: 660, // 11:00 min/mile
      };
    }
  };

  const { MIN_PACE, MAX_PACE } = getPaceRange();

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
      // 转换当前配速到新单位
      if (newUnit === "mile") {
        setPaceSeconds(Math.round(paceSeconds * 1.609344)); // km -> mile
      } else {
        setPaceSeconds(Math.round(paceSeconds / 1.609344)); // mile -> km
      }
      // 转换跑步机速度到新单位（保持实际速度不变）
      if (newUnit === "mile") {
        // 从 km/h 转换为 mi/h
        setTreadmillSpeed(Number((treadmillSpeed / 1.609344).toFixed(1)));
      } else {
        // 从 mi/h 转换为 km/h
        setTreadmillSpeed(Number((treadmillSpeed * 1.609344).toFixed(1)));
      }
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

  // 获取跑步机速度范围
  const getTreadmillSpeedRange = () => {
    if (unit === "km") {
      return { min: 4, max: 20 };
    } else {
      // 将4-20 km/h转换为mi/h
      return { 
        min: Number((4 / 1.609344).toFixed(1)), 
        max: Number((20 / 1.609344).toFixed(1)) 
      };
    }
  };

  // 将速度转换为km/h（用于计算）
  const convertToKmh = (speed: number) => {
    if (unit === "km") {
      return speed;
    } else {
      return speed * 1.609344;
    }
  };

  const calculateRoadPace = (speed: number) => {
    const speedKmh = convertToKmh(speed);
    const actualSpeed = speedKmh / 1.04;
    const distanceUnit = unit === "km" ? 1 : 1.609344; // 1 km 或 1 mile
    const minutesPerUnit = (60 / actualSpeed) * distanceUnit;
    const minutes = Math.floor(minutesPerUnit);
    const seconds = Math.round((minutesPerUnit - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateTreadmillPace = (speed: number) => {
    const speedKmh = convertToKmh(speed);
    const distanceUnit = unit === "km" ? 1 : 1.609344; // 1 km 或 1 mile
    const minutesPerUnit = (60 / speedKmh) * distanceUnit;
    const minutes = Math.floor(minutesPerUnit);
    const seconds = Math.round((minutesPerUnit - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPaceRangeText = () => {
    return `${formatPace(MIN_PACE)}-${formatPace(MAX_PACE)}/${unit}`;
  };

  // 格式化单位显示（mile显示为mi）
  const formatUnit = () => {
    return unit === "km" ? "km" : "mi";
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
                      step={1}
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
                      {treadmillSpeed} {formatUnit()}/h
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
                        <ResponsiveTooltip
                          content={
                            <p className="max-w-xs text-sm">
                              在跑步机上跑步比在户外路跑更轻松，主要是因为没有空气阻力。
                              通常来说，跑步机上的速度需要提高约4%才能达到与户外路跑相同的训练效果。
                            </p>
                          }
                        >
                          <HelpCircle className="h-4 w-4" />
                        </ResponsiveTooltip>
                      </div>
                      <div className="text-2xl text-gray-600">
                        {calculateRoadPace(treadmillSpeed)} 分钟/{unit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>调整跑步机速度</Label>
                    <Slider 
                      value={[treadmillSpeed]}
                      max={getTreadmillSpeedRange().max}
                      min={getTreadmillSpeedRange().min}
                      step={0.1}
                      onValueChange={(value) => setTreadmillSpeed(value[0])}
                    />
                    <div className="text-sm text-gray-500 text-center">
                      拖动滑块调整速度 ({getTreadmillSpeedRange().min}-{getTreadmillSpeedRange().max} {formatUnit()}/h)
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
