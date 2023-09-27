/**
 * Test whether the image loads
 * @param {string} imageUrl 
 * @param {function} successCallback
 * @param {function} failureCallback 
 */
export const testImage = (imageUrl, successCallback, failureCallback) => {
    const tester = new Image();
    tester.onload = successCallback;
    tester.onerror = failureCallback;
    tester.src = imageUrl
}

/**
 * @param {File} file
 */
export const isImage = (file) => {
    const validImageType = ["image/gif", "image/jpeg", "image/png"];
    return validImageType.includes(file.type)
}

/**
 * @param {string} imageUrl 
 * @returns {Promise<string>}
 */
export const convertFileToBase64 = (imageUrl) => {
    return new Promise(resolve => _convertFileToBase64(imageUrl, resolve));
}

const _convertFileToBase64 = (imageUrl, callback) => {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    ctx.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL("image/png", 0.7);
    callback && callback(dataUrl);
  };

  image.src = imageUrl ;
};