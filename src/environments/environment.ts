// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'Spotifire',
  appVersion: '0.1.0',
  web3StorageToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxZUU4QzVhM0E2ZDMyRjUwNkVBMTVBZGVhMDFEODM3QmFmMDlGMmYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDcwNTk0NDMxMjcsIm5hbWUiOiJzcG90aWZpcmUifQ._mydq6XA2DoW72ugOqCksSLugkAvqOGIukJxwW3ulW0',
  storeAddesses: {
    // song: '/orbitdb/zdpuB1eWFAB2AHtgPeL21gXS958f9HrR4o35sLYjFnhZrEjGC/spotifire.songs',
    // album: '/orbitdb/zdpuAsUvyNby2RZ7CuihV83pFNcyxcBQitUoTMCK7mCeecdmh/spotifire.albums',
    // artist: '/orbitdb/zdpuAtWhwwWg62YtdAWY7AgSGqBmVnGRUaDRaNYBQAxBqJKaA/spotifire.artists',
    // news: '/orbitdb/zdpuAv5bfV3bt3Be9veSz6wKMRLNrGaa1jk8hSvEpZqugh11C/spotifire.news',
    // playlist: '/orbitdb/zdpuAv6MTuFdyQwPEgnCNNHgRb2qCtSLSjp5wRPwhUTy3pGbw/spotifire.playlists',
    // playlistsongs: '/orbitdb/zdpuAqbiQTGy8sEc26NCqWJSYmMJLax6zBG3oVXMuMPJQvxCj/spotifire.playlistsongs'

    song: 'spotifire.songs',
    album: 'spotifire.albums',
    artist: 'spotifire.artists',
    news: 'spotifire.news',
    playlist: 'spotifire.playlists',
    playlistsongs: 'spotifire.playlistsongs'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
