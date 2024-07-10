(() => {
    const config = window.codeWrapperConfig || {
        startWrapper: "``",
        endWrapper: "``"
    };

    const replaceCodeTags = (node, startWrapper, endWrapper) => {
        if (node.nodeType === Node.ELEMENT_NODE && 
            (node.classList.contains('MathJax') || node.classList.contains('MathJax_Preview'))) {
            return;
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

    const isMathJaxRequired = () => {
        const scripts = Array.from(document.getElementsByTagName('script'));
        if (scripts.some(script => script.type === 'math/tex' || script.type === 'math/asciimath')) {
            return true;
        }
        const elements = Array.from(document.body.getElementsByTagName('*'));
        return elements.some(element => element.innerHTML.includes('$') || element.innerHTML.includes('\\('));
    };

    const loadMathJax = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML";

        script.onload = () => {
            if (typeof MathJax !== 'undefined') {
                MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        ignoreDelimiters: [['`', '`']]
                    }
                });
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                MathJax.Hub.Queue(startReplacement);
            } else {
                console.error("MathJax failed to load properly");
            }
        };

        script.onerror = () => console.error('Failed to load MathJax script');

        document.head.appendChild(script);
    };

    document.addEventListener("DOMContentLoaded", () => {
        startReplacement();

        if (isMathJaxRequired()) {
            loadMathJax();
        }
    });

    window.startReplacement = startReplacement;
})();
