---
title: Mac OS X
order: 6
page: installation
---

Verified on macOS High Sierra 10.13.3.

<br/>

## Build

This section explains how to build NextEPC from the source codes.

* ### Install Homebrew
The following package installation requires Homebrew:
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

* ### Install MongoDB
[MongoDB](https://www.mongodb.com) is used for the database of NextEPC.
Please refer [Manual](https://docs.mongodb.com/manual/installation/) for the installation:
```bash
brew install mongodb

mkdir -p data/db
mongod --dbpath data/db
```


* ### Install MongoDB C Driver
[MongoDB C Driver](http://www.mongoc.org/libmongoc/current/index.html) is a MongoDB client library. Please install the latest *libmongoc* following the instructions here: [http://www.mongoc.org/libmongoc/current/installing.html](http://www.mongoc.org/libmongoc/current/installing.html). 


* ### Set loopback interfaces up
```bash
sudo ifconfig lo0 alias 127.0.0.2 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.3 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.4 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.5 netmask 255.255.255.255
sudo sysctl -w net.inet.ip.forwarding=1
```

* ### Define a TUN device
It can be downloaded from [http://tuntaposx.sourceforge.net/](http://tuntaposx.sourceforge.net/).


* ### Install dependencies
Install the following dependencies:
```bash
brew install autoconf automake libtool gnu-sed \
         libusrsctp gnutls libgcrypt libidn libyaml pkg-config
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
brew install node
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
