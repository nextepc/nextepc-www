---
title: openSUSE
order: 7
page: installation
---

Verified on openSUSE Leap 15, 42 series and Tumbleweed.

<br/>

## Package Installation

This section explains how to install NextEPC using the package manager `zypper`.

* ### Install NextEPC 
Install NextEPC daemons which consist of *nextepc-mmed*, *nextepc-sgwd*, *nextepc-pgwd*, *nextepc-hssd*, and *nextepc-pcrfd*:
```bash
sudo zypper addrepo -f obs://home:mnhauke:nextepc home:mnhauke:nextepc
sudo zypper install nextepc
sudo zypper install mongodb-server mongodb-shell
```

* ### Install Node.js
[Node.js](https://nodejs.org) is required to install NextEPC WebUI.
For example, to install Node.js 8.x on openSUSE Tumbleweed, run the following command as root:
```bash
sudo zypper install nodejs8
```

* ### Install the dependencies of WebUI
Install Web User Interface (WebUI) which supports the user subscription management:
```bash
git clone https://github.com/nextepc/nextepc
cd nextepc/webui
npm install
```

* ### Run WebUI
Visit [http://localhost:3000](http://localhost:3000), after run the command:
```bash
npm run dev
```

> Next step: [Configuration](/configuration)
