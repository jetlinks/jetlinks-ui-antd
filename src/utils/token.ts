const Token = {
  set: (token: string) => localStorage.setItem('X-Access-Token', token),
  get: () => localStorage.getItem('X-Access-Token') || Date.now().toString(),
};
export default Token;
