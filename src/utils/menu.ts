// 路由components映射
// const findComponents = (files: __WebpackModuleApi.RequireContext) => {
//   const modules = {};
//   files.keys().forEach((key) => {
//     // 删除路径开头的./ 以及结尾的 /index；
//     const str = key.replace(/(\.\/|\.tsx)/g, '').replace('/index', '');
//     modules[str] = files(key).default;
//   });
//   return modules;
// };
//
// /**
//  * 处理为正确的路由格式
//  * @param extraRoutes 后端菜单数据
//  */
// const getRoutes = (extraRoutes: any[]) => {
//   const allComponents = findComponents(require.context('@/pages', true, /index(\.tsx)$/));
//   return extraRoutes.map((route) => {
//     const component = allComponents[route.key];
//     return {
//       ...route,
//       component,
//     };
//   });
// };
//
// export default getRoutes;
