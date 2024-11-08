// page.js
import React from 'react';
// import styles from './style.module.css';
import Head from 'next/head';
import Script from 'next/script';
import Canvas from './components/Canvas';
import IntroModal from './components/IntroModal';
import MoveControls from './components/MoveControls';
import ObjBoundingBox from './components/ObjBoundingBox';
import RoomTools from './components/RoomTools';
import Sidebar from './components/Sidebar';
import TextEditorModal from './components/TextEditorModal';
import WallTools from './components/WallTools';
import ZoomControls from './components/ZoomControls';


export default function Page() {
  return (
    <div style={{ background: '#f2eee5', margin: 0, padding: 0 }}>
      {/* Head 설정 */}
      <Head>
        <title>My Next.js App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
          integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
          integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* 로컬 CSS 파일 */}
        <link rel="stylesheet" href="/css/style.css" />
      </Head>

      {/* Script 설정 */}
      <Script
        src="https://code.jquery.com/jquery-3.6.1.slim.min.js"
        integrity="sha256-w8CvhFs7iHNVUtnSP0YKEg00p9Ih13rlL9zGqvLdePA="
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"
        integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk"
        crossOrigin="anonymous"
      />
      <Script src="mousewheel.js" />
      <Script src="func.js" />
      <Script src="qSVG.js" />
      <Script src="editor.js" />
      <Script src="engine.js" />

      {/* Canvas 컴포넌트 */}
      <Canvas />
      <IntroModal/>
      <MoveControls/>
      <ObjBoundingBox/>
      <RoomTools/>
      <Sidebar />
      <TextEditorModal />
      <WallTools />
      <ZoomControls />
    </div>
  );
}
