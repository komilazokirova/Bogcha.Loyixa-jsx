import { Toaster } from "sonner";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import useThemeStore from "./store/themeStore";

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}

export default App;