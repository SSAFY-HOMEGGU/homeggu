'use client';


export default function Canvas() {
 return (
   <div>
     <svg
       id="lin"
       viewBox="0 0 1100 700"
       preserveAspectRatio="xMidYMin slice"
       xmlns="http://www.w3.org/2000/svg"
       className="w-full h-auto"
     >
       <defs>
         {/* Gradients */}
         <linearGradient 
           id="gradientRed" 
           x1="0%" 
           y1="0%" 
           x2="100%" 
           y2="100%" 
           spreadMethod="pad"
         >
           <stop offset="0%" stopColor="#e65d5e" stopOpacity="1" />
           <stop offset="100%" stopColor="#e33b3c" stopOpacity="1" />
         </linearGradient>

         <linearGradient 
           id="gradientYellow" 
           x1="0%" 
           y1="0%" 
           x2="100%" 
           y2="100%" 
           spreadMethod="pad"
         >
           <stop offset="0%" stopColor="#FDEB71" stopOpacity="1" />
           <stop offset="100%" stopColor="#F8D800" stopOpacity="1" />
         </linearGradient>

         <linearGradient 
           id="gradientGreen" 
           x1="0%" 
           y1="0%" 
           x2="100%" 
           y2="100%" 
           spreadMethod="pad"
         >
           <stop offset="0%" stopColor="#88cc6c" stopOpacity="1" />
           <stop offset="100%" stopColor="#60c437" stopOpacity="1" />
         </linearGradient>

         <linearGradient 
           id="gradientSky" 
           x1="0%" 
           y1="0%" 
           x2="100%" 
           y2="100%" 
           spreadMethod="pad"
         >
           <stop offset="0%" stopColor="#77e1f4" stopOpacity="1" />
           <stop offset="100%" stopColor="#00d9ff" stopOpacity="1" />
         </linearGradient>

         <linearGradient 
           id="gradientBlue" 
           x1="0%" 
           y1="0%" 
           x2="100%" 
           y2="100%" 
           spreadMethod="pad"
         >
           <stop offset="0%" stopColor="#4f72a6" stopOpacity="1" />
           <stop offset="100%" stopColor="#284d7e" stopOpacity="1" />
         </linearGradient>

         <linearGradient 
           id="gradientPurple" 
           x1="0%" 
           y1="0%" 
           x2="100%" 
           y2="100%" 
           spreadMethod="pad"
         >
           <stop offset="0%" stopColor="#a784d9" stopOpacity="1" />
           <stop offset="100%" stopColor="#8951da" stopOpacity="1" />
         </linearGradient>

         {/* Patterns */}
         <pattern 
           id="grass" 
           patternUnits="userSpaceOnUse" 
           width="256" 
           height="256"
         >
           <image
             href="/api/placeholder/256/256"  // Next.js의 Image Placeholder API 사용
             x="0"
             y="0"
             width="256"
             height="256"
           />
         </pattern>

         <pattern 
           id="wood" 
           patternUnits="userSpaceOnUse" 
           width="256" 
           height="256"
         >
           <image
             href="/api/placeholder/256/256"
             x="0"
             y="0"
             width="256"
             height="256"
           />
         </pattern>

         <pattern 
           id="tiles" 
           patternUnits="userSpaceOnUse" 
           width="256" 
           height="256"
         >
           <image
             href="/api/placeholder/256/256"
             x="0"
             y="0"
             width="256"
             height="256"
           />
         </pattern>

         <pattern 
           id="grid" 
           patternUnits="userSpaceOnUse" 
           width="40" 
           height="40"
         >
           <path 
             d="M 40 0 L 0 0 0 40" 
             fill="none" 
             stroke="#ccc" 
             strokeWidth="0.5"
           />
         </pattern>
       </defs>

       {/* Grid */}
       <g 
         className="h-[19cm] w-[27cm]" 
         id="boxgrid"
       >
         <rect 
           width="8000" 
           height="5000" 
           x="-3500" 
           y="-2000" 
           fill="url(#grid)" 
         />
       </g>
     </svg>

     <style jsx>{`
       svg {
         max-width: 100%;
         height: auto;
         display: block;
       }

       @media print {
         #lin, #boxgrid {
           height: 19cm;
           width: 27cm;
         }
       }
     `}</style>
   </div>
 );
}