type Action = {
  id:string;
  name:string;
  arg:unknown[];
}
type Mode = {
  id:string;
  name:string;
}
type Property = {
  id:string;
  name:string;
}
type DuerOSItem = {
  id: string;
  name: string;
  actions:Action[];
  modes:Mode[];
  properties:Property[];
};

