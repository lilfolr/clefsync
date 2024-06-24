import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { projectListLoader, ProjectList } from "./pages/projects";
import { SongPage } from "./pages/song";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          path="/song"
          element={<SongPage />}
          loader={projectListLoader}
        />
        <Route
          path="/projects"
          element={<ProjectList />}
          loader={projectListLoader}
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
