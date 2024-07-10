(function() {
    // 설정을 로드하거나 기본 설정을 사용합니다
    var config = window.codeWrapperConfig || {
        startWrapper: "``",
        endWrapper: "``"
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

    // Function to load scripts dynamically
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = callback;
        script.onerror = function() {
            console.log('Failed to load script: ' + url);
        };
        document.head.appendChild(script);
    }

    // Function to check if MathJax is required
    function isMathJaxRequired() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].type === 'math/tex' || scripts[i].type === 'math/asciimath') {
                return true;
            }
        }
        var elements = document.body.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].innerHTML.indexOf('$') !== -1 || elements[i].innerHTML.indexOf('\\(') !== -1) {
                return true;
            }
        }
        return false;
    }

    // Function to typeset MathJax
    function typesetMathJax() {
        if (window.MathJax) {
            MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']]
                }
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        } else {
            console.log('MathJax is not available.');
        }
    }

    window.MathJax = {
        tex2jax: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
        }
    };
    
    function loadMathJax() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML";
        
        script.onload = function() {
            console.log("MathJax script loaded.");
            if (typeof MathJax !== 'undefined') {
                MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']]
                    }
                });
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            } else {
                console.error("MathJax failed to load properly");
            }
        };
        
        script.onerror = function() {
            console.error('Failed to load MathJax script');
        };
        
        document.head.appendChild(script);
    }

    // Execute after DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function() {
        startReplacement();

        if (isMathJaxRequired()) {
            console.log("MathJax is required, loading...");
            loadMathJax();
        } else {
            console.log("MathJax is not required.");
        }
    });

    // Config
    window.startReplacement = startReplacement;
})();
