const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

 require('dotenv').config({path: __dirname + '/.env'})
// const PATH = process.env.API_TOKEN;
// console.log('path', process.env.API_TOKEN);

// require('dotenv').config();


module.exports = {
    initOrbitDB: async () => {
        const ipfsConfig = {
            repo: '/orbitdb/spotifire',
            start: true,
            preload: {
                enabled: false
            },
            EXPERIMENTAL: {
                pubsub: true
            },
            config: {
                Addresses: {
                    Swarm: [
                        //   "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
                        //   "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
                        //   "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/",
                    ]
                }
            }
        };
        try {
            const ipfs = await IPFS.create(ipfsConfig);
            // this.ipfs = await IPFS.create({repo: "./ipfs"});
            // console.log('ipfs', await ipfs.id());
            //console.log("OrbitDB", OrbitDB);

            const orbitdb = await OrbitDB.createInstance(ipfs);
            //console.log("orbitdb", orbitdb);

            // define stores
            const songStore = await orbitdb.docstore(process.env.ORBITDB_STORE_SONG, { indexBy: 'title' });
            console.log('songStore', songStore.address.toString());

            const albumStore = await orbitdb.docstore(process.env.ORBITDB_STORE_ALBUM, { indexBy: 'title' });
            console.log('albumStore', albumStore.address.toString());

            const artistStore = await orbitdb.docstore(process.env.ORBITDB_STORE_ARTIST, { indexBy: 'name' });
            console.log('artistStore', artistStore.address.toString());

            const newsStore = await orbitdb.docstore(process.env.ORBITDB_STORE_NEWS);
            console.log('newsStore', newsStore.address.toString());

            const playlistStore = await orbitdb.docstore(process.env.ORBITDB_STORE_PLAYLIST, { indexBy: 'name' });
            console.log('playlistsStore', playlistStore.address.toString());

            const playlistsongStore = await orbitdb.docstore(process.env.ORBITDB_STORE_PLAYLIST_SONG);
            console.log('playlistsongsStore', playlistsongStore.address.toString());

            // // load
            await albumStore.load();
            await artistStore.load();
            await newsStore.load();
            await playlistStore.load();
            await playlistsongStore.load();
        } catch (e) {
            console.log('err', e);
        }
    }
};
