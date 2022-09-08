import {blobToURL, fromURL} from "image-resize-compress";

class Image {
  constructor(originalUri, originalHeight = '300px', originalWidth = '200px', loading = 'lazy') {
    this.original = originalUri;
    this.originalHeight = originalHeight;
    this.originalWidth = originalWidth;
    this.loading = loading;

    (async () => {
      this.thumbnail = await this.convert2Thumbnail(this.original)
    })();
  }
  convert2Thumbnail = async (sourceUrl) => {
    // quality value for webp and jpeg formats.
    const quality = 80;
    // output width. 0 will keep its original width and 'auto' will calculate its scale from height.
    const width = 100;
    // output height. 0 will keep its original height and 'auto' will calculate its scale from width.
    const height = 'auto';
    // file format: png, jpeg, bmp, gif, webp. If null, original format will be used.
    const format = 'webp';
    // note only the sourceUrl argument is required
    let blob = await fromURL(sourceUrl, quality, width, height, format);
    return await blobToURL(blob);
  };

}

export {Image};
