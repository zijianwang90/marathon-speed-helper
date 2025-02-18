import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

const PaceCalculator = () => {
  const [totalMinutes, setTotalMinutes] = useState(180); // 默认3小时
  const [treadmillSpeed, setTreadmillSpeed] = useState(10); // 默认10km/h或mph
  const [unit, setUnit] = useState("km");
  const [raceType, setRaceType] = useState("marathon"); // 新增赛程类型状态
  const { toast } = useToast();

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

  const getRaceDistance = () => {
    if (unit === "km") {
      switch (raceType) {
        case "marathon": return 42.195;
        case "halfMarathon": return 21.0975;
        case "10k": return 10;
        default: return 42.195;
      }
    } else {
      switch (raceType) {
        case "marathon": return 26.2;
        case "halfMarathon": return 13.1;
        case "10k": return 6.2;
        default: return 26.2;
      }
    }
  };

  const getDefaultTime = (type: string) => {
    switch (type) {
      case "marathon": return 180;
      case "halfMarathon": return 90;
      case "10k": return 40;
      default: return 180;
    }
  };

  const getCurrentPace = () => {
    const distance = getRaceDistance();
    return calculatePace(totalMinutes, distance);
  };

  const calculateRoadPace = (speedKmh: number) => {
    const actualSpeed = speedKmh;
    const minutesPerKm = 60 / actualSpeed;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRaceTypeChange = (type: string) => {
    setRaceType(type);
    setTotalMinutes(getDefaultTime(type));
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">马拉松配速助手</h1>
      
      <Tabs defaultValue="km" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="km" onClick={() => setUnit("km")}>公里</TabsTrigger>
          <TabsTrigger value="mile" onClick={() => setUnit("mile")}>英里</TabsTrigger>
        </TabsList>
      </Tabs>

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
              <div className="space-y-4">
                <Tabs defaultValue="marathon" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger 
                      value="marathon" 
                      onClick={() => handleRaceTypeChange("marathon")}
                    >
                      全程马拉松
                    </TabsTrigger>
                    <TabsTrigger 
                      value="halfMarathon" 
                      onClick={() => handleRaceTypeChange("halfMarathon")}
                    >
                      半程马拉松
                    </TabsTrigger>
                    <TabsTrigger 
                      value="10k" 
                      onClick={() => handleRaceTypeChange("10k")}
                    >
                      10公里
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="text-center space-y-2">
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
                  value={[totalMinutes]}
                  max={raceType === "marathon" ? 360 : raceType === "halfMarathon" ? 180 : 90}
                  min={raceType === "marathon" ? 120 : raceType === "halfMarathon" ? 60 : 30}
                  step={1}
                  onValueChange={(value) => setTotalMinutes(value[0])}
                />
                <div className="text-sm text-gray-500 text-center">
                  拖动滑块调整时间 ({raceType === "marathon" ? "2-6小时" : 
                    raceType === "halfMarathon" ? "1-3小时" : 
                    "30-90分钟"})
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
  );
};

export default PaceCalculator;
