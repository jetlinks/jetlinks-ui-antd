const protocol = window.location.protocol;

const buildScriptTag = (src: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = src;
  return script;
};

export const getAMapUiPromise = (version: string = '1.1'): Promise<any> => {
  if ((window as any).AMapUI) {
    return Promise.resolve();
  }
  const script = buildScriptTag(`${protocol}//webapi.amap.com/ui/${version}/main-async.js`);
  const pro = new Promise((resolve) => {
    script.onload = () => {
      (window as any).initAMapUI();
      resolve(true);
    };
  });

  document.body.append(script);
  return pro;
};
