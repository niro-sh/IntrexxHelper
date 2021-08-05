// @ts-nocheck
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { snippets: [] };
    let snippets = oldState.snippets;

    updateSnippetList(snippets);

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case "refreshSnippets": {
                snippets = message.value;
                updateSnippetList(message.value);
                break;
            }
        }
    });

    function updateSnippetList(snippets) {
        const snippetSearch = document.getElementById("snippetSearch");
        snippetSearch.addEventListener("keyup", event => {
            // get input
            var searchValue = event.target.value.toLowerCase();

            if (searchValue != "") {
                // show all
                document.querySelectorAll(".snippetEntry").forEach(snippetElement => {
                    if (snippetElement.getAttribute("title").toLowerCase().includes(searchValue) ||
                        snippetElement.getAttribute("description").toLowerCase().includes(searchValue) ||
                        snippetElement.getAttribute("content").toLowerCase().includes(searchValue)) {
                        snippetElement.style.display = "block";
                    } else {
                        snippetElement.style.display = "none";
                    }
                });
            } else {
                // show all
                document.querySelectorAll(".snippetEntry").forEach(snippetElement => {
                    snippetElement.style.display = "block";
                });
            }
        });


        // get snippet list
        const snippetList = document.getElementById("snippetList");

        // clear old list
        snippetList.textContent = '';

        // loop through snippets
        for (const snippet of snippets) {
            // create list entry
            const li = document.createElement("li");
            li.className = "snippetEntry";
            li.setAttribute("title", snippet.title);
            li.setAttribute("description", snippet.description);
            li.setAttribute("content", snippet.content);
            li.onclick = function (event) {
                // check user doesn't click on documentation button
                if (!(event.target.className == "snippetDocumentation" 
                        || event.target.className == "snippetDocumentationSVG" 
                        || event.target.parentNode.className.baseVal == "snippetDocumentationSVG" 
                        || event.target.parentNode.className == "snippetDocumentation")) {
                    // fire event
                    onSnippetClicked(snippet);
                } else {
                    // stop click
                    return false;
                }
            }

            // create title
            const title = document.createElement("h3");
            title.innerHTML = snippet.title;
            title.className = "snippetTitle";
            li.appendChild(title);

            // create description
            const description = document.createElement("p");

            // check description is too long 
            if (snippet.description <= 100) {
                description.innerHTML = snippet.description;
            } else {
                description.innerHTML = snippet.description.substring(0, 100) + " [...]";
                description.setAttribute("title", snippet.description);
            }
            description.className = "snippetDescription";
            li.appendChild(description);

            // create category
            const category = document.createElement("span");
            category.className = "snippetCategory";
            category.innerHTML = snippet.category;
            li.appendChild(category);

            // check entry has documentation url
            if (snippet.link != undefined && snippet.link != "") {
                // create div
                const snippetDocumentation = document.createElement("div");
                snippetDocumentation.className = "snippetDocumentation";
                snippetDocumentation.onclick = function () {
                    // open url
                    vscode.postMessage({
                        type: 'openLink',
                        value: snippet.link
                    });
                }
                li.appendChild(snippetDocumentation);

                // create earth svg
                const earthButtonSVG = document.createElement("svg");
                snippetDocumentation.appendChild(earthButtonSVG);
                earthButtonSVG.outerHTML = '<svg class="snippetDocumentationSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.235 6.453a8 8 0 0 0 8.817 12.944c.115-.75-.137-1.47-.24-1.722-.23-.56-.988-1.517-2.253-2.844-.338-.355-.316-.628-.195-1.437l.013-.091c.082-.554.22-.882 2.085-1.178.948-.15 1.197.228 1.542.753l.116.172c.328.48.571.59.938.756.165.075.37.17.645.325.652.373.652.794.652 1.716v.105c0 .391-.038.735-.098 1.034a8.002 8.002 0 0 0-3.105-12.341c-.553.373-1.312.902-1.577 1.265-.135.185-.327 1.132-.95 1.21-.162.02-.381.006-.613-.009-.622-.04-1.472-.095-1.744.644-.173.468-.203 1.74.356 2.4.09.105.107.3.046.519-.08.287-.241.462-.292.498-.096-.056-.288-.279-.419-.43-.313-.365-.705-.82-1.211-.96-.184-.051-.386-.093-.583-.135-.549-.115-1.17-.246-1.315-.554-.106-.226-.105-.537-.105-.865 0-.417 0-.888-.204-1.345a1.276 1.276 0 0 0-.306-.43zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>';
            }


            snippetList.appendChild(li);
        }

        // update saved state
        vscode.setState({ snippets: snippets });
    }

    /**
     * Called when user clicks on snippet
     *
     * @param {*} snippet Clicked snippet
     */
    function onSnippetClicked(snippet) {
        // send message to backend
        vscode.postMessage({
            type: 'snippetSelected',
            value: snippet
        });
    }
}());