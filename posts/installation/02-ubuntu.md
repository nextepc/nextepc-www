---
title: Ubuntu
order: 2
page: installation
---

Package installation is verified on Ubuntu 18.04, while building is verified on both Ubuntu 16.04(Zenial) and 18.04(Bionic Bearer).

<br/>

## Package Installation

This section explains how to install NextEPC using the package manager `apt`.
To build NextEPC from the source codes, please see _Build_ section below.

* ### Install NextEPC 
Install NextEPC daemons which consist of *nextepc-mmed*, *nextepc-sgwd*, *nextepc-pgwd*, *nextepc-hssd*, and *nextepc-pcrfd*:
```bash
sudo apt-get update
sudo apt-get -y install software-properties-common
sudo add-apt-repository ppa:acetcom/nextepc
sudo apt-get update
sudo apt-get -y install nextepc
```

* ### Install Web user interface
Install Web User Interface (WebUI) which supports the user subscription management:
```bash
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
curl -sL http://nextepc.org/static/webui/install | sudo -E bash -
```

* ### Verify the installation
NextEPC daemons are registered in `systemd` environment:
```bash
sudo systemctl status nextepc-mmed
● nextepc-mmed.service - NextEPC MME Daemon
   Loaded: loaded (/lib/systemd/system/nextepc-mmed.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2019-02-21 19:29:43 MST; 27s ago
   ...
sudo systemctl status nextepc-sgwd
   ...
sudo systemctl status nextepc-pgwd
   ...
sudo systemctl status nextepc-hssd
   ...
sudo systemctl status nextepc-pcrfd
   ...
```

* ### Verify the tunnel interface creation
A virtual network interface, *pgwtun*, is also created:
```bash
ifconfig pgwtun
pgwtun    Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  
          inet addr:45.45.0.1  P-t-P:45.45.0.1  Mask:255.255.0.0
          inet6 addr: fe80::50f6:182c:5aa3:16bb/64 Scope:Link
          inet6 addr: cafe::1/64 Scope:Global
          ...
```

* ### Uninstall NextEPC
Uninstall WebUI, NextEPC daemons and log files:
```bash
curl -sL http://nextepc.org/static/webui/uninstall | sudo -E bash -
sudo apt-get purge nextepc*
sudo rm -Rf /var/log/nextepc
```

> Next step: [Configuration](/configuration)

<br/>

## Build

This section explains how to build NextEPC from the source codes.


* ### Install MongoDB
[MongoDB](https://www.mongodb.com) is used for the database of NextEPC:
```bash
sudo apt-get update
sudo apt-get -y install mongodb
sudo systemctl start mongodb
```

* ### Define a TUN device
Write the configuration file for *pgwtun* and create it:
```bash
sudo sh -c "cat << EOF > /etc/systemd/network/99-nextepc.netdev
[NetDev]
Name=pgwtun
Kind=tun
EOF"

sudo sh -c "cat << EOF > /etc/systemd/network/99-nextepc.network
[Match]
Name=pgwtun
[Network]
Address=45.45.0.1/16
Address=cafe::1/64
EOF"

sudo systemctl enable systemd-networkd
sudo systemctl restart systemd-networkd
```

* ### Install dependencies
Install the following dependencies:
```bash
sudo apt-get -y install autoconf libtool gcc pkg-config \
         git flex bison libsctp-dev libgnutls28-dev libgcrypt-dev \
         libssl-dev libidn11-dev libmongoc-dev libbson-dev libyaml-dev
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
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get -y install nodejs
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
