use regex::Regex;

pub fn blocked(url:&str)->bool{

    let rules=[
        "doubleclick",
        "adsystem",
        "tracking",
        "adservice"
    ];

    for r in rules{

        if url.contains(r){
            return true
        }
    }

    false
}
