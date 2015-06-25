# Stratum CMS [![Stories in Ready](https://badge.waffle.io/registercentrum/stratum-cms.png?label=ready&title=Ready)](http://waffle.io/registercentrum/stratum-cms) [![Stories in Progress](https://badge.waffle.io/registercentrum/stratum-cms.png?label=in+Progress&title=In%20Progress)](http://waffle.io/registercentrum/stratum-cms)


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

