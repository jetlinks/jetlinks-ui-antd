const Menu = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <img src={require('/public/images/init-home/menu.png')} />
      </div>
      <div>系统将初始化XXX个菜单 初始化后的菜单可在“菜单管理”页面进行维护管理</div>
    </div>
  );
};

export default Menu;
