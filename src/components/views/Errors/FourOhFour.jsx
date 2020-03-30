// React imports
import React from "react";
import treePic from "../../../assets/images/404error.png";

const FourOhFour = () => {
  return (
    <header>
      <img src={treePic} alt="A tree in Science Quad" />
      <h1 style={{ color: "green" }}>Whoops! Page not found!</h1>
      <p style={{ fontFamily: "Arial" }}>
        {" "}
        404. Entertain yourself by finding the man in the tree!{" "}
      </p>
    </header>
  );
};

export default FourOhFour;
