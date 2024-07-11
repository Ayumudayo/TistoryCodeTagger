(() => {
    const config = window.codeWrapperConfig || {
        startWrapper: "`",
        endWrapper: "`"
    };

    const replaceCodeTags = (node, startWrapper, endWrapper) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList.contains('MathJax') || node.classList.contains('MathJax_Preview')) {
                return;
            }
        }
        if (node.nodeType === Node.TEXT_NODE) {
            const regex = new RegExp(escapeRegExp(startWrapper) + "(.*?)" + escapeRegExp(endWrapper), 'g');
            let lastIndex = 0;
            let newNodes = [];
            let match;

            while ((match = regex.exec(node.textContent)) !== null) {
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
    };

    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const startReplacement = () => replaceCodeTags(document.body, config.startWrapper, config.endWrapper);

    document.addEventListener("DOMContentLoaded", () => {
        startReplacement();
    });

    window.startReplacement = startReplacement;
})();
