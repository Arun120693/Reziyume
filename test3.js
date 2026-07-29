let html = "&middot; Lead a team\n&#8226; Oversaw things";
let lines = html.split('\n');
for (const line of lines) {
    let trimmed = line.trim();
    trimmed = trimmed.replace(/^(?:&middot;|&bull;|&#183;|&#8226;)/i, '·');
    console.log(trimmed.match(/^[-*•·◦▪■●○–—]\s*(.*)/));
}
