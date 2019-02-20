---
title: Build on Ubuntu
order: 2
page: guides
---

Since NextEPC is an open source project, you can build and use this program directly from source code. If you have already installed it with a package manager, or are not interested in learning the source code, you can skip this guide and proceed to the next [configuration guide](http://nextepc.org/guides/3-configuration). 

Note that this guide is based on **Ubuntu 18.04(Bionic Beaver)** and **16.04(Zenial)** Distribution. To use _Ubuntu 14.04(Trusty)_, you must use [a different guide](/docs/build/5-ubuntu/).

## Prerequisites

NextEPC requires MongoDB and TUN device. If you have previously installed NextEPC according to the [Installation Guide](http://nextepc.org/guides/1-installation), they was configured at that time. So, you can skip this step.

Install Mongo DB with Package Manager.
```bash
sudo apt-get update
sudo apt-get -y install mongodb
sudo systemctl start mongodb (if '/usr/bin/mongod' is not running)
```

To run NextEPC with least privilege, TUN device permission should be a `crw-rw-rw-`(666). Otherwise, you need to run nextepc daemon with root privilege. If the permission is not `crw-rw-rw-`(666), you may need to install `udev` package.  Nevertheless, if the permission do not change , you can run nextepc with root privileges or change the permission using `chmod 666 /dev/net/tun`.

```bash
ls -al /dev/net/tun
crw-rw---- 1 root 28 10, 200 Feb 11 05:13 /dev/net/tun
sudo apt-get install udev
sudo systemctl start systemd-udevd (if '/lib/systemd/systemd-udevd' is not running)
```

Write the configuration file for the TUN deivce.
```bash
sudo sh -c "cat << EOF > /etc/systemd/network/99-nextepc.netdev
[NetDev]
Name=pgwtun
Kind=tun
EOF"
```

Create the TUN device. Interface name will be `pgwtun`.
```
sudo systemctl enable systemd-networkd
sudo systemctl restart systemd-networkd

sudo apt-get -y install net-tools
ifconfig pgwtun
```

Then, you need to check *IPv6 Kernel Configuration*. Although you can skip this process, we recommend that you set this up to support IPv6-enabled UE.

```bash
sysctl -n net.ipv6.conf.pgwtun.disable_ipv6

(if the output is 0 and IPv6 is enabled, skip the followings)
sudo sh -c "echo 'net.ipv6.conf.pgwtun.disable_ipv6=0' > /etc/sysctl.d/30-nextepc.conf"
sudo sysctl -p /etc/sysctl.d/30-nextepc.conf
```

You are now ready to set the IP address on TUN device. If IPv6 is disabled for TUN device, please remove `Address=cafe::1/64` from below.

```bash
sudo sh -c "cat << EOF > /etc/systemd/network/99-nextepc.network
[Match]
Name=pgwtun
[Network]
Address=45.45.0.1/16
Address=cafe::1/64
EOF"
```

Check the TUN(pgwtun) device again.
```
sudo systemctl restart systemd-networkd
ifconfig pgwtun
```

## MME, SGW, PGW, HSS, and PCRF

Install the depedencies for building the source
```bash
sudo apt-get -y install autoconf libtool gcc pkg-config git flex bison libsctp-dev libgnutls28-dev libgcrypt-dev libssl-dev libidn11-dev libmongoc-dev libbson-dev libyaml-dev
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

