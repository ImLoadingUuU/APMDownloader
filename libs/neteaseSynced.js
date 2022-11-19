const axios = require("axios")
function getLyrics(id,callback){
    axios({
        method: "GET",
        url: `https://music.163.com/api/song/lyric?id=${id}&lv=1&kv=1&tv=-1`
    }).then((result) => {
     if(result.data.lrc.lyrics){
         return result.data.lrc.lyrics
     }
    }).catch((err) => {

    })
}

function search(text,callback) {

    let query = encodeURIComponent(text)
    axios({
        method: "GET",
        url: `https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${query}&type=1&offset=0&total=true&limit=20`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://music.163.com/",
            "Cookie": "appver=2"
        }

    }).then((result) => {
        console.log(result.data.result)
        callback(result.data.result.songs)
    }).catch((err) => {
        callback({})
    })
}
module.exports = {
    search: search,
    getLyrics: getLyrics
}
