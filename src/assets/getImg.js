const images = require.context('./img', false, /\.(png|svg|jpg|gif)$/);

console.log(images);
let imgAssets = {};
function getAllImgs(r) {
    r.keys().forEach(key => {
        return imgAssets[key.replace(/(\.\/|\.(png|jpe?g|svg))/g, '')] = {
            url: r(key)
        }
        
    });
}

getAllImgs(images);
console.log(imgAssets);

export default imgAssets;