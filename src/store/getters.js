 import Song from "common/js/song"

export const singer=state=>state.singer

export const disc = state => state.disc

export const playing = state => state.playing

export const playlist = state => state.playlist

export const fullScreen = state => state.fullScreen

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state)=> {
    return state.playlist[state.currentIndex] || {}
}

export const topList =state =>state.topList

export const searchHistory = state => state.searchHistory
//播放记录
export const playHistory = (state) => {
  return state.playHistory.map((song) => {
    return new Song(song)
  })
}
//收藏记录
export const favoriteList = (state) => {
  return state.favoriteList.map((song) => {
    return new Song(song)
  })
}