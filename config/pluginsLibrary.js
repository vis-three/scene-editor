const publicPath = 'https://shiotsukikaedesari.gitee.io/mmddisplaydevice/'
module.exports = {
  skyBox: {
    name: 'skyBox',
    desp: '天空盒',
    icon: '#icon-yonghu',
    show: true,
    children: {
      pisa: {
        name: 'pisa',
        desp: '土屋',
        poster: `${publicPath}texture/envMap/pisa/poster.png`,
        file: `${publicPath}texture/envMap/pisa`
      },
      starCloud: {
        name: 'starCloud',
        desp: '星云',
        poster: `${publicPath}texture/envMap/starCloud/poster.jpg`,
        file: `${publicPath}texture/envMap/starCloud`
      },
    }
  }
}
