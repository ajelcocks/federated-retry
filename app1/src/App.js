import React, { createElement, useEffect, useRef, useState } from 'react';
import ButtonUnavailable from "./ButtonUnavailable";

let RemoteButton;

const App = () => {
  const [available, setAvailable] = useState(false)
  const [reload, setReload] = useState(false);

  useEffect(() => {
    debugger;
    import('app2/App2Button')
      .then((module) => {
        if(module) {
          RemoteButton = module.default;
          setAvailable(true);
        }
      })
      .catch((e) => {
        setAvailable(false);
        console.log("Error loading remote Vue sidebar");
      })
  }, [reload]);

  return <div>
    <h2>App 1</h2>
    <div>
      { available ? <RemoteButton />: <ButtonUnavailable  reload={reloadBtn} />}
    </div>
  </div>

  function reloadBtn() {
    setReload(!reload);
  }

};

export default App;
