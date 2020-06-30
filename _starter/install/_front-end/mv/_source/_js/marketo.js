//  Marketo
//  📈 Helpers for Marketo landing page templates

import { log } from 'JS/global.js';
import { bodyVars, headVars } from '~/variables.js';

export function getMarketoDescriptions() {
  let descriptions = {
    body: [],
    meta: [],
  };

  bodyVars.forEach((v) => {
    if (v.description) {
      descriptions.body.push({ label: v.label, description: v.description });
    }
  });

  headVars.forEach((v) => {
    if (v.description) {
      descriptions.meta.push({ label: v.label, description: v.description });
    }
  });

  return descriptions;
}

export function getMarketoVariables() {
  let variables = {};

  // Find all meta Marketo variables that have been parsed and saved into the body
  const varsFromMeta = document.querySelectorAll('.marketo_meta_variable');

  // Add each variable after validating their content
  if (varsFromMeta.length) {
    varsFromMeta.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        const name = el.getAttribute('data-name');
        const settings = headVars.find((item) => name === item.id);
        let value = null;

        if (name && settings) {
          switch (settings.type) {
            case 'mktoBoolean':
              value = el.innerHTML === 'true';
              break;
            default:
              value = el.innerHTML;
          }
        }

        if (value !== null) {
          log('Adding meta variable', name);
          variables[name] = value;
        }
      }
    });
  }

  // Find all body Marketo variables
  const varsFromBody = document.querySelectorAll('.marketo_body_variable');

  // Add each variable after validating their content
  if (varsFromBody.length) {
    varsFromBody.forEach((el) => {
      if (el.hasAttribute('data-name')) {
        const name = el.getAttribute('data-name');
        const settings = bodyVars.find((item) => name === item.id);
        let value = null;

        if (name && settings) {
          switch (settings.type) {
            case 'mktoImg': {
              const mktoImgImage = document.getElementById(name);
              if (mktoImgImage) {
                value = {
                  alt: mktoImgImage.alt || '',
                  src: mktoImgImage.src || '',
                };
              }
              break;
            }
            default:
              value = el.innerHTML;
          }
        }

        if (value !== null) {
          log('Adding meta variable', name);
          variables[name] = value;
        }
      }
    });
  }

  // Fill in any missing variables with default values found in wb.config.js
  headVars.forEach((v) => {
    if (!Object.keys(variables).includes(v.id)) {
      log('Adding meta variable from fallback', v.id);
      variables[v.id] = v.default || false;
    }
  });
  bodyVars.forEach((v) => {
    if (!Object.keys(variables).includes(v.id)) {
      log('Adding meta variable from fallback', v.id);
      variables[v.id] = v.default || false;
    }
  });

  return variables;
}

// INIT FUNCTIONS
log('Marketo');
