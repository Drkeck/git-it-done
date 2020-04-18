var issueContainerEl = document.querySelector("#issues-container");
var limitWarning = document.querySelector('#limit-warning');
var reponameEl = document.querySelector("#repo-name");


var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    
    if (repoName) {

        reponameEl.textContent = repoName;
        getRepoIssues(repoName);

    } else {
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                displayIssues(data);
                if (response.headers.get("link")) {
                    displayWarning(repo)
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "this repo has no open issues!";
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-content-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        issueEl.appendChild(titleEl);

        var typeEl = document.createElement("span");
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(issue)";
        }

        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
}

var displayWarning = function(repo) {
    limitWarning.textContent = "to see more than 30 issues, visit ";
    
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issuses on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarning.appendChild(linkEl);
}

getRepoName();