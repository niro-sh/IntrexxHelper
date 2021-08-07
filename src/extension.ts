import * as vscode from 'vscode';
import { Globals } from './globals';
import { Workplace } from './system/workplace/workplace';
import { SnippetViewProvider } from './ui/snippet/snippet_view_provider';

export async function activate(context: vscode.ExtensionContext) {

	// create workplace object
	Globals.workplace = new Workplace();

	// initialize workplace
	await Globals.workplace.initialize();

	// listen to "change active text editor" event
	vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		// initialize workplace
		await Globals.workplace.initialize();

		// refresh workplace webviews
		Globals.workplace.refresh();
	});

	// register snippet view provider
	Globals.snippetViewProvider = new SnippetViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			SnippetViewProvider.viewType, 
			Globals.snippetViewProvider
		)
	);

	// TODO: application
	// // register application view provider
	// Globals.applicationViewProvider = new ApplicationViewProvider(context.extensionUri);
	// context.subscriptions.push(
	// 	vscode.window.registerWebviewViewProvider(
	// 		ApplicationViewProvider.viewType, 
	// 		Globals.applicationViewProvider
	// 	)
	// );

}

export function deactivate() { }
