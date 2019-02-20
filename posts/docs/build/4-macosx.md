---
title: Mac OS X
order: 34
page: docs
---

This guide is based on macOS High Sierra 10.13.3

## Prerequisites

It is assumed that the Homebrew is installed. This can be done executing.
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install Mongo DB with Package Manager.
```bash
brew install mongodb
```

Run MongoDB server.
```bash
mkdir -p data/db
mongod --dbpath data/db
```

Install TUN/TAP driver
- You can download it from [http://tuntaposx.sourceforge.net/](http://tuntaposx.sourceforge.net/)

Setup your network.
```bash
sudo ifconfig lo0 alias 127.0.0.2 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.3 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.4 netmask 255.255.255.255
sudo ifconfig lo0 alias 127.0.0.5 netmask 255.255.255.255
```

Enable IP forwarding & Masquerading
```bash
sudo sysctl -w net.inet.ip.forwarding=1
sudo sh -c "echo 'nat on {en0} from 45.45.0.0/16 to any -> {en0}' > /etc/pf.anchors/org.nextepc"
sudo pfctl -e -f /etc/pf.anchors/org.nextepc
```

## MME, SGW, PGW, HSS, and PCRF

Install the depedencies for building the source
```bash
brew install autoconf automake libtool gnu-sed mongo-c-driver libusrsctp gnutls libgcrypt libidn libyaml pkg-config
```

Git clone and compile
```bash
acetcom@nextepc:~$ git clone https://github.com/acetcom/nextepc
ccetcom@nextepc:~$ cd nextepc
acetcom@nextepc:~/nextepc$ autoreconf -iv
acetcom@nextepc:~/nextepc$ ./configure --prefix=`pwd`/install
acetcom@nextepc:~/nextepc$ make -j `nproc`
acetcom@nextepc:~/nextepc$ make install
```

We provide a program that checks whether the installation is correct. After running the wireshark, select `loopback` interface, filter `s1ap || diameter || gtpv2 || gtp` and run `./test/testepc`. You can see the virtually created packets. [[testepc.pcapng]](http://nextepc.org/static/pcapng/testepc.pcapng)

#
Note that this should require *sudo* due to access `/dev/tun0`.
```bash
acetcom@nextepc:~/nextepc$ sudo ./test/testepc
```

It is a convenient tool called `nextepc-epcd` for developers. This daemon includes both *MME*, *SGW*, *PGW*, *HSS*, and *PCRF*. So, instead of running all 5 daemons, you can just run `nextepc-epcd` in your development environment.

```bash
acetcom@nextepc:~/nextepc$ sudo ./nextepc-epcd
NextEPC daemon v0.3.3 - Feb 11 2018 07:19:59

  PID[3720] : '/home/acetcom/nextepc/install/var/run/nextepc-epcd/pid'
  File Logging : '/home/acetcom/nextepc/install/var/log/nextepc/nextepc.log'
  MongoDB URI : 'mongodb://localhost/nextepc'
  Configuration : '/home/acetcom/nextepc/install/etc/nextepc/nextepc.conf'
[02/11 07:26:42.001] PCRF try to initialize
...
```

When you run `nextepc-epcd`, all logs for MME, SGW, PGW, PCRF, and HSS are written to `nextepc.log`, and all settings are managed in one place for `nextepc.conf`. You can find the log/conf path at the beginning of running screen.

#
Sometimes, you may want to use newly updated source code.
```bash
(Control-C kill nextepc-epcd)
acetcom@nextepc:~/nextepc$ make maintainer-clean
acetcom@nextepc:~/nextepc$ rm -rf ./install
acetcom@nextepc:~/nextepc$ git pull
acetcom@nextepc:~/nextepc$ autoreconf -iv
acetcom@nextepc:~/nextepc$ ./configure --prefix=`pwd`/install
acetcom@nextepc:~/nextepc$ make -j `nproc`
acetcom@nextepc:~/nextepc$ make install
acetcom@nextepc:~/nextepc$ sudo ./nextepc-epcd
```

## Web User Interface

Install [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/) with a package manager.

```bash
brew install node
```

Install the dependencies to run WebUI

```bash
acetcom@nextepc:~/nextepc$ cd webui
acetcom@nextepc:~/nextepc/webui$ npm install
```

Running WebUI

```bash
acetcom@nextepc:~/nextepc/webui$ npm run dev
```

Now the web server is running on _http://localhost:3000_.
