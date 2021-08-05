export class UIHelper {

  /**
   * Get nonce
   *
   * @static
   * @returns {string} Returns random string (32 chars)
   * @memberof UIHelper
   */
  public static getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}