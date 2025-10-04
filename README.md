This is a pluing for openwebrx to overlay local ADS-B data from FlightAware local reciever.


<img width="1439" height="677" alt="image" src="https://github.com/user-attachments/assets/409b6e32-b6c1-4066-a94c-cad182b9da13" />


2. Files go in map folder of openwebrx in my ubuntu system it is on

   /usr/lib/python3/dist-packages/htdocs/plugins/map/adsb_overlay/

   in adsb_overlay folder we put the files.


   consult https://github.com/0xAF/openwebrxplus-plugins for more info.

3. In order for the ships to be able to show an angle you must edit the file:
   /usr/lib/python3/dist-packages/htdocs# cd /usr/lib/python3/dist-packages/htdocs/map-leaflet.js


   find the lines that are like this:

        await $.getScript('https://cdn.jsdelivr.net/npm/leaflet.geodesic');
        await $.getScript('https://cdn.jsdelivr.net/npm/leaflet-textpath@1.2.3/leaflet.textpath.min.js');

        and add under
        await $.getScript('https://cdn.jsdelivr.net/gh/bbecquet/Leaflet.RotatedMarker/leaflet.rotatedMarker.js');


 if any problems contact me at sv9tnf@gmail.com

   Many 73's !!!


   
   if any problems contact me at sv9tnf@gmail.com

   Many 73's !!!
