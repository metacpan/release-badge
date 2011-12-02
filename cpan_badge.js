// The badge should include: author, date, distribution name, version,
// a link to the direct download URL as well as a link to the
// MetaCPAN release page.
var badge;
var URL;

function handleResponse(response) {
    var json = typeof(response) != "string" ? response : eval('(' + response + ')');
    var name = json.distribution.replace("-", "::");

    // module name
    $('<div />')
    .addClass('cpan-badge-name')
    .append('<a href="https://metacpan.org/module/' + name + '">' + name + '</a>')
    .appendTo(badge);

    var meta_container = $('<div />').addClass('cpan-meta-container');

    // version/date info
    var curDate = new Date(json.date);
    var date = curDate.toDateString();
    $('<div />')
    .addClass('cpan-version')
    .append('v' + json.version + ' (' + date + ')')
    .appendTo(meta_container);

    // module author
    $('<div />')
    .addClass('cpan-credits')
    .append('<a href="https://metacpan.org/author/"' + json.author + '">by ' + json.author + '</a>')
    .appendTo(meta_container);

    meta_container.appendTo(badge);
    
    // module abstract
    var abstractText = (typeof json.abstract == "undefined") ? "" : json.abstract;
    $('<div />')
    .addClass('cpan-abstract')
    .append(abstractText)
    .appendTo(badge);

    // Home/Download links
    $('<div />')
    .addClass('cpan-nav')
    .append('<a class="cpan-home" href="https://metacpan.org/module/' + name + '">Project Home</a> &bull; <a class="cpan-home" href="' + json.download_url + '">Download</a>')
    .appendTo(badge);
}

function initLoadBadge() {
    badge = $(".cpan-badge");
    URL = $(".cpan-badge").attr("proj-url");
    $.support.cors = true;

    //Load badge stylesheet
    if (document.createStyleSheet) {
        document.createStyleSheet('cpan_badge.css');
    } else {
        $("head").append($("<link rel='stylesheet' href='cpan_badge.css' type='text/css' media='screen' />"));
    }

    //Format the badge
    $.get(URL, function(response) {
        handleResponse(response);
    });
}

// adds jQuery to the page if not already loaded
if (typeof jQuery == "undefined") {
    var docHead = document.getElementsByTagName("head")[0];
    var jqScript = document.createElement("script");
    jqScript.type = "application/javascript";
    jqScript.onreadystatechange = function() {
        if (this.readyState === 'complete') {
            initLoadBadge();
        }
    };
    jqScript.onload = initLoadBadge;
    jqScript.src = "http://code.jquery.com/jquery-latest.min.js";
    docHead.appendChild(jqScript);
} else {
    initLoadBadge();
}