import React, { useEffect, useState, useRef } from "react";
import RegistryView from "./RegistryView.jsx";
import { loadWasm } from "../rust_functions.ts";
import { Tabs, Tab } from "./Tabs.jsx";

import MemoryView from "./MemoryView.jsx";
import Console from "./Console.jsx";
import Controls from "./Controls.jsx";
import Editor from "./Editor.jsx";
import { useSimulator } from "./simulator.ts";
// import { saveFile, loadFile } from "./SaveLoad.jsx";


/*
    This is where the pieces of gui are initialized

    The Code component handles the actual usage of the gui buttons created and applies them to the Tauri app
*/

function Code() {
    const {
        state,
        error,
        exitCode,
        setState,
        setCode,
        setInstructionDelay,
        registerCallback,
        start,
        stop,
        step,
        stepBack,
        load,
        reset,
    } = useSimulator();
    const [wasmLoaded, setWasmLoaded] = useState(false);

    // Create a ref to access the textarea in the Editor component
    const editorRef = useRef(null);

    useEffect(() => {
        loadWasm()
            .then((loaded) => setWasmLoaded(loaded))
            .catch(() => setWasmLoaded(false));
    }, []);

    // Save file functionality
    const saveFile = () => {
        const code = editorRef.current?.value; // Access the textarea value using the ref
        if (!code) {
            alert("No code to save!");
            return;
        }
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "code.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Load file functionality
    const loadFile = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("No file selected!");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (editorRef.current) {
                editorRef.current.value = content; // Set the textarea value using the ref
                setCode(content); // Update the code in the simulator state
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <div className="fill px-4">
                <Controls
                    state={state}
                    setState={setState}
                    start={start}
                    stop={stop}
                    step={step}
                    reset={reset}
                    load={load}
                    error={error}
                    stepBack={stepBack}
                />
                <div className="mt-2 mb-2 row codearea">
                    <div className="w-5/6 h-full pe-4">
                        {/* Pass the ref to the Editor component */}
                        <Editor state={state} setCode={setCode} editorRef={editorRef} />
                    </div>
                    <div className="w-1/6">
                        <RegistryView
                            loaded={wasmLoaded}
                            registerCallback={registerCallback}
                        />
                    </div>
                </div>
                {/* Add Save and Load Buttons */}
                <div className="file-buttons">
                    <button onClick={saveFile} className="save-button">
                        Save Code
                    </button>
                    <button className="load-button">
                        <label>
                            Load Code
                            <input
                                type="file"
                                accept=".txt"
                                onChange={loadFile}
                                className="load-input"
                                style={{ display: "none" }}
                            />
                        </label>
                    </button>
                </div>
            </div>
            <Tabs>
                <Tab label="Console">
                    <div className="fill" id="tabs_console" data-tab-active>
                        <Console
                            loaded={wasmLoaded}
                            registerCallback={registerCallback}
                            exitCode={exitCode}
                            error={error}
                        />
                    </div>
                </Tab>
                <Tab label="Memory Viewer">
                    <div className="fill" id="tabs_memory">
                        <MemoryView
                            loaded={wasmLoaded}
                            registerCallback={registerCallback}
                        />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}

export default Code;
