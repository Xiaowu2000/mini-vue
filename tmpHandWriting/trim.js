function trim(str){
    return str.replace(/\s+$|^\s+/g, '')
}

console.log(trim('   123 3   ').length)