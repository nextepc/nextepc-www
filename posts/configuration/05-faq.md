---
title: FAQ
order: 5
page: configuration
---

<br/>

* ## Manage NextEPC daemons (Ubuntu package)
The NextEPC service is registered in `systemd` environment, and is started automatically after its installation. The service names are *nextepc-mmed*, *nextepc-sgwd*, *nextepc-pgwd*, *nextepc-hssd*, and *nextepc-pcrfd*. You can use the `systemctl` command to control specific services.
```bash
sudo systemctl status nextepc-mmed (Check the service status)
sudo systemctl stop nextepc-mmed (Stop the service)
sudo systemctl disable nextepc-mmed (Will not be started after rebooting)
sudo systemctl enable nextepc-mmed (Will be started after rebooting)
sudo systemctl start nextepc-mmed (Start the service)
sudo systemctl restart nextepc-mmed (Stop and start)
```


* ## MongoDB URI
The LTE UE information of NextEPC is stored and maintained by [Mongo DB](https://www.mongodb.com/). To manage the subscriber information, [Mongo DB client](https://docs.mongodb.com/ecosystem/tools/) is required. The default DB URI is [_mongodb://localhost/nextepc_]. 


* ## NextEPC Web service
NextEPC provides an alternative management interface for customers to manage their subscriber information in an easy way. The service name is *nextepc-webui*, and it will show a web page on _http://localhost:3000_. The default account information is shown here: [Adding a UE](/configuration/04-ue).


* ## Issue on TUN
To run NextEPC with least privilege, TUN device permission should be a `crw-rw-rw-`(666). Otherwise, you need to run NextEPC daemons with root privilege. If the permission is not `crw-rw-rw-`(666), then install `udev` package.  If the permission is still not changed after installing `udev`, run NextEPC with root privileges.
```bash
ls -al /dev/net/tun
crw-rw---- 1 root 28 10, 200 Feb 11 05:13 /dev/net/tun
sudo apt-get install udev /* Ubuntu */
sudo dnf -y install udev /* Fedora */
sudo systemctl start systemd-udevd
```

* ## Disabling IPv6
IPv6 can be disabled as followgs:
```bash
sysctl -n net.ipv6.conf.pgwtun.disable_ipv6

(if the output is 0 and IPv6 is enabled, skip the followings)
sudo sh -c "echo 'net.ipv6.conf.pgwtun.disable_ipv6=0' > /etc/sysctl.d/30-nextepc.conf"
sudo sysctl -p /etc/sysctl.d/30-nextepc.conf

sudo sh -c "cat << EOF > /etc/systemd/network/99-nextepc.network
[Match]
Name=pgwtun
[Network]
Address=45.45.0.1/16
EOF"
```

* ## Masquerading on macOS
```bash
sudo sysctl -w net.inet.ip.forwarding=1
sudo sh -c "echo 'nat on {en0} from 45.45.0.0/16 to any -> {en0}' > /etc/pf.anchors/org.nextepc"
sudo pfctl -e -f /etc/pf.anchors/org.nextepc
```

<br/>

> Serivce and Support: [NextEPC Inc.](https://nextepc.com)
