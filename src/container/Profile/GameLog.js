import React from "react";
import { Helmet } from "react-helmet-async";

//import { GameLog as GameLogComponent } from "../../component/profile";
import { VerticalPadder } from "../../component/styled";

function GameLogComponent() {
    return null;
}

class GameLog extends React.PureComponent {
  render() {
    return (
      <>
        <Helmet>
          <title>Player game log</title>
        </Helmet>
        <VerticalPadder>
          <GameLogComponent />
        </VerticalPadder>
      </>
    );
  }
}

export default GameLog;
