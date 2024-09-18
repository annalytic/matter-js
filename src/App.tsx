import { HashRouter, Route, Routes } from "react-router-dom";
import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import styled from "@emotion/styled";
import { useAppSize } from "./hooks/useAppSize";

interface AppContainerProps {
  appHeight: number;
  appWidth: number;
}

const AppContainer = styled.div<AppContainerProps>`
  height: ${(props) => props.appHeight}px;
  width: ${(props) => props.appWidth}px;
  position: relative;
  overflow-y: hidden;
`;

const App = () => {
  const { appHeight, appWidth } = useAppSize();

  return (
    <HashRouter>
      <AppContainer appHeight={appHeight} appWidth={appWidth}>
        <Routes>
          <Route path="/" element={<GameCanvas />} />
        </Routes>
      </AppContainer>
    </HashRouter>
  );
};

export default App;
