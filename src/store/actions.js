import * as types from "./mutation-type"
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utill'
import { saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'
function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id=== song.id
    })
}
export const selectPlay =function ({commit,state},{list,index}){
    //{list,index}传过来的要修改的 值
    commit(types.SET_SEQUENCE_LIST,list)
    //随机播放的歌曲列表
    if(state.mode===playMode.random){
        let randomlist=shuffle(list)
        commit(types.SET_PLAYLIST,randomlist)
        index=findIndex(randomlist,list[index])
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}
export const randomplay=function({commit},{list}){
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let randomlist=shuffle(list)
    commit(types.SET_PLAYLIST,randomlist)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}
export const insertSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
//删除历史记录中的一个
export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
//清除历史记录
export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}
//删除列表中的歌曲
export const deleteSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    //删除后状态切换
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const deleteSongList = function ({ commit }) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}
//播放历史
export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
//点击收藏
export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
//删除收藏
export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}