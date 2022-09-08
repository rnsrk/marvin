import React from 'react';
import {Image} from "../Image";
import ImageGallery from 'react-image-gallery';


////////////////////
//      Main      //
////////////////////

export const Galary = ({objectData}) => {
  let images =[];
  if (objectData.bilder) {
    for (const imageIndex in objectData.bilder) {
      images.push(new Image(objectData.bilder[imageIndex]));
    }
  }
  return (
    <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showThumbnails={false} disableKeyDown={true}/>
  );
}

export default Galary;
