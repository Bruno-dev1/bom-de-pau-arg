function md5(senha){
  let resp =""
  senha.forEach(letter => {
    letter+="9";
    resp+= letter
  });
  return resp
}

console.log(md5("ola"))