---
title: Ubuntu (Trusty)
order: 35
page: docs
---

This guide is based on **Ubuntu 14.04(Trusty)** Distribution. To use _Ubuntu 18.04(Bionic Bearer)_ and _Ubuntu 16.04(Zenial)_, you must use [a different guide](/guides/2-build).

## Prerequisites

Install Mongo DB with Package Manager.
```bash
sudo apt-get update
sudo apt-get -y install mongodb
sudo systemctl start mongodb (if '/usr/bin/mongod' is not running)
```

To run NextEPC with least privilege, TUN device permission should be a `crw-rw-rw-`(666). Otherwise, you need to run nextepc daemon with root privilege. If the permission is not `crw-rw-rw-`(666), you may need to install `udev` package.  Nevertheless, if the permssions do not change , you can run nextepc with root privileges or change the permission using `chmod 666 /dev/net/tun`.

```bash
ls -al /dev/net/tun
crw-rw---- 1 root 28 10, 200 Feb 11 05:13 /dev/net/tun
sudo apt-get install udev
sudo systemctl start systemd-udevd (if '/lib/systemd/systemd-udevd' is not running)
```

Write the configuration file for the TUN deivce.
```bash
sudo sh -c "cat << EOF > /etc/network/interfaces.d/nextepc
auto pgwtun
iface pgwtun inet static
    address 45.45.0.1
    netmask 255.255.0.0
    pre-up ip tuntap add name pgwtun mode tun
    post-down ip tuntap del name pgwtun mode tun
iface pgwtun inet6 static
    address cafe::1
    netmask 64
EOF"
```

For loading TUN configuration,
```bash
sudo sh -c 'if ! grep "source-directory" /etc/network/interfaces | grep "/etc/network/interfaces.d" > /dev/null; then
    echo "source-directory /etc/network/interfaces.d" >> /etc/network/interfaces
fi'
```

Create the TUN device. Interface name will be `pgwtun`.
```
ifup pgwtun
```

Then, you need to check *IPv6 Kernel Configuration*. Although you can skip this process, we recommend that you set this up to support IPv6-enabled UE.

```bash
sysctl -n net.ipv6.conf.pgwtun.disable_ipv6

(if the output is 0 and IPv6 is enabled, skip the followings)
sudo sh -c "echo 'net.ipv6.conf.pgwtun.disable_ipv6=0' > /etc/sysctl.d/30-nextepc.conf"
sudo sysctl -p /etc/sysctl.d/30-nextepc.conf
```

## MME, SGW, PGW, HSS, and PCRF

Install the depedencies for building the source
```bash
sudo apt-get -y install git gcc flex bison make autoconf libtool pkg-config libsctp-dev libssl-dev libgnutls-dev libidn11-dev libyaml-dev
```

And then, compile and install Mongo C Driver like the followings.
```bash
sudo apt-get -y install g++ libsasl2-dev
tar xzf mongo-c-driver-1.8.0.tar.gz
cd mongo-c-driver-1.8.0
./configure --disable-automatic-init-and-cleanup
make
sudo make install
sudo ldconfig
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

Note that you should stop all nextepc daemons before running test program if you have already installed it with a package manage.
```bash
(if nextepc-daemons are running)
sudo systemctl stop nextepc-mmed
sudo systemctl stop nextepc-sgwd
sudo systemctl stop nextepc-pgwd
sudo systemctl stop nextepc-hssd
sudo systemctl stop nextepc-pcrfd

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

To get the latest [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/), please visit the official Node.js website:
[https://nodesjs.org/en/download/](https://nodesjs.org/en/download/).

Or, you can install [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/) with a package manager.

```bash
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get -y install nodejs
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

