---
title: Network Settings
order: 2
page: configuration
---

Please note that nextepc.conf is used only if NextEPC is executed through *nextepc-epcd*. Otherwise, *mme.conf*, *sgw.conf*, *pgw.conf*, *hss.conf*, and *pcrf.conf* should be modifed for the configuration. 

<br/>

## IP Connectivity between Network Entities

The minimum requirement of having IP connectvity is to modify the configuration files of MME and SGW.


* ### Modification of MME config
In `/etc/nextepc/mme.conf`, go to mme &rarr; s1ap. Please set your IP address after `addr:` keyword:
```yaml
mme:
    freeDiameter: mme.conf
    s1ap:
      addr: <IP address>
...
```

* ### Modification of SGW config
In `/etc/nextepc/sgw.conf`, go to sgw &rarr; gtpu. Please set your IP address after `addr:` keyword.

```yaml
sgw:
    gtpc:
      addr: 127.0.0.2
    gtpu:
      addr: <IP address>
...
```

## Internet Access for UEs
First, please make sure that *ip_forwarding = 1*:
```bash
sysctl net.ipv4.ip_forward
net.ipv4.ip_forward = 0

sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
```

Second, either method A or B is required for UEs to have Internet connectivity.

* ### A. Adding a route on the gateway router
By default, a LTE UE will receive a IP address with the network address of 45.45.0.0/16. If you have a [NAT](https://en.wikipedia.org/wiki/Network_address_translation) router (e.g., wireless router, cable modem, etc), the LTE UE can reach Internet in uplink, but it cannot in downlink. It's because the NAT router has no idea on 45.45.0.0/16, so adding a route is required. The following example shows adding two routes for 45.45.0.0/16 and cafe::0/64 in Linux:
```bash
sudo ip route add 45.45.0.0/16 via <'PGW IP address'>
sudo ip route add cafe::0/64 via <'PGW IP address'>
```

* ### B. NAT on PGW
NAT can be done on NextEPC's PGW. You execute the following command in PGW installed host. Please check your outgoing network interface name (e.g `enp0s25`, `wls3`):
```bash
sudo iptables -t nat -A POSTROUTING -o <'interface-name'> -j MASQUERADE
sudo iptables -I INPUT -i pgwtun -j ACCEPT
```


## Default Config

* ### Network address settings
```
* MME
  S1AP: listen on all address avaiable in system
  GTP-C: listen on the first IP address in system
  DIAMETER: 127.0.0.2 (No TLS)

* SGW
  GTP-C: 127.0.0.2
  GTP-U: listen on the first IP address in system

* PGW
  GTP-C: Both 127.0.0.3 and [::1]
  GTP-U: Both 127.0.0.3 and [::1]
  DIAMETER: 127.0.0.3 (No TLS)

* HSS
  DIAMETER: 127.0.0.4 (No TLS)

* PCRF
  DIAMETER: 127.0.0.5 (No TLS)
```

* ### UE IP addressing
```
* IPv4 : 45.45.0.1/16
* IPv6 : cafe::1/64
```

* ### DNS setttings
```
* IPv4
  Primary : 8.8.8.8 
  Secondary : 8.8.4.4

* IPv6
  Primary : 2001:4860:4860::8888
  Secondary : 2001:4860:4860::8844
```
