import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RootLayout } from "./layout";
import { projectListLoader, ProjectList } from "./pages/projects";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<RootLayout />} path="/">
        <Route
          path="projects"
          element={<ProjectList />}
          loader={projectListLoader}
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
