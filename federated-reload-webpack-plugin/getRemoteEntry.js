// This runs at build time and returns a string defining the function that will be invoked at runtime.
const getRemoteEntry = (remote) => {
  let source = `promise new Promise(${getRemote})`;
  return source.replace(/\$remote/g, remote);
}

// This defines the Promise that will be invoked at runtime
const getRemote = async (resolve, reject) => {
  const remotes = await fetch("./assets/remotes.json", {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .catch((e) => {
    console.log("Fetch failed for remote urls.", e);
  });
  const json = await remotes.json().catch((e) => {
    console.log("Unable to retrieve remotes.json");
  });

  /*
   * document.location.
   *   protocol = http: includes the colon
   *   host = hostname:port
   *   hostname = domain of the url includes the colon and port
   *   port = port number
   *   pathname = everything after the port
   */

  // Note the $remote in the following is replace in the line (4) above by the value passed as a parameter
  const src = `${document.location.protocol}//${document.location.hostname}${json.$remote}`;
  const script = document.createElement('script')
  script.src = src;

  script.onload = () => {
    const proxy = {
      get: (request) => {
        return window.$remote.get(request)
      },
      init: (arg) => {
        try {
          return window.$remote.init(arg)
        } catch(e) {
          console.log("Remote resource $remote failed to load", e)
        }
      }
    }
    resolve(proxy)
  }

  script.onerror = () => {
    const err = { type: "error", "message": "$remote is unavailable" };
    console.log(err);
    reject(err);
    throw(err);
  }

  document.head.appendChild(script);
}

module.exports = getRemoteEntry;