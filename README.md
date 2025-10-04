This is a pluing for openwebrx to overlay local ADS-B data from FlightAware local reciever.


<img width="1444" height="871" alt="image" src="https://github.com/user-attachments/assets/7fc05d95-7cdc-457c-b49a-8340938a285a" />

1. Must edit adsb_overlay.js file for your adsb reciever
   the http://xxx:8080/skyaware/data/aircraft.json
   must show your recievers file.
   


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


   

