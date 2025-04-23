import React from "react";
import { STATE } from "./simulator.ts";

function Editor({ state, setCode, editorRef }) {
    return (
        <textarea
            ref={editorRef} // Attach the ref to the textarea
            disabled={state.current !== STATE.IDLE && state.current !== STATE.STOPPED}
            onChange={(e) => setCode(e.currentTarget.value)}
            placeholder="Enter some ezasm code..."
        />
    );
}

export default Editor;