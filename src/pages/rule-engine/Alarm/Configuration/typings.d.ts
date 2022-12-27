type ConfigurationItem = {
  name: string;
  targetType: string;
  level: number;
  sceneName: string;
  sceneId: string;
  scene?: any[];
  state: { text: string; value: string };
  description: string;
  id: string;
  sceneTriggerType: string;
};
