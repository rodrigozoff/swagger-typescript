import {
  getNamingTag,
  isAscending,
} from "./utils";
import { ApiAST } from "./types";
import { APIS_BEGINNING } from "./strings";

function generateTags(apis: ApiAST[], tags: { name: string }[]): string {
  try {
    let code: string = "";
    if (!tags) {
      tags = [{ name: "__default" }];
    }

    code += APIS_BEGINNING;
    code += ` export class Apis {
        `;
    code += tags
      .sort(({ name }) => isAscending(name, name))
      .reduce(
        (
          prev,
          tag,
        ) => {

          const apisFilterByTag = apis.filter((api) => {
            return api.tags && api.tags.filter((tagApi) =>  tag.name === "__default" || tagApi == tag.name).length > 0;
          });

          if (apisFilterByTag.length === 0) {
            return "";
          }
          if (tag.name === "__default") {
            tag.name = "root";
          }
          let nameApi = getNamingTag(tag.name);

          return (
            prev +
            `
            ${nameApi} = {
    ${apisFilterByTag.map(({ serviceName }) => serviceName + ":" + serviceName)} };
    `)
        }, "");

    code += ` }
          `;
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateTags };
