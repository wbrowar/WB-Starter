// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const glob = require('glob-all'),
      path = require('path'),
      wb = require(`./wb.config.js`);

module.exports = function (api) {
  api.loadSource((store) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api

    store.addMetadata('devMode', process.env.DEV_MODE == 'true' ? true : false);
    store.addMetadata('devDocs', process.env.ENABLE_DOCS == 'true' ? true : false);
  });

  api.createPages(async (api) => {
    // 1. Get the section handle for the Craft entries you want to build out
    // 2. Create a template file in src/templates with the filename that matches the section handle
    // 3. Uncomment the code below and replace 'helloWorld' with the section handle

    // await createPagesForCraftSection('helloWorld', api);

    // Create style inventory pages
    if (process.env.ENABLE_DOCS || false) {
      const componentDocPages = glob.sync(`./_source/_js/automated/dev/*.vue`);
      componentDocPages.forEach((item) => {
        api.createPage({
          path: `/dev/docs/${ path.basename(item, '.vue') }`,
          component: `./_source/_js/automated/dev/${ path.basename(item) }`,
          context: {
            slug: path.basename(item)
          }
        });
      });
    }
  });

  api.configureWebpack({
    resolve: {
      alias: {
        Components: path.resolve(wb.paths.components.src),
        CSS: path.resolve(wb.paths.css.src),
        JS: path.resolve(wb.paths.js.src),
        Source: path.resolve(wb.paths.starter.source),
        Starter: path.resolve(wb.paths.starter.starter),
      }
    }
  })
};

async function createPagesForCraftSection(section, { graphql, createPage }) {
  const { data } = await graphql(`
    query {
      craft {
        entries(limit: null, section: "${ section }") {
          uri
          ... on craft_EntryInterface {
            sectionHandle
          }
        }
      }
    }
  `);

  data.craft.entries.forEach((node) => {
    createPage({
      path: `/${ node.uri }`,
      component: `./src/templates/${ node.sectionHandle }.vue`,
      context: {
        uri: node.uri
      }
    })
  });
}