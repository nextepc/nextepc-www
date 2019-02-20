---
title: Configuration
order: 3
page: guides
---

In LTE, there are tons of configurable parameters. This page will guide you to set essential parameters up. The configuration consists of three parts: IP network connectivity, LTE network settings and Subscribers registering.

## 1. IP Connectivity between Network Entities

The minimum requirement of having IP connectvity is to modify the configuration files of MME and SGW. Once NextEPC has been installed, you can find [YAML](http://yaml.org/)-format configuration files in `/etc/nextepc/*.conf`.

Note that [/etc/nextepc/nextepc.conf](https://github.com/acetcom/nextepc/blob/master/support/config/nextepc.conf.in) is just a manual. If you use `nextepc-epcd` in a build environment, this configuration file could be used, but if you installed it with the package manager, modifying this configuration file has no effect.

Anyway, before setting up, please decide a network interface to run NextEPC, and then the IP address of the interface needs to be recorded in the configuration files.

### Modification of MME config

Open `/etc/nextepc/mme.conf` file, and find an item in mme &rarr; s1ap. Please set your IP address with putting `addr:` keyword.

```yaml
mme:
    freeDiameter: mme.conf
    s1ap:
      addr: <IP address>
...
```

Save and exit.

### Modification of SGW config

Open `/etc/nextepc/sgw.conf` file, and find an item in sgw &rarr; gtpu. Please set your IP address with putting `addr:` keyword.

```yaml
sgw:
    gtpc:
      addr: 127.0.0.2
    gtpu:
      addr: <IP address>
...
```

Save and exit.


### Adding a route for UE to have Internet connectivity

By default, a LTE UE will receive a IP address with the network address of 45.45.0.0/16. If you have a [NAT](https://en.wikipedia.org/wiki/Network_address_translation) router (e.g., wireless router, cable modem, etc), the LTE UE can reach Internet in uplink, but it cannot in downlink. It's because the NAT router has no idea on 45.45.0.0/16, so adding a route is required. Please refer to the user manual to know how to add a static route in your router.

Add a route of both 45.45.0.0/16 and cafe::0/64 to go the PGW IP address. For example, a command for Linux will be:

```bash
sudo ip route add 45.45.0.0/16 via <'PGW IP address'>
sudo ip route add cafe::0/64 via <'PGW IP address'>
```

If you have no NAT router, there is another option for you. `iptables` can solve the problem. You execute the following command in NextEPC installed host. Do not miss out on modifying your interface name(e.g `enp0s25`, `wls3`).

```bash
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
sudo iptables -t nat -A POSTROUTING -o <'interface-name'> -j MASQUERADE
sudo iptables -I INPUT -i pgwtun -j ACCEPT
```

## 2. LTE Network Settings

### PLMN and TAC

By default, LTE PLMN and TAC are set as shown in the following:

```yaml
mme:
    gummei: 
      plmn_id:
        mcc: 001
        mnc: 01
      mme_gid: 2
      mme_code: 1
    tai:
      plmn_id:
        mcc: 001
        mnc: 01
      tac: 12345
```

The LTE EnodeBs need to be set to use the same values of PLMN and TAC in NextEPC. If you want to change them, please modifiy in `/etc/nextepc/mme.conf`.


### Restarting MME and SGW.

After changing conf files, please restart NextEPC daemons.

```bash
sudo systemctl restart nextepc-mmed
sudo systemctl restart nextepc-sgwd
```

## 3. Register a subscriber

Open _http://localhost:3000_. Login with **admin**. Later, you can change the password in _Account_ Menu.

```markdown
  - Username : admin
  - Password : 1423
```

Using Web UI, you can add a subscriber without a Mongo DB client. 

```markdown
  - Go to Subscriber Menu.
  - Click `+` Button to add a new subscriber.
  - Fill the IMSI, security context(K, OPc, AMF), and APN of the subscriber.
  - Click `SAVE` Button
```

This addition affects immediately NextEPC without restaring any daemon.

## Appendix 

When you install NextEPC for the first time, the default configuration looks like this:

### Network

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

### GUMMEI, PLMN and TAC

```
* GUMMEI
  PLMN ID - MNC: 001, MCC: 01
  MME Group : 2
  MME Code : 1

* TAI
  PLMN ID - MNC: 001, MCC: 01
  TAC : 12345
```

### Security

```
* Integrity : EIA1 - Snow 3G
* Ciphering : EEA0 - Nothing
```

### UE Network

```
* IPv4 : 45.45.0.1/16
* IPv6 : cafe::1/64
```

### DNS

```
* IPv4
  Primary : 8.8.8.8 
  Secondary : 8.8.4.4

* IPv6
  Primary : 2001:4860:4860::8888
  Secondary : 2001:4860:4860::8844
```
