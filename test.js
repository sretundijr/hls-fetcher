const { getIt } = require('./index');


getIt(
  {
    uri: 'https://player.vimeo.com/external/249414131.m3u8?s=10bf9d088fff85588fdd56dacd5f9f716c1c8dd5',
    cwd: `${process.cwd()}/streams`,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('done');
    }
  }
)
