import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  components: {
    Layout: {
      bodyBg: "#f0f0f0",
      siderBg: "#f0f0f0", // 例如 '#f0f0f0' 为浅灰色
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemBg: "transparent",
      itemActiveBg: "#f87171", // 激活时背景颜色
      itemHoverBg: "#f87171", // 背景颜色
      itemHoverColor: "#ffffff", // 文字颜色
      itemSelectedBg: "#f87171", //
      itemSelectedColor: "#ffffff",
    },
    Tabs: {
      inkBarColor: "#f87171",
      itemActiveColor: "#f87171",
      itemHoverColor: "#f87171",
      itemSelectedColor: "#f87171",
    },
    Button: {
      colorPrimary: "#f87171",
      colorPrimaryHover: "#f17160",
    },
  },
};

export default theme;
