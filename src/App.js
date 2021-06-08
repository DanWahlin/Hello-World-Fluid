/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";

function App() {
    const [viewData, setViewData] = React.useState();

    return (
        <div>
            <button> click </button>
            <span> {viewData ? viewData.time : "undefined"}</span>
        </div>
    )
}

export default App;

