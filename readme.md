# Stratum CMS

[![Build Status](https://travis-ci.org/Registercentrum/stratum-cms.svg?branch=keystone-4-and-node-6)](https://travis-ci.org/Registercentrum/stratum-cms)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Register support
It is currently possible to add multiple registers by running separate instances of keystone from separate `keystone.js` files, prefferably configured as follows:
```
stratum-cms
└── registers
    ├── reg1
    │   ├── .env
    │   └── keystone.js
    └── reg2
        ├── override
	    │   └── styles
        │       └── site.less
        ├── .env
        └── keystone.js
```
With the possibility to override static resources.

## Installation notes
To be able to run the project there needs to ba a .env file including:

* `CLOUDINARY_URL`
* `ROOT` pointing to the root directory (required when running in register directory)
* `BRAND` brand name (optional)

## Environment variables:

All environment variables which are prefixed with `CLIENT_` will be exposed to the frontend application and should therefore never contain any sensitive data.

| Variable name    | Description   | Required  | Default |
| ------------- |---------------| :-----:|:---:|
| `CLOUDINARY_URL` | URI to cloudinary account with API-key  | true |
| `ROOT`           | Points to the directory of the keystone root. Required if the application is running from a directory other than the root folder. E.g. when running from `registers/reg_1/keystone.js` `ROOT` would be `../../`      |   when running in sub-dir | `N/A` |
| `BRAND` | This is used as an identifier in the application, e.g. in azure storage container naming, keystone admin ui naming etc. Should consist of a one word descriptory name [A-Z]      | false | `Stratum` |
| `BRAND_LONG` | Mostly used for setting the title tag | false | value of `BRAND` |
| `STRATUM_API_KEY` | Required for loading metadata about registers from Stratum. Likely not used at the moment | false | `N/A` |
| `MONGO_URI` | Points to the location of the mongodb database needed for keystone to function. Requires a local installation of mongodb if no external URI is assigned. | false | `mongodb://localhost/stratum-cms` |
| `COOKIE_SECRET` | Should contain a random hash for securing cookies | false | |
| `STRATUM_SERVER` | Determines which url all proxied calls to stratum should go through. Should contain an url without protocoll since this is added depending on origin. | false | `stratum.registercentrum.se` |
| `IS_PORTAL` | Determines if the site is a register portal, in short sets up a different start page view where one can add links to multiple registers. | false | `false` |
| `HAS_LOGIN` | If this is set true login functionality to stratum is added to the site. | false | `false` |
| `SHOW_VERSION` | If true shows information about the current running version along with latest commit and branch in the footer. *Currently not implemented in SPA*. | false | `false` |
| `PROTECT_ALL_PAGES` | When set to true a middleware is activated on all pages which requires a Keystone login to continue. *Not verified if this is working under SPA*. | false | `false` |
| `WEBPACK_INDEX_FILE` | Points out a replacement index file for overriding style properties etc. Should be a relative path e.g. `registers/reg_1/index.jsx`. In order for this to work the following file must import the original index file. | false | `N/A` |

## NPM Scripts
* To build the front-end for a specific register run the following command: `npm run  build_register -- $1` where `$1` represents a register name e.g. `boa`. This name should correspond to the register's root folder.
