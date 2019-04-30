---
title: FreeBSD
order: 5
page: installation
---

Verified on FreeBSD Release 11.1.

<br/>

## Build

This section explains how to build NextEPC from the source codes.


* ### Install MongoDB
[MongoDB](https://www.mongodb.com) is used for the database of NextEPC.
Please refer [Manual](https://docs.mongodb.com/manual/installation/) for the installation:
```bash
sudo pkg install mongodb

mkdir -p data/db
mongod --dbpath data/db
```

* ### Set loopback interfaces up
```bash
sudo ifconfig lo0 alias 127.0.0.2 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.3 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.4 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.5 netmask 255.255.255.255
sudo sysctl -w net.inet.ip.forwarding=1
```

* ### Define a TUN device
Create *tun0* and configure it:
```
sudo ifconfig tun create
...
```

* ### Install dependencies
Install the following dependencies:
```bash
sudo pkg install git gcc bison gsed pkgconf autoconf \
         automake libtool mongo-c-driver gnutls libgcrypt \
         libidn libyaml
```

* ### Build
Download and compile source codes, then will be installed to \`pwd\`/install/:
```bash
git clone https://github.com/nextepc/nextepc
cd nextepc
autoreconf -iv
./configure --prefix=`pwd`/install
make -j `nproc`
make install
```

* ### Run
*nextepc-epcd* is the daemon lauching all necessary daemons automatically:
```bash
nextepc-epcd
```

* ### Install Node.js
[Node.js](https://nodejs.org) is required to install NextEPC WebUI:
```bash
sudo pkg install node
```

* ### Install the dependencies of WebUI
Goto the `TOP/webui` of NextEPC source. Install WebUI dependencies:
```bash
cd webui
npm install
```

* ### Run WebUI
Visit [http://localhost:3000](http://localhost:3000), after run the command:
```bash
npm run dev
```

> Next step: [Configuration](/configuration)
