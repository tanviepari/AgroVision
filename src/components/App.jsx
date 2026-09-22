import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Dashboard from './Dashboard';
import DiseaseScan from './DiseaseScan';
import Irrigation from './Irrigation';
import YieldForecast from './YieldForecast';

/**
 * App shell — sticky header, routed pages, shared footer.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex-1" id="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/disease-scan" element={<DiseaseScan />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/yield-forecast" element={<YieldForecast />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
