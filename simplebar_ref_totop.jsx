import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import SimpleBarReact from "simplebar-react";

import "simplebar/src/simplebar.css";

function App() {
  const scrollableNodeRef = useRef();
  const ref = useRef();

  useEffect(() => {
    setTimeout(function() {
      console.log(scrollableNodeRef.current, ref);
      console.log(scrollableNodeRef.current.scrollTop);
      scrollableNodeRef.current.scrollTop = 200;
      //ref.getScrollElement().scrollTop = 100;
      //scrollableNodeRef.current.
      // scrollableNodeRef.current.scrollTo({
      //   y: 1000,
      //   x: 500,
      //   behavior: "smooth"
      // });
      //ref.scrollY(100);
    }, 1000);
  }, [scrollableNodeRef]);
  return (
    <div className="App">
      <h1>SimpleBar React</h1>
      <SimpleBarReact
        style={{ maxHeight: 300 }}
        ref={ref}
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        {[...Array(50)].map((x, i) => (
          <p>{i}</p>
        ))}
      </SimpleBarReact>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
