'use client';
import { useState } from 'react';
import { Compass, Plus, Minus, Trash, ArrowLeft } from 'lucide-react';

export default function ObjBoundingBox() {
 const [isStepsVisible, setIsStepsVisible] = useState(false);
 const [isColorVisible, setIsColorVisible] = useState(false);

 const colors = [
   { type: 'gradientRed', color: '#f55847', gradient: 'linear-gradient(30deg, #f55847, #f00)' },
   { type: 'gradientYellow', color: '#e4c06e', gradient: 'linear-gradient(30deg,#e4c06e, #ffb000)' },
   { type: 'gradientGreen', color: '#88cc6c', gradient: 'linear-gradient(30deg,#88cc6c, #60c437)' },
   { type: 'gradientSky', color: '#77e1f4', gradient: 'linear-gradient(30deg,#77e1f4, #00d9ff)' },
   { type: 'gradientBlue', color: '#4f72a6', gradient: 'linear-gradient(30deg,#4f72a6, #284d7e)' },
   { type: 'gradientGrey', color: '#666666', gradient: 'linear-gradient(30deg,#666666, #aaaaaa)' },
   { type: 'gradientWhite', color: '#fafafa', gradient: 'linear-gradient(30deg,#fafafa, #eaeaea)' },
   { type: 'gradientOrange', color: '#f9ad67', gradient: 'linear-gradient(30deg, #f9ad67, #f97f00)' },
   { type: 'gradientPurple', color: '#a784d9', gradient: 'linear-gradient(30deg,#a784d9, #8951da)' },
   { type: 'gradientPink', color: '#df67bd', gradient: 'linear-gradient(30deg,#df67bd, #e22aae)' },
   { type: 'gradientBlack', color: '#3c3b3b', gradient: 'linear-gradient(30deg,#3c3b3b, #000000)' },
   { type: 'gradientNeutral', color: '#e2c695', gradient: 'linear-gradient(30deg,#e2c695, #c69d56)' }
 ];

 return (
   <>
     <div id="objBoundingBox" className="bg-white shadow-md fixed top-0 w-[200px] h-screen p-3.5 z-10 text-sm hidden">
       <h2>Modify object</h2>
       <hr />
       <section id="objBoundingBoxScale">
         <p>Width [<span id="bboxWidthScale"></span>] : <span id="bboxWidthVal"></span> cm</p>
         <input 
           type="range" 
           id="bboxWidth" 
           step="1" 
           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
         />
         <p>Length [<span id="bboxHeightScale"></span>] : <span id="bboxHeightVal"></span> cm</p>
         <input 
           type="range" 
           id="bboxHeight" 
           step="1" 
           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
         />
       </section>

       <section id="objBoundingBoxRotation">
         <p className="flex items-center gap-2">
           <Compass className="w-4 h-4" /> Rotation : <span id="bboxRotationVal"></span> °
         </p>
         <input 
           type="range" 
           id="bboxRotation" 
           step="1" 
           min="-180" 
           max="180" 
           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
         />
       </section>

       <div id="stepsCounter" className={isStepsVisible ? 'block' : 'hidden'}>
         <p>
           <span id="bboxSteps">Nb steps [2-15] : <span id="bboxStepsVal">0</span></span>
         </p>
         <button className="bg-blue-500 p-2 rounded text-white mr-2">
           <Plus className="w-4 h-4" />
         </button>
         <button className="bg-blue-500 p-2 rounded text-white">
           <Minus className="w-4 h-4" />
         </button>
       </div>

       <div id="objBoundingBoxColor" className={isColorVisible ? 'block' : 'hidden'}>
         <div className="grid grid-cols-4 gap-2">
           {colors.map((color) => (
             <div
               key={color.type}
               className="cursor-pointer h-8 rounded"
               data-type={color.type}
               style={{
                 color: color.color,
                 background: color.gradient
               }}
             />
           ))}
         </div>
       </div>

       <div className="mt-8 space-y-4">
         <button className="w-full bg-red-500 text-white p-2 rounded" id="bboxTrash">
           <Trash className="w-8 h-8 mx-auto" />
         </button>
         <button className="w-full bg-blue-500 text-white p-2 rounded mt-24">
           <ArrowLeft className="w-8 h-8 mx-auto" />
         </button>
       </div>
     </div>

     <div id="objTools" className="bg-white shadow-md fixed top-0 w-[200px] h-screen p-3.5 z-10 text-sm hidden">
       <h2>Modify door/window</h2>
       <hr />
       <ul className="list-none mt-8 space-y-4">
         <li>
           <button className="w-full bg-gray-100 p-2 rounded shadow" id="objToolsHinge">
             Reverse hinges
           </button>
         </li>

         <li>
           <p>Width [<span id="doorWindowWidthScale"></span>] : <span id="doorWindowWidthVal"></span> cm</p>
           <input 
             type="range" 
             id="doorWindowWidth" 
             step="1" 
             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
           />
         </li>

         <li>
           <button className="w-full bg-red-500 text-white p-2 rounded">
             <Trash className="w-8 h-8 mx-auto" />
           </button>
         </li>

         <li>
           <button className="w-full bg-blue-500 text-white p-2 rounded mt-24">
             <ArrowLeft className="w-8 h-8 mx-auto" />
           </button>
         </li>
       </ul>
     </div>

     <style jsx>{`
       input[type=range]::-webkit-slider-thumb {
         -webkit-appearance: none;
         height: 20px;
         width: 16px;
         border-radius: 3px;
         background: #ffffff;
         border: 1px solid #000000;
         cursor: pointer;
         margin-top: -7px;
       }

       input[type=range]::-moz-range-thumb {
         height: 20px;
         width: 16px;
         border-radius: 3px;
         background: #ffffff;
         border: 1px solid #000000;
         cursor: pointer;
       }

       input[type=range]::-ms-thumb {
         height: 20px;
         width: 16px;
         border-radius: 3px;
         background: #ffffff;
         border: 1px solid #000000;
         cursor: pointer;
       }
     `}</style>
   </>
 );
}