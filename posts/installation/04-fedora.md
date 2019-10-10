---
title: Fedora
order: 4
page: installation
---

Verified on Fedora 27.

<br/>

## Build

This section explains how to build NextEPC from the source codes.


* ### Install MongoDB
[MongoDB](https://www.mongodb.com) is used for the database of NextEPC.
Please refer [Manual](https://docs.mongodb.com/manual/installation/) for the installation:
```bash
sudo dnf -y install mongodb-server

mkdir -p data/db
mongod --dbpath data/db
```

* ### Install MongoDB C Driver
[MongoDB C Driver](http://www.mongoc.org/libmongoc/current/index.html) is a MongoDB client library. Please install the latest *libmongoc* following the instructions here: [http://www.mongoc.org/libmongoc/current/installing.html](http://www.mongoc.org/libmongoc/current/installing.html). 


* ### Define a TUN device
Create *pgwtun*:
```
sudo dnf -y install iproute
sudo ip tuntap add name pgwtun mode tun
sudo ip addr add 45.45.0.1/16 dev pgwtun
sudo ip addr add cafe::1/64 dev pgwtun
sudo ip link set pgwtun up
```


* ### Install dependencies
Install the following dependencies:
```bash
sudo dnf -y install git gcc flex bison autoconf libtool \
         lksctp-tools-devel libidn-devel \
         gnutls-devel libgcrypt-devel openssl-devel cyrus-sasl-devel \
         snappy-devel libyaml-devel
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
sudo dnf -y install nodejs
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
