import * as vscode from 'vscode';
import { Globals } from '../../globals';
import { UIHelper } from '../ui_helper';

export class ApplicationViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'intrexxHelper.applicationView';
	private view?: vscode.WebviewView;

	constructor(private readonly extensionUri: vscode.Uri) { }

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

		// send application to webview
		this.refreshApplication();

		// register message event
		webviewView.webview.onDidReceiveMessage(data => {
			// check message type
			switch(data.type) {
			}
		});
	}

	/**
	 * Refresh application
	 *
	 * @memberof ApplicationViewProvider
	 */
	public refreshApplication() {
		if(this.view) {
			this.view.show?.(true);

			// send message to webview
			this.view.webview.postMessage({
				type: 'refreshApplication',
				value: Globals.workplace.snippetCollection?.getList()
			});
		}
	}

	/**
	 * Get HTML for webview
	 *
	 * @private
	 * @param {vscode.Webview} webview Webview
	 * @returns Returns HTML
	 * @memberof ApplicationViewProvider
	 */
	private getHTMLForWebview(webview: vscode.Webview) {
		// get script uri
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui/application', 'main.js'));

		// get style uris
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media/ui/application', 'main.css'));

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
				
				<title>IntrexxHelper: Application</title>
			</head>
			<body>
				<input id="applicationSearch"/>
				<ul id="applicationList">
				</ul>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>`;
	}

}