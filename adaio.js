function getAdaIO(uname, feed, aiokey, callback) {
   var adaURL =  "https://io.adafruit.com/api/v2/" + uname + "/feeds/" + feed + "/data/last";
   jQuery.ajax({
    url: adaURL,
    type: "GET",
    headers: {
        "x-aio-key": aiokey,
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
    })
    .done(function(data, textStatus, jqXHR) {
        var value = parseInt(data.value,10);
        // console.log(data);
        callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        if (errorThrown.indexOf("Too Many Requests") >= 0) {
          console.log(errorThrown + ", trying again");
        } else {
          var err = textStatus + ", " + errorThrown;
          console.log( "Connection to cloud service failed: " + err);
        }
    })
}

function getAdaIORange(uname, feed, aiokey, start_time, end_time, callback) {
    // date format: 2019-05-04T00:00
    var adaURL = "https://io.adafruit.com/api/v2/" + uname + "/feeds/" + feed + "/data?start_time=" + start_time + "Z&end_time=" + end_time + "Z";
    jQuery.ajax({
     url: adaURL,
     type: "GET",
     headers: {
        "x-aio-key": aiokey,
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
    })
    .done(function(data, textStatus, jqXHR) {
        var value = parseInt(data.value,10);
        // console.log("VALUE: " + JSON.stringify(data));
        callback(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        if (errorThrown.indexOf("Too Many Requests") >= 0) {
        console.log(errorThrown + ", trying again");
        } else {
        var err = textStatus + ", " + errorThrown;
        console.log( "Connection to cloud service failed: " + err);
        }
    })
}

function setAdaIO(uname, feed, aiokey, theValue) {
    var adaURL =  "https://io.adafruit.com/api/v2/" + uname + "/feeds/" + feed + "/data";

    jQuery.ajax({
    url: adaURL,
    type: "POST",
    headers: {
        "x-aio-key": aiokey,
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    contentType: "application/x-www-form-urlencoded",
    data: {
        "value": theValue,
        },
    })
    .done(function(data, textStatus, jqXHR) {
        console.log("HTTP Request Succeeded: " + jqXHR.status);
        console.log(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //console.log("HTTP Request Failed");
        var err = textStatus + ", " + errorThrown;
        if (errorThrown.indexOf("Too Many Requests") >= 0) {
          console.log(err + ", trying again");
        } else {
          console.log( err);
        }
    });
}
