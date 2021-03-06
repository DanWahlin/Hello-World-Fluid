/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { SharedMap } from "@fluidframework/map";
import TinyliciousClient from "@fluid-experimental/tinylicious-client";

/**
 * This function imitates a file system. It allows us to create durable IDs for containers so we can access them later.
 * The ID is the number after the hash in the URL.
 * In a production system, we may store the list of container ID's in another database.
 */
const getContainerId = () => {
    let isNew = false;
    if (window.location.hash.length === 0) {
        isNew = true;
        window.location.hash = Date.now().toString();
    }
    const containerId = window.location.hash.substring(1);
    return { containerId, isNew };
};

const { containerId, isNew } = getContainerId();
const serviceConfig = { id: containerId };

const containerSchema = {
    name: 'cra-demo-container',
    initialObjects: { mySharedMap: SharedMap }
};

TinyliciousClient.init();

const getFluidData = async () => {

    const [fluidContainer, ] = isNew
        ? await TinyliciousClient.createContainer(serviceConfig, containerSchema)
        : await TinyliciousClient.getContainer(serviceConfig, containerSchema);

    return fluidContainer.initialObjects;
}

function App() {
    const [fluidData, setFluidData] = React.useState();

    React.useEffect(() => {
        getFluidData().then(data => setFluidData(data))
    }, []);

    const [viewData, setViewData] = React.useState();

    React.useEffect(() => {
        if (!fluidData) return;

        const { mySharedMap } = fluidData;

        const syncView = () => setViewData({ time: mySharedMap.get("time") });
        
        // ensure sync runs at least once
        syncView();

        // update state each time our map changes
        mySharedMap.on("valueChanged", syncView);
        return () => { mySharedMap.off("valueChanged", syncView) }

    }, [fluidData])

    const setTime = () => fluidData.mySharedMap.set("time", Date.now().toString());

    return (
        <div>
            <button onClick={setTime}> click </button>
            <span> {viewData ? viewData.time : "undefined"}</span>
        </div>
    )
}

export default App;

