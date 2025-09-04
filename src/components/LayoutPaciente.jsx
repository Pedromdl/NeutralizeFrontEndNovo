import { useState, useEffect } from "react";
import PacienteSidebar from "../components/PacienteSidebar"; // 🔹 sua sidebar exclusiva
import BottomMenu from "./BottomMenu";

export default function LayoutPaciente({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-container">
      {!isMobile && <PacienteSidebar />} {/* sidebar exclusiva */}
      <div className="main-area">
        {children}
        {isMobile && <BottomMenu />}
      </div>
    </div>
  );
}
