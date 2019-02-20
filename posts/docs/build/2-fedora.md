---
title: Fedora
order: 32
page: docs
---

This guide is based on Fedora 27 Distribution.

## Prerequisites

Install Mongo DB with Package Manager.
```bash
sudo dnf -y install mongodb-server
```

Run MongoDB server.
```bash
mkdir -p data/db
mongod --dbpath data/db
```

To run NextEPC with least privilege, TUN device permission should be a `crw-rw-rw-`(666). Otherwise, you need to run nextepc daemon with root privilege. If the permission is not `crw-rw-rw-`(666), you may need to install `udev` package.  Nevertheless, if the permssions do not change , you can run nextepc with root privileges or change the permission using `chmod 666 /dev/net/tun`.

```bash
ls -al /dev/net/tun
crw-rw---- 1 root 28 10, 200 Feb 11 05:13 /dev/net/tun
sudo dnf -y install udev
sudo systemctl start systemd-udevd (if '/lib/systemd/systemd-udevd' is not running)
```

Create the TUN device. Interface name will be `pgwtun`.
```
sudo dnf -y install iproute
sudo ip tuntap add name pgwtun mode tun
ip link show
```

Then, you need to check *IPv6 Kernel Configuration*. Although you can skip this process, we recommend that you set this up to support IPv6-enabled UE.

```bash
sysctl -n net.ipv6.conf.pgwtun.disable_ipv6

(if the output is 0 and IPv6 is enabled, skip the followings)
sudo sh -c "echo 'net.ipv6.conf.pgwtun.disable_ipv6=0' > /etc/sysctl.d/30-nextepc.conf"
sudo sysctl -p /etc/sysctl.d/30-nextepc.conf
```

You are now ready to set the IP address on TUN device. If IPv6 is disabled for TUN device, please do not execute `sudo ip addr add cafe::1/64 dev pgwtun` from below.

```bash
sudo ip addr add 45.45.0.1/16 dev pgwtun
sudo ip addr add cafe::1/64 dev pgwtun
```

Check the TUN(pgwtun) device again.
```bash
sudo ip link set pgwtun up
ip link show
```

## MME, SGW, PGW, HSS, and PCRF

Install the depedencies for building the source
```bash
sudo dnf -y install git gcc flex bison autoconf libtool mongo-c-driver-devel lksctp-tools-devel libidn-devel gnutls-devel libgcrypt-devel openssl-devel cyrus-sasl-devel snappy-devel libyaml-devel
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

```bash
acetcom@nextepc:~/nextepc$ ./test/testepc
```

It is a convenient tool called `nextepc-epcd` for developers. This daemon includes both *MME*, *SGW*, *PGW*, *HSS*, and *PCRF*. So, instead of running all 5 daemons, you can just run `nextepc-epcd` in your development environment.

```bash
acetcom@nextepc:~/nextepc$ ./nextepc-epcd
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
acetcom@nextepc:~/nextepc$ ./nextepc-epcd
```

## Web User Interface

Install [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/) with a package manager.

```bash
sudo dnf -y install nodejs
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
