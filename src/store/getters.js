// import Song from "common/js/song"
// import state from "./state"

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