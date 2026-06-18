import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IntroLoader from "./components/IntroLoader";

const App = () => (
  <>
    <IntroLoader />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Keep custom routes above the catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
