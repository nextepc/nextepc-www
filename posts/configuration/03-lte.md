---
title: LTE Settings
order: 3
page: configuration
---

Please note that nextepc.conf is used only if NextEPC is executed through *nextepc-epcd*. Otherwise, *mme.conf*, *sgw.conf*, *pgw.conf*, *hss.conf*, and *pcrf.conf* should be modifed for the configuration. 

<br/>

## LTE Settings

* ### PLMN and TAC
PLMN (Public Land Mobile Network) consists of a MCC (Mobile Country Code) and MNC (Mobile Network Code), which is a five- or six-digit number identifying a country and a mobile network operator. TAC (Tracking Area Code) represents a geographical area of the network, the eNodeBs located in TAC are only accepted by the MME.
In `/etc/nextepc/mme.conf`, please modify PLMN and TAC in mme &rarr; gummei and tai:
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

* ### Restarting NextEPC daemons.
After changing config files, please restart NextEPC daemons.
```bash
sudo systemctl restart nextepc-mmed
sudo systemctl restart nextepc-pgwd
sudo systemctl restart nextepc-sgwd
sudo systemctl restart nextepc-hssd
sudo systemctl restart nextepc-pcrfd
```

## Default Config

* ### GUMMEI, PLMN and TAC
```
* GUMMEI
  PLMN ID - MNC: 001, MCC: 01
  MME Group : 2
  MME Code : 1

* TAI
  PLMN ID - MNC: 001, MCC: 01
  TAC : 12345
```

* ### Security
```
* Integrity : EIA1 - SNOW 3G
* Ciphering : EEA0 - null ciphering
```
