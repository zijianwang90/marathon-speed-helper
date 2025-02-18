
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
  const [treadmillSpeed, setTreadmillSpeed] = useState("");
  const [unit, setUnit] = useState("km");
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
    const roadSpeed = speed * 1.04;

    toast({
      title: "速度转换结果",
      description: `跑步机 ${speed} ${unit}/h ≈ 路跑 ${roadSpeed.toFixed(1)} ${unit}/h`,
    });
  };

  const getCurrentPace = () => {
    const distance = unit === "km" ? 42.195 : 26.2;
    return calculatePace(totalMinutes, distance);
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
