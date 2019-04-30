---
title: Getting Started
order: 1
page: configuration
---

This post will guide you on how to configure NextEPC.

> Previous step: [Installation](/installation)

<br/>

## Configuration Files

* ### Installed from NextEPC pacakage
/etc/nextepc/ 

    mme.conf           // nextepc-mmed
    sgw.conf           // nextepc-sgwd
    pgw.conf           // nextepc-pgwd
    hss.conf           // nextepc-hssd
    pcrf.conf          // nextepc-pcrfd

* ### Installed from building source codes
Each daemon has a dedicated config file, and the default config files are located in `$PREFIX/etc/nextepc/*.conf`. Depending on what daemons are launched, appropriate config files should be modified. The config can also be explicitly given with the option `[-f config-file]` when a daemon is executed. 
If you run *nextepc-epcd*, the default configuration file is located in `$PREFIX/etc/nextepc/nextepc.conf`.


* ### File format
[YAML](https://yaml.org)


<br/>

## Table of Contents

* ### [Network Settings](/configuration/02-network)
* ### [LTE Settings](/configuration/03-lte)
* ### [Add a UE](/configuration/04-ue)
* ### [FAQ](/configuration/05-faq)

