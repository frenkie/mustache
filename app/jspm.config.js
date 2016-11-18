SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/"
  },
  browserConfig: {
    "baseURL": "/",
    "paths": {
      "mustache/": "./"
    }
  },
  nodeConfig: {
    "paths": {
      "mustache/": ""
    }
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.17"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "mustache": {
      "main": "./js/impl.js",
      "format": "esm",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "dat.gui": "npm:dat.gui@0.6.1",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.1",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "tracking": "npm:tracking@1.1.3"
  },
  meta: {
    "tracking/build/tracking-min.js": {
      "format": "global",
      "exports": "tracking"
    },
    "tracking/build/data/face-min.js": {
      "format": "global",
      "exports": "tracking.ViolaJones.classifiers.face",
      "deps": [
         "tracking/build/tracking-min.js"
      ]
    }
  },
  packages: {}
});
