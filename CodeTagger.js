(function() {
    // Default configuration
    var config = {
        startWrapper: "''",
        endWrapper: """"
    };

    // Function to replace wrapped text with <code> elements
    function replaceCodeTags(node, startWrapper, endWrapper) {
        if (node.nodeType === Node.TEXT_NODE) {
            const regex = new RegExp(escapeRegExp(startWrapper) + "(.*?)" + escapeRegExp(endWrapper), 'g');
            const matches = node.textContent.matchAll(regex);
            let lastIndex = 0;
            let newNodes = [];

            for (const match of matches) {
                const [fullMatch, codeContent] = match;
                const matchIndex = match.index;

                if (matchIndex > lastIndex) {
                    newNodes.push(document.createTextNode(node.textContent.slice(lastIndex, matchIndex)));
                }

                const codeElement = document.createElement('code');
                codeElement.textContent = codeContent;
                newNodes.push(codeElement);

                lastIndex = matchIndex + fullMatch.length;
            }

            if (lastIndex < node.textContent.length) {
                newNodes.push(document.createTextNode(node.textContent.slice(lastIndex)));
            }

            if (newNodes.length > 0) {
                const parent = node.parentNode;
                newNodes.forEach(newNode => parent.insertBefore(newNode, node));
                parent.removeChild(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(child => replaceCodeTags(child, startWrapper, endWrapper));
        }
    }

    // Function to escape special characters for regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Function to start the replacement process with the configured wrappers
    function startReplacement() {
        replaceCodeTags(document.body, config.startWrapper, config.endWrapper);
    }

    // Event listener for DOMContentLoaded to ensure the script runs after the DOM is fully loaded
    document.addEventListener("DOMContentLoaded", startReplacement);

    // Expose a global object for configuration
    window.codeWrapperConfig = config;
})();
