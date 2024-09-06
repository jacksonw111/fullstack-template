import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { LazyMotion, domAnimation } from "framer-motion";
import { Suspense } from "react";
import RouterProviderComponent from "./routes/router";
import theme from "./theme.config";

const client = new QueryClient();
const App = () => {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex item-center justify-center">
          加载中....
        </div>
      }
    >
      <ConfigProvider theme={theme}>
        <QueryClientProvider client={client}>
          <LazyMotion features={domAnimation}>
            <RouterProviderComponent />
          </LazyMotion>
        </QueryClientProvider>
      </ConfigProvider>
    </Suspense>
  );
};

export default App;
