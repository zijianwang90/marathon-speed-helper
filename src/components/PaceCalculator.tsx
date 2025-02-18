
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PaceCalculator = () => {
  const [marathonTime, setMarathonTime] = useState({ hours: "", minutes: "" });
  const [treadmillSpeed, setTreadmillSpeed] = useState("");
  const [unit, setUnit] = useState("km"); // km or mile
  const { toast } = useToast();

  const calculatePace = (totalMinutes: number, distance: number) => {
    const paceMinutes = totalMinutes / distance;
    const minutes = Math.floor(paceMinutes);
    const seconds = Math.round((paceMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMarathonCalculation = () => {
    const hours = parseInt(marathonTime.hours) || 0;
    const minutes = parseInt(marathonTime.minutes) || 0;
    
    if (hours === 0 && minutes === 0) {
      toast({
        title: "请输入有效时间",
        description: "请输入小时或分钟",
        variant: "destructive",
      });
      return;
    }

    const totalMinutes = hours * 60 + minutes;
    const distance = unit === "km" ? 42.195 : 26.2;
    const pace = calculatePace(totalMinutes, distance);

    toast({
      title: "配速计算结果",
      description: `您的目标配速为: ${pace} 分钟/${unit}`,
    });
  };

  const handleTreadmillConversion = () => {
    if (!treadmillSpeed) {
      toast({
        title: "请输入速度",
        description: "请输入跑步机速度",
        variant: "destructive",
      });
      return;
    }

    const speed = parseFloat(treadmillSpeed);
    const roadSpeed = speed * 1.04; // 简单的跑步机到路跑速度转换

    toast({
      title: "速度转换结果",
      description: `跑步机 ${speed} ${unit}/h ≈ 路跑 ${roadSpeed.toFixed(1)} ${unit}/h`,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8">马拉松配速助手</h1>
      
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="km" onClick={() => setUnit("km")}>公里</TabsTrigger>
          <TabsTrigger value="mile" onClick={() => setUnit("mile")}>英里</TabsTrigger>
        </TabsList>
      </div>

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
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>小时</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={marathonTime.hours}
                    onChange={(e) => setMarathonTime(prev => ({ ...prev, hours: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>分钟</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={marathonTime.minutes}
                    onChange={(e) => setMarathonTime(prev => ({ ...prev, minutes: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={handleMarathonCalculation}
              >
                计算配速
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treadmill">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>跑步机速度 ({unit}/h)</Label>
                <Input
                  type="number"
                  placeholder={`输入跑步机速度 (${unit}/h)`}
                  value={treadmillSpeed}
                  onChange={(e) => setTreadmillSpeed(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleTreadmillConversion}
              >
                换算路跑速度
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaceCalculator;
