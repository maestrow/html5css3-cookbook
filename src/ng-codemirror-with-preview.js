(function() {
    var tpl = 
        '<div class="cm-editor uk-clearfix" data-mode="split">'+
        '  <div class="cm-editor-navbar">'+
        '    <ul class="cm-editor-navbar-nav cm-editor-toolbar">'+
        '      <li><a title="" data-htmleditor-button="bold" data-uk-tooltip="" data-cached-title="Bold"><i class="fa fa-graduation-cap"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="italic" data-uk-tooltip="" data-cached-title="Italic"><i class="fa fa-automobile"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="strike" data-uk-tooltip="" data-cached-title="Strikethrough"><i class="fa fa-child"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="link" data-uk-tooltip="" data-cached-title="Link"><i class="fa fa-cube"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="image" data-uk-tooltip="" data-cached-title="Image"><i class="fa fa-ge"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="blockquote" data-uk-tooltip="" data-cached-title="Blockquote"><i class="fa fa-git"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="listUl" data-uk-tooltip="" data-cached-title="Unordered List"><i class="fa fa-digg"></i></a></li>'+
        '      <li><a title="" data-htmleditor-button="listOl" data-uk-tooltip="" data-cached-title="Ordered List"><i class="fa fa-fax"></i></a></li>'+
        '    </ul>'+
        '    <div class="cm-editor-navbar-flip">'+
        '      <ul class="cm-editor-navbar-nav">'+
        '        <li class="cm-editor-button-code"><a>Markdown</a></li>'+
        '        <li class="cm-editor-button-preview"><a>Preview</a></li>'+
        '        <li><a data-htmleditor-button="fullscreen"><i class="fa fa-recycle"></i></a></li>'+
        '      </ul>'+
        '    </div>'+
        '  </div>'+
        '  <div class="cm-editor-content">'+
        '    <div class="cm-editor-code"></div>'+
        '    <div class="cm-editor-preview"></div>'+
        '  </div>'+
        '</div>';

    var markedOptions = { 
        gfm: true, 
        tables: true, 
        breaks: true, 
        pedantic: true, 
        sanitize: false, 
        smartLists: true, 
        smartypants: false, 
        langPrefix: 'lang-'
    };

    var options = {
        height: '500px'
    };

    var setupEditor = function (editor, parser, options) {
        
        var delay;
        var code =  document.getElementsByClassName('CodeMirror')[0],
            codeContent = document.getElementsByClassName('CodeMirror-sizer')[0],
            codeScroll = document.getElementsByClassName('CodeMirror-scroll')[0],
            preview = document.getElementsByClassName('cm-editor-preview')[0],
            previewPane = document.getElementsByClassName('cm-editor-preview')[0];

        var updatePreview = function () {
            previewPane.innerHTML = parser(editor.getValue());
        }

        code.style.height = options.height;
        preview.style.height = options.height;

        editor.on('change', function() {
            clearTimeout(delay);
            delay = setTimeout(updatePreview, 300);
        });

        codeScroll.addEventListener('scroll', function () {

            var codeHeight       = codeContent.clientHeight - codeScroll.clientHeight,
                previewHeight    = preview.scrollHeight - preview.clientHeight,
                ratio            = previewHeight / codeHeight,
                previewPostition = codeScroll.scrollTop * ratio;

            // apply new scroll
            preview.scrollTop = previewPostition;
        });

        setTimeout(updatePreview, 300);
    };

    angular
        .module("ng-codemirror-with-preview", [])
        .directive("appCodemirror", function() {
            return {
                restrict: "EA",
                link: function (scope, element, attrs) {
                    var CodeMirror = window.CodeMirror;
                    var cmOptions = angular.extend({ value: element.text() }, scope[attrs.cmOptions]);
                    marked.setOptions(markedOptions);

                    element[0].innerHTML = tpl;
                    var codeMirror = CodeMirror(function (cm_el) {
                        document.getElementsByClassName('cm-editor-code')[0].appendChild(cm_el);
                    }, cmOptions);
                    setupEditor(codeMirror, marked, options);
                }
            }
        });
})();