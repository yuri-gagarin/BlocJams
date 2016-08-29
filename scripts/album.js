



var createSongRow = function(songNumber, songName, songLength) {
    
    //create a template for albumv view song rows
    var template =
          '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
    
    var $row = $(template);
    
    
    // clickhandler function
    var clickHandler = function() {
	var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	    }
	if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];
        updatePlayerBarSong();
	} else if (currentlyPlayingSongNumber === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
		currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
        }
    };
    
    //listens to hover event
    var onHover = function(event) {
        
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        // if mouse pointer over a song which is not playing, play button shows
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

    };
    // listens for when mouse pointer leaves element
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        // if mouse pointer leaves the song which is not playing
        // play button switches back to song number
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }   
    };
    //call the clickHandler
    $row.find('.song-item-number').click(clickHandler);
    //call the onHover offHover functions
    $row.hover(onHover, offHover);
    
    return $row;
    
};
// function to set current album
var setCurrentAlbum = function(album) {
     
     currentAlbum = album;
    //variables to display current album in
     //album view
     var $albumTitle = $(".album-view-title");
     var $albumArtist = $(".album-view-artist");
     var $albumReleaseInfo = $(".album-view-release-info");
     var $albumImage = $(".album-cover-art");
     var $albumSongList = $(".album-view-song-list");
     
     //populate the template with info from an album object
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year+" "+album.label);
     $albumImage.attr("src", album.albumArtUrl);
     
     //make sure innerHTML of albumSongList is empty
     $albumSongList.empty();
    
     for (var i = 0; i < album.songs.length; i++) {
         /*Loop through the songs array in the album object, populate
         the song rows and append them*/
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         
         $albumSongList.append($newRow);
         
     }
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}
 
var updatePlayerBarSong = function() {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
};

var nextSong = function() {
   
    var getLastSongNum = function(ind) {
        return ind == 0 ? currentAlbum.songs.length : ind;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    //set a current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    //update the player bar
    
    var lastSongNumber = getLastSongNum(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {
   
    var getLastSongNum = function(ind) {
        return ind == (currentAlbum.songs.length - 1) ? 1 : ind + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex--;
    
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    //set a current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    //update the player bar
    
    var lastSongNumber = getLastSongNum(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};
//templates for play/pause buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//templates for play/pause buttons at the player bar
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';



var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');



//set the album when document loads
 $(document).ready(function() {
     setCurrentAlbum(albumMarconi);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
});