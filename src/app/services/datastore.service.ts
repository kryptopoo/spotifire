import { Injectable } from '@angular/core';
//import {IPFS} from 'ipfs';
// import { OrbitDB } from 'orbit-db';
import { v4 as uuidv4 } from 'uuid';

const IPFS = require('ipfs');
const path = require('path');
const OrbitDB = require('orbit-db');
// const uuidV1 = require('uuid/v1');

export interface Song {
    _id: string;
    title: string;
    artist: string;
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
    artist: string;
    description: string;
    genre: string;
    thumbnailUrl: string;
    songs: Array<Song>;
    created: number;
    creator: string;
}

@Injectable({
    providedIn: 'root'
})
export class DatastoreService {
    songStore: any;
    artistStore: any;
    albumStore: any;
    playlistStore: any;
    genreStore: any;
    likeStore: any;

    constructor() {}

    async init() {
        const ipfs = await IPFS.create();
        const orbitdb = await OrbitDB.createInstance(ipfs);

        // define stores
        const songStoreAddr = '/orbitdb/zdpuAzzqM6s2DnoT2BoEvfdoCdaRX8kVigBqTvAL8nBCXpTNC/spotifire.songs';
        this.songStore = await orbitdb.docstore(songStoreAddr, { indexBy: 'title' });
        //this.songStore = await orbitdb.docstore('spotifire.songs' , { indexBy: 'title' });

        const albumStoreAddr = '/orbitdb/zdpuAwyody5we2eL7HWaVPBMCq9Rozoqi2mZKAsKfkjQjywMZ/spotifire.albums';
        this.albumStore = await orbitdb.docstore(albumStoreAddr, { indexBy: 'title' });
        //console.log('this.albumStore', this.albumStore)

        // load

        await this.albumStore.load();
        await this.songStore.load();
    }

    generateId() {
        return uuidv4();
    }

    createSong(song: Song) {
        return this.songStore.put(song);
    }

    async getSongs(genre: string, creator: string) {
        var result = [];
        //await this.songStore.load();

        // if (!genre && !creator) {
        //     result = this.songStore.query((e) => e.genre == genre.toLowerCase() && e.creator == creator);
        // } else {
        //     if (!genre) result = this.songStore.query((e) => e.genre == genre.toLowerCase());
        //     if (!creator) result = this.songStore.query((e) => e.creator == creator);
        // }

        result = this.songStore.get('');

        //await this.songStore.close();
        return result;
    }

    async getAlbums(genre: string, creator: string) {
      var result = [];
      //await this.albumStore.load();

      // if (!genre && !creator) {
      //     result = this.songStore.query((e) => e.genre == genre.toLowerCase() && e.creator == creator);
      // } else {
      //     if (!genre) result = this.songStore.query((e) => e.genre == genre.toLowerCase());
      //     if (!creator) result = this.songStore.query((e) => e.creator == creator);
      // }

      result = this.albumStore.get('');

      //await this.albumStore.close();
      return result;
  }

    async searchSongs(...value: string[]) {
        await this.songStore.load();
        var result = [];
        value.forEach((v) => {
            var searchItems = this.songStore.get(v);
            searchItems.forEach((item) => {
                result.indexOf(item) === -1 && result.push(item);
            });
        });
        return result;
        await this.songStore.close();
    }

    createAlbum(album: Album) {
        return this.albumStore.put(album);
    }
}
