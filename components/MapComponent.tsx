
import React from 'react';
import type { UserLocation } from '../types';
import { LocationMarkerIcon, ExclamationIcon } from './icons';

interface MapComponentProps {
  location: UserLocation | null;
  error: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ location, error }) => {
  return (
    <div className="w-full h-full bg-gray-300 dark:bg-gray-700 relative overflow-hidden">
      {location ? (
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          title="User Location Map"
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          {error ? (
            <>
              <ExclamationIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Location Error</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-sm">{error}</p>
            </>
          ) : (
            <>
              <LocationMarkerIcon className="h-12 w-12 text-blue-500 mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Acquiring Location...</h3>
              <p className="text-gray-500 dark:text-gray-400">Please wait while we find your position.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
