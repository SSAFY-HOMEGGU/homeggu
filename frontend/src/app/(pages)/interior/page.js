// "use client";

// import React from "react";
// import { useReactPlanner } from "./hooks/useReactPlanner";
// import { Provider } from "react-redux";
// import dynamic from "next/dynamic";

// const ReactPlanner = dynamic(
//   () => import("../../../../react-planner/es/ReactPlanner"),
//   {
//     ssr: false,
//     loading: () => <div>Loading planner components...</div>,
//   }
// );

// const InteriorPage = () => {
//   const { components, windowSize, stateExtractor, isReady } = useReactPlanner();
//   const [mounted, setMounted] = React.useState(false);

//   React.useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return <div>Loading...</div>;
//   }

//   if (!isReady || !components) {
//     return <div>Initializing planner components...</div>;
//   }

//   console.log("Rendering InteriorPage with components:", !!components);

//   return (
//     <Provider store={components.store}>
//       <div style={{ height: "100vh" }}>
//         <ReactPlanner
//           catalog={components.catalog}
//           width={windowSize.width}
//           height={windowSize.height - 50}
//           translator={components.translator}
//           stateExtractor={stateExtractor}
//           plugins={[]}
//           customContents={components.customContents}
//           toolbarButtons={[]}
//           sidebarComponents={[]}
//         />
//       </div>
//     </Provider>
//   );
// };

// export default InteriorPage;
import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}
