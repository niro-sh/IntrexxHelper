import { Workplace } from "../workplace/workplace";
import { Snippet } from "./snippet";

export abstract class SnippetCollection {

  protected workplace: Workplace;

  constructor(workplace: Workplace) {
    this.workplace = workplace;
  }

  /**
   * Get snippet list
   *
   * @abstract
   * @returns {Array<Snippet>} Returns list of snippets
   * @memberof SnippetCollection
   */
  public abstract getList(): Array<Snippet>;

  /**
   * Fetch snippets from intrexx client
   *
   * @abstract
   * @returns {Promise<void>} Returns void
   * @memberof SnippetCollection
   */
  public abstract fetchSnippets(): Promise<void>;

}