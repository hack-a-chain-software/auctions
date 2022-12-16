import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

/**
 * @name Router
 * @description - This is the application router that will have all the app routes!
 * And also some business logic to handle near initialization
 */
function Pages() {
  return (
    <Routes>
      {routes.map(({ path, component }) => (
        <Route path={path} element={component} key={path} />
      ))}
    </Routes>
  );
}

export default Pages;
