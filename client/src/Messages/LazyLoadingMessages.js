import React, { lazy, Suspense } from "react";

const Messages = lazy(() => import('./Messages'));

const LazyLoadingMessages = (props) => {

    props.handleSetDelivery && props.handleSetDelivery(true)

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Messages uid={props.uid} read={props.read} />
        </Suspense>
    )
}

export default LazyLoadingMessages;