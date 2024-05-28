import { Outlet } from "react-router-dom";
import { NavBar } from "./navigation";

export function RootLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
