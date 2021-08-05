import * as vscode from 'vscode';
import { Workplace } from '../../system/workplace/workplace';
import { UIHelper } from '../ui_helper';

export class SnippetViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'intrexxHelper.snippetView';
	private view?: vscode.WebviewView;

	constructor(private readonly extensionUri: vscode.Uri, private readonly workplace:  Workplace) { }

	public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken) {
		// save view
		this.view = webviewView;

		// set webview options
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this.extensionUri
			]
		};

		// set html for webview
		webviewView.webview.html = this.getHTMLForWebview(webviewView.webview);

		// send snippets to webview
		this.refreshSnippets();

		// register message event
		webviewView.webview.onDidReceiveMessage(data => {
			// check message type
			switch(data.type) {
				case "snippetSelected": {
					// get clicked snippet content
					let vscodeSnippet: string = data.value.content;

					// replace ${cursor} with $0 to define cursor position
					vscodeSnippet = vscodeSnippet.replace("${cursor}", "$0");

					// insert snippet content in text editor
					vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`${vscodeSnippet}`));
					break;
				}

				case "openLink": {
					// open link
					vscode.env.openExternal(vscode.Uri.parse(data.value));
					break;
				}
			}
		});
	}

	/**
	 * Refresh snippets
	 *
	 * @memberof SnippetViewProvider
	 */
	public refreshSnippets() {
		if(this.view) {
			this.view.show?.(true);

			// send message to webview
			this.view.webview.postMessage({
				type: 'refreshSnippets',
				value: this.workplace.snippetCollection.getList()
			});
		}
	}

	/**
	 * Get HTML for webview
	 *
	 * @private
	 * @param {vscode.Webview} webview Webview
	 * @returns Returns HTML
	 * @memberof SnippetViewProvider
	 */
	private getHTMLForWebview(webview: vscode.Webview) {
		// get script uri
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui/snippet', 'main.js'));

		// get style uris
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui/snippet', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui/snippet', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui/snippet', 'main.css'));

		// get nonce for script
		const nonce = UIHelper.getNonce();

		// return html
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				
				<title>IntrexxHelper: Snippets</title>
			</head>
			<body>
				<input id="snippetSearch"/>
				<ul id="snippetList">
				</ul>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>`;
	}

}