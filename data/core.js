var workingUrls = ["http://mp3.zing.vn/bai-hat/",
                  "http://mp3.zing.vn/album/",
                  "http://www.nhaccuatui.com/bai-hat/",
                  "http://www.nhaccuatui.com/playlist/",
                  "http://mp3.zing.vn/chu-de/",
                  "http://mp3.zing.vn/bang-xep-hang/"];
function download()
{
  var url = $(location).attr('href');
  downloadSong(url);
}

function downloadSong(url)
{
  //var url = "mp3.zing.vn/bai-hat/Let-Her-Go-Passenger/ZW6006DW.html";

  if(url.indexOf(workingUrls[0])>-1)//ZingMp3 song
  {
    var reg = /mp3\.zing\.vn\/bai-hat\/.*\/(.*)\.html/;
    var songID = reg.exec(url)[1];
    downloadZingSongByID(songID);
    return;
  }
  if(url.indexOf(workingUrls[1])>-1)//ZingMp3 album
  {
    downloadZingAlbum(null);
    return;
  }
  if(url.indexOf(workingUrls[2])>-1)//NCT song
  {
    var reg = /nhaccuatui\.com\/bai-hat\/.*\.(\w+)\.html/;
    var songID = reg.exec(url)[1];
    downloadNCTSongByID(songID);
    return;
  }
  if(url.indexOf(workingUrls[3])>-1)//NCT playlist
  {
    var reg = /nhaccuatui.com\/playlist\/.*\.(\w+)\.html/;
    var listID = reg.exec(url)[1];
    downloadNCTPlaylist(listID);
    return;
  }

  if(url.indexOf(workingUrls[4])>-1)//ZingMp3 playlist
  {
    downloadZingPlaylist(null);
    return;
  }

  if(url.indexOf(workingUrls[5])>-1)//ZingMp3 playlist
  {
    downloadZingBoard(null);
    return;
  }

}

function downloadZingSongByID(songID)
{
  if( songID== null)
  {
    console.log("Lỗi, đường dẫn không hợp lệ!");
    return;
  }
  var url = "http://v3.mp3.zing.vn/download/vip/song/"+songID;
  downloadByInvisibleIframe(url);

}

function downloadZingAlbum(url)
{
  var playlistItems = $("#playlistItems").html();
  var reg = /<li id="song(\w+)" class="fn-playlist-item fn-song/g;
  var songIds = getMatches(playlistItems,reg,1);
  var count = songIds.length;
  var bundle = "";
  var linkArray = [];
  for(i=0 ; i<count; i++)
  {
    bundle += "http://v3.mp3.zing.vn/download/vip/song/"+songIds[i]+"\n";
    linkArray.push("http://v3.mp3.zing.vn/download/vip/song/"+songIds[i]);
  }
  startDownloadQueue(linkArray);


}


function downloadNCTSongByID(songID)
{
  //url = http://www.nhaccuatui.com/download/song/GUZ2lRVLEb;
  if( songID== null)
  {
    console.log("Lỗi, đường dẫn không hợp lệ!");
    return;
  }
  var url = "http://www.nhaccuatui.com/download/song/"+songID;
  $.ajax({
    type: "GET",
    url: url,
    //contentType: "text/xml",
    dataType: "json",
    success: function(data){
      var fileUrl = data.data.stream_url;
      if(fileUrl != null)
      {
        downloadByInvisibleIframe(fileUrl);
      }
      else
      {
        downloadNCTSongByID2(songID);
      }

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
    }
  });

}

function downloadNCTSongByID2(songID)
{
  //url = http://www.nhaccuatui.com/download/song/GUZ2lRVLEb;
  if( songID== null)
  {
    console.log("Lỗi, đường dẫn không hợp lệ!");
    return;
  }
  var flashPlayer = $("#flashPlayer").html();
  var regex = /NCTNowPlaying\.intFlashPlayer\(\"flashPlayer\"\, \"song\"\, \"(\w+)\"\);/;
  var songHash = regex.exec(flashPlayer)[1];
  var url = "http://www.nhaccuatui.com/flash/xml?key1="+songHash;
  $.ajax({
    type: "GET",
    url: url,
    dataType: "xml",
    success: function(xml) {
      var realLink = $(xml).find('tracklist location').text();
      realLink = realLink.replace(/\s+/g, '');
      realLink = realLink.replace(/aredir\.nixcdn\.com/g,'download\.r1\-\-\-vt\.nixcdn\.com');
      realLink = realLink.replace(/f9\.stream\.nixcdn/,'download\.f9\.stream\.nixcdn');
      downloadByInvisibleIframe(realLink);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
    }
  });

}

function downloadNCTPlaylist(url)
{
  var flashPlayer = $("#flashPlayer").html();
  var regex = /NCTNowPlaying\.intFlashPlayer\(\"flashPlayer\", \"playlist\", \"(\w+)\"/;
  var listHash = regex.exec(flashPlayer)[1];
  var url = "http://www.nhaccuatui.com/flash/xml?key2="+listHash;
  var links = [];
  $.ajax({
    type: "GET",
    url: url,
    dataType: "xml",
    success: function(xml) {
      var realLink = $(xml).find('tracklist track location');
      $(realLink).each(function(index){
        var realLink = $(this).text();
        realLink = realLink.replace(/\s+/g, '');
        realLink = realLink.replace(/aredir\.nixcdn\.com/g,'download\.r1\-\-\-vt\.nixcdn\.com');
        realLink = realLink.replace(/f9\.stream\.nixcdn/,'download\.f9\.stream\.nixcdn');
        links.push(realLink);
      });
      startDownloadQueue(links);
      },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert(errorThrown);
    }
  });
}

function downloadZingPlaylist(url)
{
  var playlistItems = $(".list-item.full-width").html();
  var reg = /\<li id=\"song(\w+)\" class="group fn-song\"/g;
  var songIds = getMatches(playlistItems,reg,1);
  var count = songIds.length;
  var bundle = "";
  var linkArray = [];
  for(i=0 ; i<count; i++)
  {
    bundle += "http://v3.mp3.zing.vn/download/vip/song/"+songIds[i]+"\n";
    linkArray.push("http://v3.mp3.zing.vn/download/vip/song/"+songIds[i]);
  }
  startDownloadQueue(linkArray);

}

function downloadZingBoard(url)
{
  var playlistItems = $(".table-body").html();
  var reg = /data-type=\"song" data-id="(\w+)\" data-code=\"/g;
  var songIds = getMatches(playlistItems,reg,1);
  var count = songIds.length;
  var bundle = "";
  var linkArray = [];
  for(i=0 ; i<count; i++)
  {
    bundle += "http://v3.mp3.zing.vn/download/vip/song/"+songIds[i]+"\n";
    linkArray.push("http://v3.mp3.zing.vn/download/vip/song/"+songIds[i]);
  }
  startDownloadQueue(linkArray);

}

function downloadByInvisibleIframe(url) {
  var iframe = $("#corncob");
  if($(iframe).attr("url") == null)
  {
    $('<iframe id="corncob" src="' + url + '" style="width:0px;height:0px;display:none"></iframe>').appendTo("body");
    //window.location.href = url;
  }
  else
  {
    $(iframe).attr("src",url);
  }
}

function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
}

function startDownloadQueue(links)
{
  alert("Bắt đầu tải về sau 5s. Hãy bấm đồng ý nếu Chrome có yêu cầu!");
  var count = 0;
  var length = links.length;
  var queue = setInterval(function(){
    downloadByInvisibleIframe(links[count]);
    count++;
    if(count==length)
    {
      clearInterval(queue);
    }
  },5000);
}
