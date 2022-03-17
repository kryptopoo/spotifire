// const ORBITDB_STORE_SONG = 'spotifire.songs';
// const ORBITDB_STORE_ALBUM = 'spotifire.albums';
// const ORBITDB_STORE_ARTIST = 'spotifire.artists';
// const ORBITDB_STORE_NEWS = 'spotifire.news';
// const ORBITDB_STORE_PLAYLIST = 'spotifire.playlists';
// const ORBITDB_STORE_PLAYLIST_SONG = 'spotifire.playlistsongs';
// const ORBITDB_STORE_LIKED_SONG = 'spotifire.likedsongs';

const ORBITDB_STORE_SONG = '/orbitdb/zdpuAwjSzg3dFPC9h3W3WuRLqQ1EtZ8sR8LAjMvjWQXEgZ49e/spotifire.songs';
const ORBITDB_STORE_ALBUM = '/orbitdb/zdpuAwzJxqjFe6Wzzvn6wfk9kvKLDGsuq14bnh31X1Rpm7UWn/spotifire.albums';
const ORBITDB_STORE_ARTIST = '/orbitdb/zdpuAvVJVPqaeQrQUEMCkkJcKu4o24Z3qBq9Qt4pWfK7f5pga/spotifire.artists';
const ORBITDB_STORE_NEWS = '/orbitdb/zdpuAxo6BkLMTWWzN843m5f7sDVS4ZeaPGTPdhJhrvkULJRp6/spotifire.news';
const ORBITDB_STORE_PLAYLIST = '/orbitdb/zdpuAtdLPAKCLyoZaXp9pJ2irmTot72RTgAMjsiRjcWScWHFB/spotifire.playlists';
const ORBITDB_STORE_PLAYLIST_SONG = '/orbitdb/zdpuAyNMGnHKTfDCCCTnjPTkmiUfEpiRyW9qgVKfTZEnXotnw/spotifire.playlistsong';
const ORBITDB_STORE_LIKED_SONG = '/orbitdb/zdpuB112LU1Gekcx2XcPvZ6omGUS8u47myFbhLzwabxp5UNyy/spotifire.likedsongs';

// # # PC
// # songStore /orbitdb/zdpuB2gLnpgHuzftc1UAgXvwLY5HK2CUFsYGwgtFa1d5h12QA/spotifire.songs
// # albumStore /orbitdb/zdpuAofvyagfUM1pDyvbb2HcHKKciT8nbQ3nCHmQmJtka4oBr/spotifire.albums
// # artistStore /orbitdb/zdpuAuArb6DCnx45XX7FpJEU6SkbDxsnd992ezfczP3orFyB6/spotifire.artists
// # newsStore /orbitdb/zdpuAza5M2weMTqFHDSyhruKdkcEqPzP9EXoprxmh1HfoLWLr/spotifire.news
// # playlistsStore /orbitdb/zdpuAzsono9RSt9QmPFZZBRtTNwD9A9Dbsuuu6awLCoSxPuFP/spotifire.playlists
// # playlistsongsStore /orbitdb/zdpuAwLaPchghjUCwdn5gGrLNaa1itMroVaNQri7CyRyD5LVj/spotifire.playlistsongs

//  PC LASTEST
// songStore /orbitdb/zdpuAwjSzg3dFPC9h3W3WuRLqQ1EtZ8sR8LAjMvjWQXEgZ49e/spotifire.songs
// albumStore /orbitdb/zdpuAwzJxqjFe6Wzzvn6wfk9kvKLDGsuq14bnh31X1Rpm7UWn/spotifire.albums
// artistStore /orbitdb/zdpuAvVJVPqaeQrQUEMCkkJcKu4o24Z3qBq9Qt4pWfK7f5pga/spotifire.artists
// newsStore /orbitdb/zdpuAxo6BkLMTWWzN843m5f7sDVS4ZeaPGTPdhJhrvkULJRp6/spotifire.news
// playlistsStore /orbitdb/zdpuAtdLPAKCLyoZaXp9pJ2irmTot72RTgAMjsiRjcWScWHFB/spotifire.playlists
// playlistsongsStore /orbitdb/zdpuAyNMGnHKTfDCCCTnjPTkmiUfEpiRyW9qgVKfTZEnXotnw/spotifire.playlistsong

const ipfsConfig = {
    repo: '/orbitdb/spotifire',
    start: true,
    preload: {
        enabled: true
    },
    EXPERIMENTAL: {
        pubsub: true
    },
    config: {
        Addresses: {
            Swarm: [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
            ]
        }
    }
};

class DatastoreService {
    ipfsId;
    songStore;
    albumStore;
    artistStore;
    newsStore;
    playlistStore;
    playlistsongStore;
    likedSongStore;

    static async initOrbitDB() {
        try {
            const ipfs = await Ipfs.create(ipfsConfig);
            console.log('ipfs id', await ipfs.id());
            //console.log("OrbitDB", OrbitDB);

            const orbitdb = await OrbitDB.createInstance(ipfs);
            this.ipfsId = orbitdb.id;
            console.log('orbitdb', orbitdb);

            // define stores
            this.songStore = await orbitdb.docstore(ORBITDB_STORE_SONG, { sync: true, indexBy: 'title' });
            console.log('songStore', this.songStore.address.toString());

            this.albumStore = await orbitdb.docstore(ORBITDB_STORE_ALBUM, { sync: true, indexBy: 'title' });
            console.log('albumStore', this.albumStore.address.toString());

            this.artistStore = await orbitdb.docstore(ORBITDB_STORE_ARTIST, { sync: true, indexBy: 'name' });
            console.log('artistStore', this.artistStore.address.toString());

            this.newsStore = await orbitdb.docstore(ORBITDB_STORE_NEWS, { sync: true });
            console.log('newsStore', this.newsStore.address.toString());

            this.playlistStore = await orbitdb.docstore(ORBITDB_STORE_PLAYLIST, { sync: true, indexBy: 'name' });
            console.log('playlistsStore', this.playlistStore.address.toString());

            this.playlistsongStore = await orbitdb.docstore(ORBITDB_STORE_PLAYLIST_SONG);
            console.log('playlistsongsStore', this.playlistsongStore.address.toString());

            this.likedSongStore = await orbitdb.keyvalue(ORBITDB_STORE_LIKED_SONG);
            console.log('likedSongStore', this.likedSongStore.address.toString());

            // // // load
            // await this.albumStore.load();
            // await this.artistStore.load();
            // await this.newsStore.load();
            // await this.playlistStore.load();
            // await this.playlistsongStore.load();
            // await this.likedSongStore.load();

            // get all
            await this.songStore.load();
            console.log('all songs', this.songStore.get(''));

            await this.albumStore.load();
            console.log('all albums', this.albumStore.get(''));

            await this.artistStore.load();
            console.log('all artists', this.artistStore.get(''));

            await this.newsStore.load();
            console.log('all news', this.newsStore.get(''));

            await this.playlistStore.load();
            console.log('all playlists', this.playlistStore.get(''));

            await this.playlistsongStore.load();
            console.log('all playlist songs', this.playlistsongStore.get(''));

            await this.likedSongStore.load();
            console.log('all liked songs', this.likedSongStore.all);

            this.logEvents(ipfs, this.likedSongStore);
        } catch (e) {
            console.log('err', e);
        }
    }

    static logEvents(ipfs, db) {
        db.events.on('ready', async () => {
            console.log('ready', db);
            await this.consoleLogEvent(ipfs, db);
        });
        db.events.on('replicated', async() => {
            console.log('replicated', db);
            await this.consoleLogEvent(ipfs, db);
        });
        db.events.on('write', async() => {
            console.log('write', db);
            await this.consoleLogEvent(ipfs, db);
        });
        db.events.on('replicate.progress', async() => {
            console.log('replicate.progress', db);
            await this.consoleLogEvent(ipfs, db);
        });
    }

    static async consoleLogEvent(ipfs, db) {
        const networkPeers = await ipfs.swarm.peers();
        console.log('network peers', networkPeers);
        const databasePeers = await ipfs.pubsub.peers(db.address.toString());
        console.log('databasePeers', databasePeers);
    }

    static getSongs(genre, creator) {
        var result = [];
        if (genre && creator) {
            result = this.songStore.query((e) => e.genre == genre.toLowerCase() && e.creator == creator);
        } else {
            if (genre) result = this.songStore.query((e) => e.genre == genre.toLowerCase());
            if (creator) result = this.songStore.query((e) => e.creator == creator);
        }
        return result;
    }

    static async createSong(song) {
        await this.songStore.put(song);

        var newSongs = this.newsStore.query((p) => p.type == 'song');
        if (newSongs.length > 5) {
            let replaceNewSong = newSongs[0];
            newSongs.forEach((newSong) => {
                if (newSong.created < replaceNewSong) {
                    replaceNewSong = newSong;
                }
            });

            let delSong = await this.newsStore.del(replaceNewSong._id);
            console.log('del song', delSong);
        }
        await this.newsStore.put({
            _id: song._id,
            type: 'song',
            object: song,
            created: Math.round(Date.now())
        });
    }

    static getAlbums(genre, creator) {
        var result = [];
        if (genre && creator) {
            result = this.albumStore.query((e) => e.genre == genre.toLowerCase() && e.creator == creator);
        } else {
            if (genre) result = this.albumStore.query((e) => e.genre == genre.toLowerCase());
            if (creator) result = this.albumStore.query((e) => e.creator == creator);
        }
        return result;
    }

    static getAlbumById(id) {
        var result = [];
        result = this.albumStore.query((e) => e._id == id);
        return result.length > 0 ? result[0] : null;
    }

    static searchSongs(titleWords, artistWords) {
        var result = [];

        // search by title
        titleWords.forEach((word) => {
            var searchItems = this.songStore.get(word);
            searchItems.forEach((item) => {
                result.indexOf(item) === -1 && result.push(item);
            });
        });

        // search by artirt
        if (artistWords.length > 0) {
            var artists = this.searchArtists(artistWords);
            console.log('search artist', artists);

            artists.forEach((artist) => {
                var searchItems = this.songStore.query((p) => p.artist.id == artist.id);
                searchItems.forEach((item) => {
                    result.indexOf(item) === -1 && result.push(item);
                });
            });
        }

        return result;
    }

    static searchAlbums(titleWords, artistWords) {
        var result = [];

        // search by title
        titleWords.forEach((word) => {
            var searchItems = this.albumStore.get(word);
            searchItems.forEach((item) => {
                result.indexOf(item) === -1 && result.push(item);
            });
        });

        // search by artirt
        if (artistWords.length > 0) {
            var artists = this.searchArtists(artistWords);
            console.log('search artist', artists);

            artists.forEach((artist) => {
                var searchItems = this.albumStore.query((p) => p.artist.id == artist.id);
                searchItems.forEach((item) => {
                    result.indexOf(item) === -1 && result.push(item);
                });
            });
        }

        return result;
    }

    static searchPlaylists(titleWords) {
        var result = [];

        // search by title
        titleWords.forEach((word) => {
            var searchItems = this.playlistStore.get(word);
            searchItems.forEach((item) => {
                result.indexOf(item) === -1 && result.push(item);
            });
        });

        return result;
    }

    static searchArtists(words) {
        var result = [];
        words.forEach((word) => {
            var searchItems = this.artistStore.get(word);
            searchItems.forEach((item) => {
                result.indexOf(item) === -1 && result.push(item);
            });
        });
        return result;
    }

    static async createAlbum(album) {
        await this.albumStore.put(album);

        var newAlbums = this.newsStore.query((p) => p.type == 'album');
        if (newAlbums.length > 5) {
            let replaceNewAlbum = newAlbums[0];
            newAlbums.forEach((newAlbum) => {
                if (newAlbum.created < replaceNewAlbum) {
                    replaceNewAlbum = newAlbum;
                }
            });

            let delAlbum = await this.newsStore.del(replaceNewAlbum._id);
            console.log('delAlbum', delAlbum);
        }
        await this.newsStore.put({
            _id: album._id,
            type: 'album',
            object: album,
            created: Math.round(Date.now())
        });
    }

    static getArtists(name) {
        var artists = this.artistStore.get(name);
        return artists;
    }

    static async createArtist(artist) {
        await this.artistStore.put(artist);
    }

    static getNews(type) {
        var news = this.newsStore.query((e) => e.type == type);
        return news;
    }

    static async createPlaylist(playlist) {
        await this.playlistStore.put(playlist);
    }

    static async addToPlaylist(song, playlistId, creator) {
        var addSong = {
            _id: `playlistId|${song._id}`,
            playlistId: playlistId,
            song: song,
            created: Math.round(Date.now()),
            creator: creator
        };
        await this.playlistsongStore.put(addSong);
    }

    static getPlaylists(creator) {
        var playlists = this.playlistStore.query((e) => e.creator == creator);
        return playlists;
    }

    static getPlaylistById(id) {
        var playlists = this.playlistStore.query((e) => e._id == id);
        return playlists.length > 0 ? playlists[0] : null;
    }

    static getPlaylistSongs(playlistId) {
        var songs = [];
        var playlistSongs = this.playlistsongStore.query((e) => e.playlistId == playlistId);
        playlistSongs.forEach((ps) => {
            songs.push(ps.song);
        });

        return songs;
    }

    static getLikedSongs(walletAddress) {
        var likedSongs = this.likedSongStore.get(walletAddress);
        return likedSongs;
    }

    static async addLikeSong(walletAddress, song) {
        delete song.playing;
        var likedSongs = this.likedSongStore.get(walletAddress);
        if (likedSongs) {
            likedSongs.push(song);
            await this.likedSongStore.set(walletAddress, likedSongs);
        } else {
            await this.likedSongStore.put(walletAddress, [song]);
        }

        return likedSongs;
    }

    static async removeLikeSong(walletAddress, song) {
        var likedSongs = this.likedSongStore.get(walletAddress);
        if (likedSongs) {
            likedSongs = likedSongs.filter((likeSong) => {
                return likeSong._id != song._id;
            });
            await this.likedSongStore.set(walletAddress, likedSongs);
        }

        return likedSongs;
    }
}
