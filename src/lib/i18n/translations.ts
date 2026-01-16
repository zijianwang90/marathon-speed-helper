export type Language = 'zh' | 'en';

export interface Translations {
  // App title
  appTitle: string;
  
  // Tabs
  paceCalculation: string;
  treadmillConversion: string;
  
  // Distance types
  fullMarathon: string;
  halfMarathon: string;
  tenK: string;
  
  // Pace calculation section
  targetFinishTime: string;
  pace: string;
  adjustPace: string;
  dragSliderToAdjustPace: string;
  minutes: string;
  
  // Treadmill section
  treadmillSpeed: string;
  actualPace: string;
  equivalentRoadPace: string;
  adjustTreadmillSpeed: string;
  dragSliderToAdjustSpeed: string;
  
  // Tooltip
  treadmillTooltip: string;
  
  // Unit toggle
  unitSwitched: string;
  kilometer: string;
  mile: string;
  
  // Units
  km: string;
  mi: string;
  kmh: string;
  mih: string;
  
  // 404 page
  notFound: string;
  pageNotFound: string;
  returnToHome: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    appTitle: '马拉松配速助手',
    paceCalculation: '配速计算',
    treadmillConversion: '跑步机转换',
    fullMarathon: '全马',
    halfMarathon: '半马',
    tenK: '10KM',
    targetFinishTime: '目标完赛时间',
    pace: '配速',
    adjustPace: '调整配速',
    dragSliderToAdjustPace: '拖动滑块调整配速',
    minutes: '分钟',
    treadmillSpeed: '跑步机速度',
    actualPace: '实际配速',
    equivalentRoadPace: '等效路跑配速',
    adjustTreadmillSpeed: '调整跑步机速度',
    dragSliderToAdjustSpeed: '拖动滑块调整速度',
    treadmillTooltip: '在跑步机上跑步比在户外路跑更轻松，主要是因为没有空气阻力。通常来说，跑步机上的速度需要提高约4%才能达到与户外路跑相同的训练效果。',
    unitSwitched: '单位已切换为',
    kilometer: '公里',
    mile: '英里',
    km: 'km',
    mi: 'mi',
    kmh: 'km/h',
    mih: 'mi/h',
    notFound: '404',
    pageNotFound: '页面未找到',
    returnToHome: '返回首页',
  },
  en: {
    appTitle: 'Marathon Pace Assistant',
    paceCalculation: 'Pace Calculation',
    treadmillConversion: 'Treadmill Conversion',
    fullMarathon: 'Full Marathon',
    halfMarathon: 'Half Marathon',
    tenK: '10K',
    targetFinishTime: 'Target Finish Time',
    pace: 'Pace',
    adjustPace: 'Adjust Pace',
    dragSliderToAdjustPace: 'Drag slider to adjust pace',
    minutes: 'min',
    treadmillSpeed: 'Treadmill Speed',
    actualPace: 'Actual Pace',
    equivalentRoadPace: 'Equivalent Road Pace',
    adjustTreadmillSpeed: 'Adjust Treadmill Speed',
    dragSliderToAdjustSpeed: 'Drag slider to adjust speed',
    treadmillTooltip: 'Running on a treadmill is easier than outdoor road running, mainly because there is no air resistance. Generally speaking, the speed on a treadmill needs to be increased by about 4% to achieve the same training effect as outdoor road running.',
    unitSwitched: 'Unit switched to',
    kilometer: 'kilometer',
    mile: 'mile',
    km: 'km',
    mi: 'mi',
    kmh: 'km/h',
    mih: 'mi/h',
    notFound: '404',
    pageNotFound: 'Oops! Page not found',
    returnToHome: 'Return to Home',
  },
};
