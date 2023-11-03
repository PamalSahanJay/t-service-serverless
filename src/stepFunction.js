module.exports.getFileType = async (event) => {

    let fileName = event.s3.object.key;
    let index = fileName.lastIndexOf('.');
    
    if(index > 0) {
      return fileName.substring(index + 1);
    }
    else {
      return null;
    }

};