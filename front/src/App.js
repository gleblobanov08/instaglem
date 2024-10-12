import Pages from "./pages/Pages";
import { BrowserRouter } from "react-router-dom";
import AppContext from "./context/AppContext";

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <Pages></Pages>
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
