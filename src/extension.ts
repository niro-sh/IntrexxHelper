import * as vscode from 'vscode';
import { Workplace } from './system/workplace/workplace';
import { SnippetViewProvider } from './ui/snippet/snippet_view_provider';

export async function activate(context: vscode.ExtensionContext) {

	// initialize workplace
	const workplace = new Workplace();
	await workplace.initialize();

	// register snippet view provider
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			SnippetViewProvider.viewType, 
			new SnippetViewProvider(context.extensionUri, workplace)
		)
	);

}

export function deactivate() { }
