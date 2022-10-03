import React, { useState } from 'react';
import ButtonUnavailable from "./ButtonUnavailable";

let RemoteButton;

const App = () => {
  const [available, setAvailable] = useState(false)
  const [reload, setReload] = useState(false);

  const loadRemote = async () => {
    const module = await import('app2/App2Button')
      .catch((e) => {
        setAvailable(false);
      });

      if(module) {
      RemoteButton = module.default;
      setAvailable(true);
    }
  };

  loadRemote();

  return <div>
    <h2>App 1</h2>
    <div>
      { available ? <RemoteButton />: <ButtonUnavailable  reload={reloadBtn} />}
    </div>
  </div>

  function reloadBtn() {
    /**
     * Note: During testing it seemed necessary to invoke loadRemote at least twice
     * This may happen in dev because render is invoked multiple times when reload is changed
     * Usually because strict mode is used. Which is not the case in this demo, and it still
     * has multiple passes.
     */
    setReload(!reload); // Force a re-render
  }

};

export default App;
