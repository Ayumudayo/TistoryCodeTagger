(function() {
    var config = window.codeWrapperConfig || {
        startWrapper: "``",
        endWrapper: "``"
    };

    function replaceCodeTags(node, startWrapper, endWrapper) {
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
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function startReplacement() {
        const articles = document.getElementsByTagName('article');
        Array.from(articles).forEach(article => replaceCodeTags(article, config.startWrapper, config.endWrapper));
    }

    function isMathJaxRequired() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].type === 'math/tex' || scripts[i].type === 'math/asciimath') {
                return true;
            }
        }
        const elements = document.body.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].innerHTML.indexOf('$') !== -1 || elements[i].innerHTML.indexOf('\\(') !== -1) {
                return true;
            }
        }
        return false;
    }

    function loadMathJax() {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML";

        script.onload = function() {
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

        script.onerror = function() {
            console.error('Failed to load MathJax script');
        };

        document.head.appendChild(script);
    }

    document.addEventListener("DOMContentLoaded", function() {
        startReplacement();

        if (isMathJaxRequired()) {
            loadMathJax();
        }
    });

    window.startReplacement = startReplacement;
})();
