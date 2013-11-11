d3.csv("./repos_lang_month.csv")
    .row(function(d) { return d; })
    .get(function(error, rows) { console.log(rows); });
