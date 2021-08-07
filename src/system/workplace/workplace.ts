import * as vscode from 'vscode';
import { Globals } from '../../globals';
import { BasicSnippetCollection } from '../snippets/implementation/basic_snippet_collection';
import { SnippetCollection } from "../snippets/snippet_collection";
import { WorkplaceType } from "./workplace_type";

export class Workplace {

  public workplaceType: WorkplaceType;
  public snippetCollection?: SnippetCollection;
  public configuration: vscode.WorkspaceConfiguration;
  public clientPath: string;
  public language: string;

  constructor() {
    // get extension configuration
    this.configuration = vscode.workspace.getConfiguration('intrexxHelper');

    // get global configuration 
    this.clientPath = this.configuration.get("clientPath") ?? "C:/Program Files/intrexx/client/";
    this.language = this.configuration.get("language") ?? "en";

    // set default workplace type
    this.workplaceType = WorkplaceType.ecmaScript;
  }

  /**
   * Initialize workplace
   *
   * @memberof Workplace
   */
  public async initialize() {
    // get language id from active text editor
    let languageId = vscode.window.activeTextEditor?.document.languageId ?? "javascript";
    console.log(`languageId: ${languageId}`);

    // get file name from active text editor
    const fileName = vscode.window.activeTextEditor?.document.fileName;
    // check if file name ends with .vmi -> language id = velocity
    if(fileName?.endsWith(".vmi")) {
      languageId = "velocity";
    }

    // set workplace type by language id
    switch(languageId) {
      case "groovy":
        this.workplaceType = WorkplaceType.groovy;
        break;

      case "velocity":
        this.workplaceType = WorkplaceType.velocity;
        break;

      case "javascript":
        this.workplaceType = WorkplaceType.ecmaScript;
        break;
    }

    // do action by workplace type
    switch(this.workplaceType) {
      default:
        this.snippetCollection = new BasicSnippetCollection(this);
    }

    // fetch snippets
    await this.snippetCollection.fetchSnippets();
  }

  /**
   * Refresh all webviews
   *
   * @memberof Workplace
   */
  public refresh() {
    // refresh snippets
    Globals.snippetViewProvider.refreshSnippets();

    // refresh application
		// Globals.applicationViewProvider.refreshApplication(); TODO: application
  }

}