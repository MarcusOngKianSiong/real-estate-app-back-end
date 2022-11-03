const ImageKit = require('imagekit')

const imageKit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/uhtx1amtt',
    publicKey: 'public_k0o7zbOkiFy8QSCxNMDgntAvLxg=',
    privateKey: 'private_aaCdEQaDC8kj1gIDzJsxxgnWeFE='
}) 

const imageKitAuthentication = () => {
    const authenticationParameters = imageKit.getAuthenticationParameters();
    return authenticationParameters
}

const deleteImage = async (imageName) => {
    await imageKit.deleteFile(imageName,(err,result)=>{
        if(err){
            console.log("CHECK IMAGE DELETE: -> fail -> ") 
            return false;
        }else{
            console.log("CHECK IMAGE DELETE: -> Pass -> ")
            return true;
        }
    })
}

module.exports = {imageKitAuthentication,deleteImage}
