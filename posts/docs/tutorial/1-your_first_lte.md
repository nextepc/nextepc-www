---
title: Your First LTE
order: 41
page: docs
---

_Your First LTE_ is the perfect starting point for learning to build your own LTE network. View this lession as a guided introduction -- including the installation, configuration, and best practices that will ease your learning.

## 1. Prerequisites

First, you have to prepare USRP B200/B210 to run srsENB. However, please keep in mind that you would still need a fairly high-end PC (at least dual-core i5, better quad-core i7) with USB 3.0 to attach the USRP B200/B210. 

#
Also, for USRP B200/B210 you will need a GPS antenna for clock synchronization. We think that you have a window near your desk where you can put the small GPS patch antenna. In our case, 1 or 2 meters antenna cable is used between desk/computer and the window.

#
For stable operation of USRP B200/B210, we used 10Mhz GPS-DO(GPS disciplined oscillator). Of course, a USIM card(sysmoUSIM-SJS1) was also inserted into the phone.

#
On our setup, USRP, GPS-DO, USIM, and Accessories(Cables, ..) were provided by [sysmocom](https://www.sysmocom.de/). Thanks in advance.

## 2. Overall Physical Setup

- GPS antenna near window
- GPS antenna connected to "GPS ANT" connector of GPS-DO (SMA)
- 10MHz output (BNC) of GPS-DO connected to 10MHz input of USRP (SMA)
- GPS input of USRP open/unused!
- 1PPS input of USRP open/unused!
- 4x Small Antennas connected to USRP Rx/Tx ports (RF-A/RF-B)
- USRP powered via power supply or over USB
- USRP USB port connected to your PC 
- GPS-DO powered via power supply

The GPS-DO will show you with a green LED once it has acquired lock to the GPS signal. It takes time for GPS to operate normally. You will have to wait a little. You should also wait for the red LED(ALARM) to turn off.

## 3. Installation

We will use Ubuntu 17.10 installed PC.

### USRP Hardware Driver

Most Linux distributions provide UHD as part of their package management. On Debian and Ubuntu systems, this will install the base UHD library, all headers and build-specific files, as well as utilities:

```bash
sudo apt-get install libuhd-dev libuhd003 uhd-host
```

After installing, you need to download the FPGA images packages by running _uhd images downloader_ on the command line (the actual path may differ based on your installation):

```bash
sudo /usr/lib/uhd/utils/uhd_images_downloader.py
```

### srsENB

On Ubuntu 17.10, one can install the required libraries with:

```bash
sudo apt-get install cmake libfftw3-dev libmbedtls-dev libboost-program-options-dev libconfig++-dev libsctp-dev
```

Download and build srsLTE:

```bash
git clone https://github.com/srsLTE/srsLTE.git
cd srsLTE
mkdir build
cd build
cmake ../
make
make test
```

### NextEPC

The NextEPC package is available on the recent versions of Ubuntu.

```bash
sudo add-apt-repository ppa:acetcom/nextepc
sudo apt-get update
sudo apt-get -y install nextepc
```

The following shows how to install the Web UI of NextEPC.

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
curl -sL http://nextepc.org/static/webui/install | sudo -E bash -
```

## 4. Configuration & Running

### NextEPC

If you buy the sysmoUSIM, you will receive the following information via e-mail.

```yaml
Title : sysmocom SIM Card Details / AM93\PICK\00859

IMSI    ICCID   ACC PIN1    PUK1    PIN2    PUK2    Ki  OPC ADM1    KIC1    KID1    KIK1
...
901700000017409 8988211000000174097 0200    3605    88246237    9911    70761954    73D16C657E8B434BCFCA74A5269728FE    D7B4CAA787118615B8B06E9A173346FB    19313880    FB0620A741AA4353513D9B0566F34FD1    2D67FB90F35F79C73BF379277C1516DF    28E86C6B000FE1E17387CAC3580AB150
```

Using WebUI, you need to add a subscriber information. It will be running on http://localhost:3000. Login with the default account.

```yaml
Username : admin
Password : 1423
```

And then, proceed the followings.
- Go to Subscriber Menu.
- Click `+` Button to add a new subscriber.
- Fill the IMSI, security context(K, OPc).
- Click `SAVE` Button
```yaml
IMSI : 901700000017409
K : 73D16C657E8B434BCFCA74A5269728FE
OPc : D7B4CAA787118615B8B06E9A173346FB
```

S1AP/GTP-C IP address, PLMN ID, TAC updated in the MME Configuration.
- Add S1AP address : 127.0.1.100 (srsENB Default Value)
- Add GTP-C address : 127.0.1.100 (Use Loopback Interface)
- Change PLMN ID : MNC(901), MCC(70) (sysmoUSIM Default Value)
- Change TAC : 7 (srsENB Default Value)

```yaml
diff -u mme.conf.old mme.conf
--- mme.conf.old	2018-04-15 18:28:31.000000000 +0900
+++ mme.conf	2018-04-15 19:53:10.000000000 +0900
@@ -14,18 +14,20 @@
 mme:
     freeDiameter: mme.conf
     s1ap:
+      addr: 127.0.1.100
     gtpc:
+      addr: 127.0.1.100
     gummei:
       plmn_id:
-        mcc: 001
-        mnc: 01
+        mcc: 901
+        mnc: 70
       mme_gid: 2
       mme_code: 1
     tai:
       plmn_id:
-        mcc: 001
-        mnc: 01
-      tac: 12345
+        mcc: 901
+        mnc: 70
+      tac: 7
     security:
         integrity_order : [ EIA1, EIA2, EIA0 ]
         ciphering_order : [ EEA0, EEA1, EEA2 ]
```

GTP-U IP address updated in the SGW Configuration.
- Add GTP-U address : 127.0.0.2 (Use Loopback Interface)
```yaml
diff -u /etc/nextepc/sgw.conf.old /etc/nextepc/sgw.conf
--- sgw.conf.old	2018-04-15 18:30:25.000000000 +0900
+++ sgw.conf	2018-04-15 18:30:30.000000000 +0900
@@ -14,3 +14,4 @@
     gtpc:
       addr: 127.0.0.2
     gtpu:
+      addr: 127.0.0.2
```

After changing conf files, please restart NextEPC daemons.
```bash
sudo systemctl restart nextepc-mmed
sudo systemctl restart nextepc-sgwd
```

If your phone can connect to internet, you need to execute the following command in NextEPC installed host. Do not miss out on modifying your interface name(e.g enp0s25, wls3).

```bash
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
sudo iptables -t nat -A POSTROUTING -o <'interface-name'> -j MASQUERADE
sudo iptables -I INPUT -i pgwtun -j ACCEPT
```

### srsENB
Change back to the srsENB source directory and copy the main config example as well as all additional config files for RR, SIB and DRB.

```bash
cp srsenb/enb.conf.example srsenb/enb.conf
cp srsenb/rr.conf.example srsenb/rr.conf
cp srsenb/sib.conf.example srsenb/sib.conf
cp srsenb/drb.conf.example srsenb/drb.conf
```

PLMN ID, DL EARFCN, and Device Argument updated in the ENB Configuration.
- Change PLMN ID : MNC(901), MCC(70) (sysmoUSIM Default Value)
- Change DL EARFCN : Band-3 (your Phone)
- Add Device Argument : Clock source from external GPS-DO

** You should check your phone frequence. If your phone is not Band-3, you should use another DL EARFCN value.**

```yaml
diff enb.conf.example enb.conf
25,26c25,26
< mcc = 001
< mnc = 01
---
> mcc = 901
> mnc = 70
67c67,68
< dl_earfcn = 3400
---
> #dl_earfcn = 3400
> dl_earfcn = 1600
74a76
> device_args="clock=external"
```

Now, run the srsENB as follows:

```bash
acetcom@artful:~/Documents/git/srsLTE$ cd srsenb/
acetcom@artful:~/Documents/git/srsLTE/srsenb$ sudo ../build/srsenb/src/srsenb ./enb.conf
linux; GNU C++ version 6.2.0 20161027; Boost_106200; UHD_003.009.005-0-unknow

---  Software Radio Systems LTE eNodeB  ---

Reading configuration file ./enb.conf...
-- Loading firmware image: /usr/share/uhd/images/usrp_b200_fw.hex...
Opening USRP with args: "",master_clock_rate=30.72e6
-- Detected Device: B200
-- Loading FPGA image: /usr/share/uhd/images/usrp_b200_fpga.bin... done
-- Operating over USB 3.
-- Detecting internal GPSDO.... No GPSDO found
-- Initialize CODEC control...
-- Initialize Radio control...
-- Performing register loopback test... pass
-- Performing CODEC loopback test... pass
-- Asking for clock rate 30.720000 MHz...
-- Actually got clock rate 30.720000 MHz.
-- Performing timer loopback test... pass
Setting frequency: DL=1845.0 Mhz, UL=1750.0 MHz
Setting Sampling frequency 11.52 MHz

==== eNodeB started ===
Type <t> to view trace
```

If you see the **No GPSDO found**, please exit the program with Ctrl-C.
The following console output is the correct result of srsENB.
```yaml
linux; GNU C++ version 6.2.0 20161027; Boost_106200; UHD_003.009.005-0-unknow

---  Software Radio Systems LTE eNodeB  ---

Reading configuration file ./enb.conf...
Opening USRP with args: "",master_clock_rate=30.72e6
-- Detected Device: B200
-- Operating over USB 3.
-- Initialize CODEC control...
-- Initialize Radio control...
-- Performing register loopback test... pass
-- Performing CODEC loopback test... pass
-- Asking for clock rate 30.720000 MHz...
-- Actually got clock rate 30.720000 MHz.
-- Performing timer loopback test... pass
Setting frequency: DL=1845.0 Mhz, UL=1750.0 MHz
Setting Sampling frequency 11.52 MHz

==== eNodeB started ===
Type <t> to view trace
```

Turn on your Phone. You can see the real traffic via wireshark[[srsenb.pcapng]](http://nextepc.org/static/pcapng/srsenb.pcapng).

