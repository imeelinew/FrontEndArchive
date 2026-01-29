function ajax(method,url,callback){
        let xhr = new XMLHttpRequest();
        xhr.open(method,url,true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(xhr.responseText);
                }
            }
        }
}