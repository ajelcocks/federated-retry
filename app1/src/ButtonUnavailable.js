import React from "react";

const ButtonUnavailable = (props) => {
  return <div>
    Remote button is unavailable
    <div><button onClick={props.reload}>Reload</button></div>
  </div>;
}

export default ButtonUnavailable;