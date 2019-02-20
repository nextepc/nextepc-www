---
title: Installation
order: 1
page: guides
---

This post will guide you on how to get installed **NextEPC** with your environment. To date, NextEPC has been tested on GNU/Linux distributions(Debian, Ubuntu, CentOS, Fedora), FreeBSD, and Mac OS X.



## Ubuntu

To get the latest Ubuntu version, please visit the official Ubuntu website: [https://www.ubuntu.com/download/](https://www.ubuntu.com/download/). 

* ### MME, SGW, PGW, HSS, and PCRF

The NextEPC package is available on the recent versions of Ubuntu.

```bash
sudo apt-get update
sudo apt-get -y install software-properties-common
sudo add-apt-repository ppa:acetcom/nextepc
sudo apt-get update
sudo apt-get -y install nextepc
```
This will create a virtual network interface named as *pgwtun*. It is automatically removed by uninstalling NextEPC.

```markdown
ifconfig pgwtun
pgwtun    Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  
          inet addr:45.45.0.1  P-t-P:45.45.0.1  Mask:255.255.0.0
          inet6 addr: fe80::50f6:182c:5aa3:16bb/64 Scope:Link
          inet6 addr: cafe::1/64 Scope:Global
          ...
```

The NextEPC service is registered in `systemd` environment, and is started automatically during the installation phase. The service names are *nextepc-mmed*, *nextepc-sgwd*, *nextepc-pgwd*, *nextepc-hssd*, and *nextepc-pcrfd*. You can use the `systemctl` command to control specific services.

```bash
sudo systemctl status nextepc-mmed (Check the service status)
sudo systemctl stop nextepc-mmed (Stop the service)
sudo systemctl disable nextepc-mmed (Will not be started after rebooting)
sudo systemctl enable nextepc-mmed (Will be started after rebooting)
sudo systemctl start nextepc-mmed (Start the service)
sudo systemctl restart nextepc-mmed (Stop and start)
```


* ### Web User Interface

The LTE user subcription information of NextEPC is stored and maintained by [Mongo DB](https://www.mongodb.com/). To manage the subscriber information, [Mongo DB client](https://docs.mongodb.com/ecosystem/tools/) is required, and this client can connect to the DB URI [_mongodb://localhost/nextepc_]. 

NextEPC provides an alternative management interface for customers to manage their subscriber information in an easy way, that is **Web User Interface**. The following shows how to install the Web UI of NextEPC.

```bash
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
curl -sL http://nextepc.org/static/webui/install | sudo -E bash -
```

The service name is *nextepc-webui*, and it will be running on _http://localhost:3000_.


* ### Uninstall NextEPC

```bash
curl -sL http://nextepc.org/static/webui/uninstall | sudo -E bash -
sudo apt-get purge nextepc*
```

You may need to remove manually /var/log/nextepc unless it is empty.
```bash
sudo rm -Rf /var/log/nextepc
```

## openSUSE

[Martin Hauke](https://build.opensuse.org/user/show/mnhauke) packaged NextEPC for openSUSE on [OBS](https://build.opensuse.org/package/show/home:mnhauke:nextepc/nextepc).

* ### [Installation Guide](/docs/package/3-opensuse)

<br/>

## CentOS, Fedora, FreeBSD, and Mac OS X

For these OS, you should build NextEPC from the code. First clone this [repository](https://github.com/acetcom/nextepc.git) and then follow instructions described in the [documentation](http://nextepc.org/docs/). 

* ### [CentOS](/docs/build/1-centos)
* ### [Fedora](/docs/build/2-fedora)
* ### [FreeBSD](/docs/build/3-freebsd)
* ### [Mac OS X](/docs/build/4-macosx)

<br/>

