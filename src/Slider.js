import React from "react";
import "./SliderCss.css";
import { useState, useEffect } from "react";
import { PlayersData } from "./data";
const Slider = () => {
  const [player, setPlayer] = useState(PlayersData[0]);
  const Timer = setTimeout(() => {
    console.log("SLIDER");

    setPlayer((prev) => {
      if (player.id === 2) {
        return PlayersData[0];
      } else {
        return PlayersData[player.id + 1];
      }
    });
  }, 2000);
  useEffect(() => {
    return () => clearTimeout(Timer);
  });

  return (
    <div className="slider-container">
      <img src={player.img} alt={player.name} />

      <div>
        <p>The Myth of “Secure” Blockchain Voting</p>
        <br></br>
        <p>
          In the last couple of years several startup companies have begun to
          promote Internet voting systems, this time with a new twist – using a
          blockchain as the container for voted ballots transmitted from voters’
          private devices. Blockchains are a relatively new system category
          somewhat akin to a distributed database. Proponents promote them as a
          revolutionary innovation providing strong security guarantees that can
          render online elections safe from cyberattack.
        </p>

        <p>
          In this Decenterlized-App, you can vote for your favorite soccer
          player. Wouldn’t it be nice to be allowed to vote using a secure
          online platform that provides transparency into elections results?
        </p>
        <br></br>
        <p>
          This DApp has created end-to-end verifiable online voting software
          that is open-source and truly revolutionary.
        </p>
      </div>
    </div>
  );
};

export default Slider;
