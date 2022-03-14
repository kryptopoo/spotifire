import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

export interface Song {
    _id: string;
    title: string;
    artist: Artist;
    genre: string;
    duration: number;
    thumbnailUrl: string;
    audioUrl: string;
    created: number;
    creator: string;
}

export interface Album {
    _id: string;
    title: string;
    artist: Artist;
    description: string;
    genre: string;
    thumbnailUrl: string;
    songs: Array<Song>;
    created: number;
    creator: string;
}

export interface Artist {
    _id: string;
    name: string;
    avatarUrl: string;
    created: number;
}

export interface Playlist {
    _id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    created: number;
    creator: string;
}

export interface PlaylistSong {
    _id: string;
    playlistId: string;
    song: Song;
    created: number;
    creator: string;
}

@Injectable({
    providedIn: 'root'
})
export class DatastoreService {
    ipfs: any;
    orbitdb: any;

    songStore: any;
    artistStore: any;
    albumStore: any;
    playlistStore: any;
    genreStore: any;
    likeStore: any;
    newsStore: any;
    playlistsongStore: any;

    constructor() {}

    async init() {
        // console.log('this.ipfs', this.ipfs);
        // console.log('this.orbitdb', this.orbitdb);
        // console.log(this.ipfs != undefined && this.orbitdb != undefined);
        if (this.ipfs != undefined && this.orbitdb != undefined) return;

        // const ipfsOptions = {
        //     EXPERIMENTAL: {
        //         pubsub: true
        //     }
        // };

        // Configuration for IPFS instance
        const ipfsOptions = {
            // preload: { enabled: false }, // Prevents large data transfers
            repo: 'spotifire',
            start: true,
            preload: {
                enabled: false
            },
            EXPERIMENTAL: {
                pubsub: true
            },
            config: {
                // Bootstrap: [
                //     // Leave this blank for now. We'll need it later
                // ],
                Addresses: {
                    Swarm: [
                        // Use IPFS dev signal server
                        // Websocket:
                        // '/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star',
                        // '/dns4/ws-star-signal-2.servep2p.com/tcp/443/wss/p2p-websocket-star',
                        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                        // WebRTC:
                        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
                        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                        '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
                        // Use local signal server
                        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
                    ]
                }
            }
        };

        // // Configuration for the database
        // const dbConfig = {
        //     // If database doesn't exist, create it
        //     create: true,
        //     // Don't wait to load from the network
        //     sync: false,
        //     // Load only the local version of the database
        //     // localOnly: true,
        //     // Allow anyone to write to the database,
        //     // otherwise only the creator of the database can write
        //     accessController: {
        //         write: ['*'],
        //         admin: ['*']
        //     }
        // };

        this.ipfs = await IPFS.create({ repo: "/spotifire/0.1.0" });
        console.log('ipfs', this.ipfs)

        this.orbitdb = await OrbitDB.createInstance(this.ipfs);
        console.log('orbitdb', this.orbitdb)

     

        // define stores
        //const songStoreAddr = '/orbitdb/zdpuAzzqM6s2DnoT2BoEvfdoCdaRX8kVigBqTvAL8nBCXpTNC/spotifire.songs';
        //const songStoreAddr = '/orbitdb/zdpuB1eWFAB2AHtgPeL21gXS958f9HrR4o35sLYjFnhZrEjGC/spotifire.songs';
        //this.songStore = await this.orbitdb.docstore(songStoreAddr, { indexBy: 'title' });
        this.songStore = await this.orbitdb.docstore(environment.storeAddesses.song, { indexBy: 'title' });
        console.log('songStore', this.songStore.address.toString());

        //const albumStoreAddr = '/orbitdb/zdpuAwyody5we2eL7HWaVPBMCq9Rozoqi2mZKAsKfkjQjywMZ/spotifire.albums';
        //this.albumStore = await this.orbitdb.docstore(albumStoreAddr, { indexBy: 'title' });
        this.albumStore = await this.orbitdb.docstore(environment.storeAddesses.album, { indexBy: 'title' });
        console.log('albumStore', this.albumStore.address.toString());

        //const artistStoreAddr = '/orbitdb/zdpuAtWhwwWg62YtdAWY7AgSGqBmVnGRUaDRaNYBQAxBqJKaA/spotifire.artists';
        //this.artistStore = await this.orbitdb.docstore(artistStoreAddr, { indexBy: 'name' });
        this.artistStore = await this.orbitdb.docstore(environment.storeAddesses.artist, { indexBy: 'name' });
        console.log('artistStore', this.artistStore.address.toString());

        //const newsStoreAddr = '/orbitdb/zdpuAv5bfV3bt3Be9veSz6wKMRLNrGaa1jk8hSvEpZqugh11C/spotifire.news';
        //this.newsStore = await this.orbitdb.docstore(newsStoreAddr);
        this.newsStore = await this.orbitdb.docstore(environment.storeAddesses.news);
        console.log('newsStore', this.newsStore.address.toString());

        this.playlistStore = await this.orbitdb.docstore(environment.storeAddesses.playlist, { indexBy: 'name' });
        console.log('playlistsStore', this.playlistStore.address.toString());

        this.playlistsongStore = await this.orbitdb.docstore(environment.storeAddesses.playlistsongs);
        console.log('playlistsongsStore', this.playlistsongStore.address.toString());

        // load
        await this.loadAll();

        // await this.albumStore.load();
        // await this.songStore.load();

        await this.getAll();
    }

    generateId() {
        return uuidv4();
    }

    async clearAll() {
        // clear albums
        //await this.albumStore.load();
        const allAlbums = this.albumStore.get('');
        allAlbums.forEach(async (item) => {
            let delAlbum = await this.albumStore.del(item.title);
            console.log('delAlbum', delAlbum);
        });

        // clear songs
        //await this.songStore.load();
        const allSongs = this.songStore.get('');
        allSongs.forEach(async (item) => {
            let delSong = await this.songStore.del(item.title);
            console.log('delSong', delSong);
        });
    }

    async loadAll() {
        await this.songStore.load();
        this.songStore.events.on('replicated', () => console.log(`songStore replicated`));
        console.log(`songStore replicationStatus`, this.songStore.replicationStatus);
        this.songStore.events.on('ready', () => console.log(`songStore ready`));
        this.songStore.events.on('replicate.progress', () => console.log('replicate.progress'))

        await this.albumStore.load();
        await this.artistStore.load();
        await this.newsStore.load();
        await this.playlistStore.load();
        await this.playlistsongStore.load();
    }

    async getAll() {
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
    }

    async dropAll() {
        await this.songStore.drop();
        console.log('drop songs', this.songStore.get(''));

        await this.albumStore.drop();
        console.log('drop albums', this.albumStore.get(''));

        await this.artistStore.drop();
        console.log('drop artists', this.artistStore.get(''));

        await this.newsStore.drop();
        console.log('drop news', this.newsStore.get(''));

        await this.playlistStore.drop();
        console.log('drop playlists', this.playlistStore.get(''));

        await this.playlistsongStore.drop();
        console.log('drop playlist songs', this.playlistsongStore.get(''));
    }

    async createSong(song: Song) {
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
            _id: this.generateId(),
            type: 'song',
            object: song,
            created: Math.round(Date.now())
        });
    }

    getSongs(genre: string, creator: string) {
        var result = [];
        if (genre && creator) {
            result = this.songStore.query((e) => e.genre == genre.toLowerCase() && e.creator == creator);
        } else {
            if (genre) result = this.songStore.query((e) => e.genre == genre.toLowerCase());
            if (creator) result = this.songStore.query((e) => e.creator == creator);
        }
        return result;
    }

    getAlbums(genre: string, creator: string) {
        var result = [];
        if (genre && creator) {
            result = this.albumStore.query((e) => e.genre == genre.toLowerCase() && e.creator == creator);
        } else {
            if (genre) result = this.albumStore.query((e) => e.genre == genre.toLowerCase());
            if (creator) result = this.albumStore.query((e) => e.creator == creator);
        }
        return result;
    }

    getAlbumById(id: string) {
        var result = [];
        result = this.albumStore.query((e) => e._id == id);
        return result.length > 0 ? result[0] : null;
    }

    searchSongs(titleWords: string[], artistWords: string[]) {
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

    searchAlbums(titleWords: string[], artistWords: string[]) {
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

    searchPlaylists(titleWords: string[]) {
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

    searchArtists(words: string[]) {
        var result = [];
        words.forEach((word) => {
            var searchItems = this.artistStore.get(word);
            searchItems.forEach((item) => {
                result.indexOf(item) === -1 && result.push(item);
            });
        });
        return result;
    }

    async createAlbum(album: Album) {
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
            _id: this.generateId(),
            type: 'album',
            object: album,
            created: Math.round(Date.now())
        });
    }

    getArtists(name: string) {
        var artists = this.artistStore.get(name);
        return artists;
    }

    async createArtist(artist: Artist) {
        await this.artistStore.put(artist);
    }

    getNews(type: string) {
        var news = this.newsStore.query((e) => e.type == type);
        return news;
    }

    async createPlaylist(playlist: Playlist) {
        await this.playlistStore.put(playlist);
    }

    async addToPlaylist(song: Song, playlistId: string, creator: string) {
        var addSong: PlaylistSong = {
            _id: this.generateId(),
            playlistId: playlistId,
            song: song,
            created: Math.round(Date.now()),
            creator: creator
        };
        await this.playlistsongStore.put(addSong);
    }

    getPlaylists(creator: string) {
        var playlists = this.playlistStore.query((e) => e.creator == creator);
        return playlists;
    }

    getPlaylistById(id: string) {
        var playlists = this.playlistStore.query((e) => e._id == id);
        return playlists.length > 0 ? playlists[0] : null;
    }

    getPlaylistSongs(playlistId: string) {
        var songs = new Array<Song>();
        var playlistSongs: Array<PlaylistSong> = this.playlistsongStore.query((e) => e.playlistId == playlistId);
        playlistSongs.forEach((ps) => {
            songs.push(ps.song);
        });

        return songs;
    }
}
