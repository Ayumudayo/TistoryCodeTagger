# TistoryCodeTagger

티스토리 블로그에 백틱을 통해 쉽게 인라인 코드 블럭을 넣을 수 있게 합니다.

## 적용법
아래를 티스토리 블로그에 html 수정을 통해 삽입합니다.
`<head>`태그 안에 넣으세요

### MathJax를 사용하는 경우
```html
<script>
    // Wrapper 설정정
    window.codeWrapperConfig = {
        startWrapper: "``",
        endWrapper: "``"
    };
    // MathJax 설정
    window.MathJax = {
        tex2jax: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
        }
    };
    // DOMContentLoaded 이벤트 후 CodeTagger 스크립트를 로드하고 실행
    document.addEventListener("DOMContentLoaded", function () {
        function loadScript(url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = callback;
            document.head.appendChild(script);
        }
        // CodeTagger.js 로드
        loadScript("https://ayumudayo.github.io/TistoryCodeTagger/CodeTagger.js", function () {
            console.log("CodeTagger script loaded.");
            if (typeof startReplacement === "function") {
                startReplacement();
                // MathJax 스크립트 로드 후 수식 처리
                loadScript("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML", function () {
                    console.log("MathJax script loaded.");
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                });
            }
        });
    });
</script>
```

### MathJax를 사용하지 않는 경우
```html
<script>
    window.codeWrapperConfig = {
        startWrapper: '``',
        endWrapper: '``'
    };
</script>
<script src="https://ayumudayo.github.io/TistoryCodeTagger/CodeTagger.js"></script>
```


기타 관련 내용은 다음의 링크를 확인하세요.

[티스토리 인라인 코드 태그 래핑 스크립트](https://u-bvm.tistory.com/122)
