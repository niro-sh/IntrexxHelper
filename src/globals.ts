import { Workplace } from "./system/workplace/workplace";
import { ApplicationViewProvider } from "./ui/snippet/application_view_provider";
import { SnippetViewProvider } from "./ui/snippet/snippet_view_provider";

export class Globals {

  public static workplace: Workplace;
  public static snippetViewProvider: SnippetViewProvider;
  public static applicationViewProvider: ApplicationViewProvider;

}