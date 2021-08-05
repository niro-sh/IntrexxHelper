import { Snippet } from "../snippet";
import { SnippetCollection } from "../snippet_collection";
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from "jsdom";

export class BasicSnippetCollection extends SnippetCollection {

  protected snippets: Array<Snippet> = new Array<Snippet>();

  public async fetchSnippets(): Promise<void> {
    const clientPath = this.workplace.clientPath;
    const language = this.workplace.language;

    // build full path to snippet file
    let fullPath = path.join(clientPath, "/cfg/templates/" + this.workplace.workplaceType + "/ixstandard.xml");
    console.log(`snippet path: ${fullPath}`);

    // read content from file
    var content = await fs.promises.readFile(fullPath, "utf8");

    // parse string to dom
    const dom = new JSDOM(content);

    // get template categories
    let templateCategories = dom.window.document.querySelectorAll("template\\:category");

    // loop through template categorie nodes
    for(let i = 0; i < templateCategories.length; i++) {
      // get template categorie
      var templateCategorie = templateCategories[i];

      // get template categorie
      var categoryTitleNode = templateCategorie.querySelector("template\\:title");
      var categoryTitle = categoryTitleNode.querySelector("template\\:item[lang='" + language + "']").textContent;

      // get template nodes
      let templateNodes = templateCategorie.querySelectorAll("template\\:template");

      // loop through template nodes
      for (let j = 0; j < templateNodes.length; j++) {
        // get current node
        var templateNode = templateNodes[j];

        // get title node
        var titleNode = templateNode.querySelector("template\\:title");
        var title = titleNode !== null ? titleNode.querySelector("template\\:item[lang='" + language + "']").textContent : "";

        // get description node
        var descriptionNode = templateNode.querySelector("template\\:description");
        var description = descriptionNode !== null ? descriptionNode.querySelector("template\\:item[lang='" + language + "']").textContent : "";

        // get snippet coding
        var codingNode = templateNode.querySelector("template\\:text");
        var coding = codingNode !== null ? codingNode.textContent : "";

        // get snippet link
        var linkNode = templateNode.querySelector("template\\:link");
        var link = linkNode !== null ? linkNode.textContent : "";

        // add to list
        this.snippets.push(new Snippet(categoryTitle, title, description, coding, link));
      }
    }
  }

  public getList(): Array<Snippet> {
    return this.snippets;
  }

}