'use client';
import { useState } from 'react';

export default function RoomTools() {
 const [roomData, setRoomData] = useState({
   background: 'gradientNeutral',
   index: '',
   surface: '',
   name: '',
   label: '0'
 });

 // 색상 데이터
 const colors = [
   { type: 'gradientRed', gradient: 'linear-gradient(30deg, #f55847, #f00)' },
   { type: 'gradientYellow', gradient: 'linear-gradient(30deg,#e4c06e, #ffb000)' },
   { type: 'gradientGreen', gradient: 'linear-gradient(30deg,#88cc6c, #60c437)' },
   { type: 'gradientSky', gradient: 'linear-gradient(30deg,#77e1f4, #00d9ff)' },
   { type: 'gradientBlue', gradient: 'linear-gradient(30deg,#4f72a6, #284d7e)' },
   { type: 'gradientGrey', gradient: 'linear-gradient(30deg,#666666, #aaaaaa)' },
   { type: 'gradientWhite', gradient: 'linear-gradient(30deg,#fafafa, #eaeaea)' },
   { type: 'gradientOrange', gradient: 'linear-gradient(30deg, #f9ad67, #f97f00)' },
   { type: 'gradientPurple', gradient: 'linear-gradient(30deg,#a784d9, #8951da)' },
   { type: 'gradientPink', gradient: 'linear-gradient(30deg,#df67bd, #e22aae)' },
   { type: 'gradientBlack', gradient: 'linear-gradient(30deg,#3c3b3b, #000000)' },
   { type: 'gradientNeutral', gradient: 'linear-gradient(30deg,#e2c695, #c69d56)' }
 ];

 // 재질 데이터
 const materials = [
   { type: 'wood', url: '/placeholder-wood.jpg' },
   { type: 'tiles', url: '/placeholder-tiles.jpg' },
   { type: 'granite', url: '/placeholder-granite.jpg' },
   { type: 'grass', url: '/placeholder-grass.jpg' }
 ];

 return (
   <div id="roomTools" className="bg-white shadow-md fixed top-0 w-[200px] h-screen p-3.5 z-10 text-sm hidden">
     <span className="text-[#0088dd]">Home Rough Editor</span> estimated a surface of :<br />
     <b><span className="size"></span></b>
     
     <div className="mt-4">
       <p>If you have the actual area, you can write it</p>
       <div className="flex">
         <input 
           type="text" 
           className="flex-1 border rounded-l px-2 py-1"
           id="roomSurface" 
           placeholder="real surface" 
         />
         <span className="bg-gray-100 px-2 py-1 border rounded-r">m²</span>
       </div>
     </div>

     <input type="hidden" id="roomName" />

     <div className="mt-4">
       <label>Wording:</label>
       <select 
         className="w-full mt-1 border rounded p-1"
         id="roomLabel"
         value={roomData.label}
         onChange={(e) => setRoomData(prev => ({...prev, label: e.target.value}))}
       >
         <option value="0">None</option>
         <option value="1">Lounge</option>
         <option value="2">Lunchroom</option>
         {/* ... 다른 옵션들 ... */}
       </select>
     </div>

     <div className="mt-4 space-y-2">
       <p>Meter:</p>
       <div className="space-y-2">
         <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
           <input 
             type="checkbox"
             name="roomShow"
             value="showSurface"
             id="seeArea"
             defaultChecked
             className="mr-2"
           />
           Show the surface
         </label>

         <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
           <input 
             type="radio"
             name="roomAction"
             id="addAction"
             value="add"
             defaultChecked
             className="mr-2"
           />
           Add the surface
         </label>

         <label className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
           <input 
             type="radio"
             name="roomAction"
             id="passAction"
             value="pass"
             className="mr-2"
           />
           Ignore the surface
         </label>
       </div>
     </div>

     <hr className="my-4" />

     <div className="space-y-4">
       <p>Colors</p>
       <div className="grid grid-cols-4 gap-2">
         {colors.map((color) => (
           <div
             key={color.type}
             className="h-9 w-9 rounded cursor-pointer transform hover:scale-110 transition-transform hover:border hover:border-gray-700"
             data-type={color.type}
             style={{ background: color.gradient }}
           />
         ))}
       </div>

       <p>Materials</p>
       <div className="grid grid-cols-4 gap-2">
         {materials.map((material) => (
           <div
             key={material.type}
             className="h-9 w-9 rounded cursor-pointer transform hover:scale-110 transition-transform hover:border hover:border-gray-700"
             data-type={material.type}
             style={{ 
               backgroundImage: `url(${material.url})`,
               backgroundSize: 'cover'
             }}
           />
         ))}
       </div>
     </div>

     <div className="mt-8 space-y-2">
       <input type="hidden" id="roomBackground" value={roomData.background} />
       <input type="hidden" id="roomIndex" value={roomData.index} />
       
       <button 
         className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
         id="applySurface"
       >
         Apply
       </button>
       
       <button 
         className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
         id="resetRoomTools"
       >
         Cancel
       </button>
     </div>

     <style jsx>{`
       @keyframes myAnim {
         0% { stroke-width: 0 }
         50% { stroke-width: 8 }
         100% { stroke-width: 0 }
       }
       
       @keyframes myAnim2 {
         0% { stroke-width: 4 }
         50% { stroke-width: 7 }
         100% { stroke-width: 4 }
       }
     `}</style>
   </div>
 );
}