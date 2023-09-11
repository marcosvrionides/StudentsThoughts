import React, { lazy, Suspense} from "react";

const GroupMessages = lazy(() => import('./GroupMessages'));

const LazyLoadingGroupMessages = (props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GroupMessages  groupID={props.groupID} />
        </Suspense>
    )
}

export default LazyLoadingGroupMessages;