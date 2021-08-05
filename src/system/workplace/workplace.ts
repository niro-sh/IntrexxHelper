import * as vscode from 'vscode';
import { BasicSnippetCollection } from '../snippets/implementation/basic_snippet_collection';
import { SnippetCollection } from "../snippets/snippet_collection";
import { WorkplaceType } from "./workplace_type";

export class Workplace {

  public workplaceType: WorkplaceType;
  public snippetCollection: SnippetCollection;
  public configuration: vscode.WorkspaceConfiguration;
  public clientPath: string;
  public language: string;

  constructor() {
    // get extension configuration
    this.configuration = vscode.workspace.getConfiguration('intrexxHelper');

    // get global configuration 
    this.clientPath = this.configuration.get("clientPath") ?? "C:/Program Files/intrexx/client/";
    this.language = this.configuration.get("language") ?? "en";

    // get language id from active text editor
    const languageId = vscode.window.activeTextEditor?.document.languageId ?? "javascript";
    console.log(`languageId: ${languageId}`);

    // set workplace type by language id
    switch(languageId) {
      case "groovy":
        this.workplaceType = WorkplaceType.groovy;
        break;

      case "velocity":
        this.workplaceType = WorkplaceType.velocity;
        break;

      case "javascript":
      default:
        this.workplaceType = WorkplaceType.ecmaScript;
        break;
    }

    // do action by workplace type
    switch(this.workplaceType) {
      default:
        this.snippetCollection = new BasicSnippetCollection(this);
    }
  }

  /**
   * Initialize workplace
   *
   * @memberof Workplace
   */
  public async initialize() {
    // fetch snippets
    await this.snippetCollection.fetchSnippets();
  }

}