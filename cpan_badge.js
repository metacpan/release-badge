//The badge should include: author, date, distribution name, version, a link to the direct download URL as well as a link to the MetaCPAN release page.
var badge;
var URL;
if (typeof jQuery == "undefined") 
{
	var docHead = document.getElementsByTagName("head")[0];
	var jqScript = document.createElement("script");
	jqScript.type = "application/javascript";
	jqScript.onreadystatechange = function () {
      if (this.readyState == 'complete') initLoadBadge();
   	}
   	jqScript.onload = initLoadBadge;
	jqScript.src = "http://code.jquery.com/jquery-latest.min.js";
	docHead.appendChild(jqScript);
}
else 
{
	initLoadBadge();
}

function formatName(name) {
	return name.replace("-", "::");
}


function handleResponse(response)
{
	var json;
	if (typeof response != "string") json = response;
	else json = eval('(' + response + ')');
	var name = formatName(json['distribution']);
	var nameElem = $("<a href='" + "https://metacpan.org/module/" + name + "' class='cpan-badge-name'>" + name + "</a>");
	var credits = $("<a class='cpan-credits'>"+ 'by ' + json['author'] + "</a>")
	//nameElem.hover()
	badge.append(nameElem);
	badge.append(credits);
	var abstractText = (typeof json['abstract'] == "undefined") ? "" : json['abstract'];
	var abstract = $("<a class='cpan-abstract'>" + abstractText + "</a>");
	badge.append(abstract);
	badge.append($("<div class='cpan-nav'><a class='cpan-home' href='" + "https://metacpan.org/module/" + name + "'>Project Home</a> • <a class='cpan-home' href='" + json['download_url'] + "'>Download</a></div>"));
	var curDate = new Date(json['date']);
	date = curDate.toDateString();
	var version = $("<div style='text-align:center;'><a class='cpan-version'>v"+json['version']+ " (" + date + ")</a></div>");
	badge.append(version);
}


function initLoadBadge()
{
	badge = $(".cpan-badge");
	URL = $(".cpan-badge").attr("proj-url");
	$.support.cors = true;
	//Load badge stylesheet
	if (document.createStyleSheet)
	{
        document.createStyleSheet('http://intmax.org/projects/badge/cpan_badge.css');
    }
    else 
    {
        $("head").append($("<link rel='stylesheet' href='http://intmax.org/projects/badge/cpan_badge.css' type='text/css' media='screen' />"));
    }
	//Format the badge
	 $.get(URL, function(response) {
	  		handleResponse(response);
	  });
}