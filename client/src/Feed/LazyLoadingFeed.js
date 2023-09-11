import React, { lazy, Suspense} from "react";

const Feed = lazy(() => import('./Feed'));

const LazyLoadingFeed = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Feed />
        </Suspense>
    )
}

export default LazyLoadingFeed;