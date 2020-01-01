import { playMode } from 'common/js/config'

const state = {
  singer: {},
  playing: false,//播放状态
  fullScreen: false,//播放器状态（展开或者收起）
  playlist: [],//播放列表，上一首下一首
  sequenceList: [],//顺序列表，顺序播放
  mode: playMode.sequence,//默认顺序播放
  currentIndex: -1,//当前播放索引
  disc: {},
//   topList: {},
//   searchHistory: loadSearch(),
//   playHistory: [],
//   favoriteList: []
}

export default state