import { SpinPickProvider } from "./context/SpinPickContext";
import SpinPickApp from "./components/SpinPickApp";

export default function App() {
  return (
    <SpinPickProvider>
      <SpinPickApp />
    </SpinPickProvider>
  );
}
