import React from 'react'
import MapComponent from './MapComponent'

export default function MapModal({ address, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">거래희망 지역</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <MapComponent address={address} />
      </div>
    </div>
  )
}
